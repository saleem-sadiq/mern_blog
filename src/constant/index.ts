const navigation: {
  link: string;
  title: string;
  submenu?: { link: string; text: string }[]; // Optional submenu property
}[] = [
  {
    link: "/",
    title: "Home",
  },
  {
    link: "/about",
    title: "About Us",
  },
  {
    link: "/blogs",
    title: "My Blogs",
  },
];

export { navigation };
