/* Display helpers */
const dateFmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" });

export const formatDate = (iso) => (iso ? dateFmt.format(new Date(`${iso.slice(0, 10)}T12:00:00`)) : "");

export const hostOf = (url) => {
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return url;
  }
};

export const initialsOf = (name) =>
  name
    .replace(/&/g, " ")
    .split(/[\s-]+/)
    .filter((w) => w && !/^(of|and|the)$/i.test(w))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

/** Blog cover: the CMS image, else public/images/blog/<slug>.webp */
export const coverOf = (post) => post.image || `/images/blog/${post.slug}.webp`;
