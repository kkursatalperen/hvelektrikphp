export const heroSlides = [
  {
    id: 1,
    image: "https://images.pexels.com/photos/170465/pexels-photo-170465.jpeg",
    subKey: "hero1_sub",
    titleKey: "hero1_title",
    descKey: "hero1_desc",
    ctaKey: "hero1_cta",
    link: "/hakkimizda",
  },
  {
    id: 2,
    image: "https://images.pexels.com/photos/27637329/pexels-photo-27637329.jpeg",
    subKey: "hero2_sub",
    titleKey: "hero2_title",
    descKey: "hero2_desc",
    ctaKey: "hero2_cta",
    link: "/hizmetler",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1638068109816-651dc602fe4c",
    subKey: "hero3_sub",
    titleKey: "hero3_title",
    descKey: "hero3_desc",
    ctaKey: "hero3_cta",
    link: "/hizmetler/epc-proje-yonetimi",
  },
];

export const categories = [
  {
    id: 1,
    titleKey: "cat1_title",
    subKey: "cat1_sub",
    icon: "tower",
    link: "/hizmetler/epc-proje-yonetimi",
    image: "https://images.pexels.com/photos/9800029/pexels-photo-9800029.jpeg",
    descKey: "cat1_desc",
  },
  {
    id: 2,
    titleKey: "cat2_title",
    subKey: "cat2_sub",
    icon: "factory",
    link: "/hizmetler/guc-sistemleri-panolar",
    image: "https://images.pexels.com/photos/257700/pexels-photo-257700.jpeg",
    descKey: "cat2_desc",
  },
  {
    id: 3,
    titleKey: "cat3_title",
    subKey: "cat3_sub",
    icon: "truck",
    link: "/hizmetler/salt-sahalari-altyapi",
    image: "https://images.pexels.com/photos/906494/pexels-photo-906494.jpeg",
    descKey: "cat3_desc",
  },
  {
    id: 4,
    titleKey: "cat4_title",
    subKey: "cat4_sub",
    icon: "cog",
    link: "/hizmetler/isletme-bakim-hizmetleri",
    image: "https://images.pexels.com/photos/17842832/pexels-photo-17842832.jpeg",
    descKey: "cat4_desc",
  },
  {
    id: 5,
    titleKey: "cat5_title",
    subKey: "cat5_sub",
    icon: "tower",
    link: "/hizmetler/elektrik-taahhut-hizmetleri",
    image: "https://images.pexels.com/photos/11477908/pexels-photo-11477908.jpeg",
    descKey: "cat5_desc",
  },
];


export const counters = [
  { id: 1, value: 80, suffix: "+", labelKey: "counter_countries", icon: "globe" },
  { id: 2, value: 1000, suffix: "+", labelKey: "counter_employees", icon: "users" },
  { id: 3, value: 7, suffix: "", labelKey: "counter_factories", icon: "factory" },
  { id: 4, value: 25, suffix: "+", labelKey: "counter_years", icon: "award" },
];

export const navigation = [
  {
    titleKey: "about",
    link: "/hakkimizda",
    dropdown: [
      { titleKey: "overview", link: "/hakkimizda" },
      { titleKey: "history", link: "/hakkimizda/tarihce" },
      { titleKey: "group", link: "/hakkimizda/grup" },
    ],
  },
  {
    titleKey: "services",
    link: "/hizmetler",
    dropdown: [
      { titleKey: "epc", link: "/hizmetler/epc-proje-yonetimi" },
      { titleKey: "production", link: "/hizmetler/guc-sistemleri-panolar" },
      { titleKey: "sales", link: "/hizmetler/salt-sahalari-altyapi" },
      { titleKey: "engineering", link: "/hizmetler/isletme-bakim-hizmetleri" },
      { titleKey: "contracting", link: "/hizmetler/elektrik-taahhut-hizmetleri" },
    ],
  },
  {
    titleKey: "sustainability",
    link: "/surdurulebilirlik",
    dropdown: [
      { titleKey: "environment", link: "/surdurulebilirlik/cevre" },
      { titleKey: "quality", link: "/surdurulebilirlik/kalite" },
    ],
  },
 {
  titleKey: "projects",
  link: "/projeler",
  dropdown: [
    { titleKey: "ongoing_projects", link: "/projeler/devam-eden" },
    { titleKey: "completed_projects", link: "/projeler/tamamlanan" },
  ],
},
  { titleKey: "career", link: "/kariyer" },
  { titleKey: "contact", link: "/iletisim" },
];

export const footerLinks = {
  hizli: [
    { titleKey: "overview", link: "/hakkimizda" },
    { titleKey: "history", link: "/hakkimizda/tarihce" },
    { titleKey: "group", link: "/hakkimizda/grup" },
  ],
  yatirim: [
    { titleKey: "sustainability", link: "/surdurulebilirlik" },
    { titleKey: "projects", link: "/projeler" },
    { titleKey: "career", link: "/kariyer" },
  ],
};