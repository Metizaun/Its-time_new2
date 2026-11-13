/**
 * Copy of the segment pages (/clinicas, /oticas). Every capability named here is one the product already shows
 * elsewhere on the site (home demo, blog, tutorials, docs): no numbers, prices or client names.
 */
/** Draft written by the main session; each segment session owns and may reshape its own file. */
export type Solution = {
  path: string;
  segment: string;
  metaTitle: string;
  metaDescription: string;
  kicker: string;
  title: string;
  lede: string;
  message: string;
  features: { title: string; text: string }[];
  steps: { title: string; text: string }[];
  links: { href: string; label: string; text: string }[];
  faq: { question: string; answer: string }[];
};

