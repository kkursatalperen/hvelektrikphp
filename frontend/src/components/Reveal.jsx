import React, { useEffect, useRef, useState } from "react";

/**
 * Reveal — element ekranda görünür hale geldiğinde yumuşakça beliren
 * (fade-in + slide-up) hafif bir wrapper. Dış kütüphaneye ihtiyaç duymaz,
 * tarayıcının IntersectionObserver API'sini kullanır.
 *
 * Kullanım:
 *   <Reveal><div>...</div></Reveal>
 *   <Reveal delay={150} direction="right">...</Reveal>
 *
 * Props:
 *   delay      — ms cinsinden gecikme (varsayılan 0)
 *   direction  — "up" | "down" | "left" | "right" (varsayılan "up")
 *   distance   — px cinsinden kayma mesafesi (varsayılan 24)
 *   once       — true ise sadece ilk görünüşte animasyon oynar (varsayılan true)
 *   as         — sarmalayıcı element tipi (varsayılan "div")
 */
const OFFSETS = {
  up: "translateY(24px)",
  down: "translateY(-24px)",
  left: "translateX(24px)",
  right: "translateX(-24px)",
};

const Reveal = ({
  children,
  delay = 0,
  direction = "up",
  distance,
  once = true,
  as: Tag = "div",
  className = "",
  ...rest
}) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            if (once) observer.unobserve(el);
          } else if (!once) {
            setVisible(false);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once]);

  const offset = distance != null
    ? OFFSETS[direction].replace(/[\d.]+px/, `${distance}px`)
    : OFFSETS[direction] || OFFSETS.up;

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translate(0,0)" : offset,
        transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
        willChange: "opacity, transform",
        ...rest.style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
};

export default Reveal;
