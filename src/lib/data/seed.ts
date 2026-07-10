import type { Category, Product, ProductColor, ProductSize } from "@/lib/types";

/**
 * Live catalog.
 *
 * Every product ships with a real mockup stored in `/public/products`, so the
 * storefront renders identically in local dev and in production with no external
 * image host. Prices are integer USD cents.
 *
 * Products carry NO reviews and NO rating. This shop has not sold anything yet,
 * so there is nothing honest to display — and inventing reviews (the sample
 * catalog used to) is illegal in several markets and gets payment accounts
 * closed. Ratings appear here only once real customers leave them.
 *
 * To add a product: drop the image in `public/products/<slug>.jpg` and add a
 * matching entry to DEFS below (or use the /admin dashboard, which persists to
 * the database / catalog.json instead).
 */

function sizes(oos: string[] = []): ProductSize[] {
  return ["S", "M", "L", "XL", "2XL", "3XL"].map((label) => ({
    label,
    inStock: !oos.includes(label),
  }));
}

export const categories: Category[] = [
  {
    slug: "tees",
    title: "Graphic Tees",
    description: "Heavyweight cotton canvases — nature, cats and everyday chaos.",
    heroImage: "/products/wild-waters-trout.jpg",
  },
  {
    slug: "seasonal",
    title: "Halloween & Holiday",
    description: "Spooky-season ghosts and cosy holiday drops.",
    heroImage: "/products/spooky-and-feral.jpg",
  },
  {
    slug: "bootleg",
    title: "Fan & Bootleg",
    description: "Vintage-wash tributes to the icons you love.",
    heroImage: "/products/morgan-wallen-vintage.jpg",
  },
];

type Def = {
  slug: string;
  title: string;
  short: string;
  desc: string;
  price: number;
  compareAt?: number;
  category: string;
  color: { name: string; hex: string };
  badges: string[];
  featured?: boolean;
  tags: string[];
  twoSided?: boolean;
  oos?: string[];
};

const DEFS: Def[] = [
  {
    slug: "gentle-parenting-dropout",
    title: "Gentle Parenting Dropout Tee",
    short: "Coquette raccoon on Comfort Colors Chambray.",
    desc: "A pink-glasses raccoon sipping an iced coffee — 'Gentle Parenting Dropout, est. this morning.' Garment-dyed Comfort Colors in Chambray with a relaxed unisex fit and a soft, ringspun hand-feel.",
    price: 2799,
    compareAt: 3400,
    category: "tees",
    color: { name: "Chambray", hex: "#b9d0dd" },
    badges: ["New"],
    tags: ["funny", "coquette", "comfort-colors", "raccoon"],
  },
  {
    slug: "spooky-and-feral",
    title: "Spooky and Feral Halloween Tee",
    short: "Ghost, raccoon, pumpkin & skeleton cat.",
    desc: "Four little trick-or-treaters in a row — 'Spooky and Feral.' Vintage-illustrated Halloween print on a soft white heavyweight cotton tee with an oversized drop-shoulder fit.",
    price: 2699,
    category: "seasonal",
    color: { name: "White", hex: "#f7f7f4" },
    badges: ["Halloween"],
    tags: ["halloween", "spooky", "cats", "funny"],
  },
  {
    slug: "ghost-raccoon-iced-coffee",
    title: "Ghost Raccoon Iced Coffee Tee",
    short: "Moody Halloween drop on Espresso.",
    desc: "A sheet-ghost raccoon in sunglasses clutching an iced coffee and a candy pumpkin. Printed on a rich Espresso garment-dyed tee — the moody autumn staple you'll reach for all October.",
    price: 2899,
    compareAt: 3400,
    category: "seasonal",
    color: { name: "Espresso", hex: "#4b3a2f" },
    badges: ["Halloween", "Staff pick"],
    featured: true,
    tags: ["halloween", "coffee", "raccoon", "comfort-colors"],
  },
  {
    slug: "grinch-christmas-stamps",
    title: "Holiday Stamps Christmas Tee",
    short: "Retro postage-stamp holiday collage.",
    desc: "Six pastel holiday 'stamps' — tree, presents, pup and a certain grumpy green icon. A festive, hand-drawn Christmas print on a cream heavyweight tee. Cosy-season ready.",
    price: 2799,
    category: "seasonal",
    color: { name: "Ivory", hex: "#efe9dc" },
    badges: ["Holiday"],
    tags: ["christmas", "holiday", "cute", "festive"],
  },
  {
    slug: "ghost-raccoon-pumpkins",
    title: "Ghost Raccoon Pumpkin Tee",
    short: "Cottagecore Halloween on Blue Spruce.",
    desc: "A little ghost-sheet raccoon with a pink drink between two jack-o'-lanterns and a scatter of bats. Printed on a Blue Spruce Comfort Colors tee — vintage, muted and endlessly cosy.",
    price: 2899,
    category: "seasonal",
    color: { name: "Blue Spruce", hex: "#3b5b53" },
    badges: ["Halloween"],
    tags: ["halloween", "raccoon", "pumpkin", "comfort-colors"],
  },
  {
    slug: "sabrina-carpenter-vintage",
    title: "Sabrina Carpenter Vintage Bootleg Tee",
    short: "'90s-style bootleg rap tee homage.",
    desc: "A washed vintage-bootleg layout with a signature finish — the fan tee for the era. Oversized boxy fit on a garment-dyed Pepper tee with a lived-in, already-your-favourite feel.",
    price: 2999,
    compareAt: 3500,
    category: "bootleg",
    color: { name: "Pepper", hex: "#6a6a6a" },
    badges: ["Limited"],
    featured: true,
    tags: ["music", "bootleg", "vintage", "pop"],
  },
  {
    slug: "kelly-clarkson-vintage",
    title: "Kelly Clarkson Vintage Bootleg Tee",
    short: "Sepia bootleg concert tribute.",
    desc: "'What doesn't kill you makes you stronger' — a warm sepia bootleg collage on a washed black tee. Heavyweight cotton, relaxed fit and a genuine vintage-band-tee drape.",
    price: 2999,
    category: "bootleg",
    color: { name: "Black", hex: "#1c1c1c" },
    badges: ["Limited"],
    tags: ["music", "bootleg", "vintage", "pop"],
  },
  {
    slug: "tinkerbell-wings",
    title: "Fairy Wings Two-Sided Tee",
    short: "Front character, glowing wings on the back.",
    desc: "A dainty fairy on the front and a shimmering pair of sparkle-dusted wings across the back. Two-sided print on a Moss Comfort Colors tee — magical without trying too hard.",
    price: 3199,
    category: "bootleg",
    color: { name: "Moss", hex: "#5a6141" },
    badges: ["New"],
    twoSided: true,
    tags: ["fairy", "two-sided", "comfort-colors", "cute"],
  },
  {
    slug: "scarlet-season-doodle",
    title: "Scarlet Season Doodle Tee",
    short: "Pocket print front, full doodle back.",
    desc: "A tiny winged critter on the chest and a whole sketchbook of pink doodles across the back. Clean white cotton, oversized streetwear fit — front-and-back print for maximum charm.",
    price: 2899,
    category: "bootleg",
    color: { name: "White", hex: "#f7f7f4" },
    badges: ["New"],
    twoSided: true,
    tags: ["doodle", "two-sided", "trendy", "cute"],
  },
  {
    slug: "morgan-wallen-vintage",
    title: "Morgan Wallen Vintage Bootleg Tee",
    short: "Country bootleg washed-black tee.",
    desc: "A gritty black-and-white bootleg collage with a signature scrawl — the country fan tee done right. Acid-washed heavyweight cotton with a broken-in, oversized fit.",
    price: 2999,
    compareAt: 3600,
    category: "bootleg",
    color: { name: "Washed Black", hex: "#2b2b2b" },
    badges: ["Staff pick", "Limited"],
    featured: true,
    tags: ["country", "music", "bootleg", "vintage"],
  },
  {
    slug: "chris-brown-breezy-bowl-moss",
    title: "Breezy Bowl Tour Tee — Moss",
    short: "Front portrait, full tour back print.",
    desc: "A profile portrait up front and a full stadium-tour back print with city dates. Two-sided design on a Moss garment-dyed tee — the collector's fan piece.",
    price: 2999,
    category: "bootleg",
    color: { name: "Moss", hex: "#7d8466" },
    badges: ["Limited"],
    twoSided: true,
    tags: ["music", "tour", "two-sided", "rnb"],
  },
  {
    slug: "chris-brown-breezy-bowl-blossom",
    title: "Breezy Bowl Tour Tee — Blossom",
    short: "Front + back tour print on soft pink.",
    desc: "The same stadium-tour design in a softer palette — live shot on the front, full tour back print. Printed on a Blossom pink tee with a relaxed everyday fit.",
    price: 2999,
    category: "bootleg",
    color: { name: "Blossom", hex: "#f3d3da" },
    badges: ["Limited"],
    twoSided: true,
    tags: ["music", "tour", "two-sided", "rnb"],
  },
  {
    slug: "bald-eagle-moon",
    title: "Bald Eagle & Moon Vintage Tee",
    short: "'90s nature-wear eagle graphic.",
    desc: "A soaring bald eagle against a full moon and a flock in flight — that classic '90s nature-tee energy. Printed big and bold on a washed black heavyweight tee.",
    price: 2899,
    category: "tees",
    color: { name: "Washed Black", hex: "#2a2a2a" },
    badges: ["New"],
    tags: ["nature", "eagle", "vintage", "americana"],
  },
  {
    slug: "vintage-pheasants",
    title: "Vintage Pheasants Tee",
    short: "Hand-painted upland game birds.",
    desc: "A watercolour trio of ring-necked pheasants flushing from the grass. Soft, muted and heirloom-feeling on an ivory garment-dyed tee — made for the field-and-stream set.",
    price: 2699,
    category: "tees",
    color: { name: "Ivory", hex: "#efe9dc" },
    badges: [],
    tags: ["nature", "birds", "hunting", "watercolor"],
  },
  {
    slug: "wolves-of-the-north",
    title: "Wolves of the North Tee",
    short: "Detailed greyscale wilderness scene.",
    desc: "A pack of wolves beneath a mountain river valley, rendered in fine greyscale detail. A statement nature print on a charcoal heavyweight tee — quietly epic.",
    price: 2899,
    compareAt: 3400,
    category: "tees",
    color: { name: "Charcoal", hex: "#3a3a3a" },
    badges: ["Staff pick"],
    featured: true,
    tags: ["nature", "wolves", "wilderness", "vintage"],
  },
  {
    slug: "spider-bones",
    title: "Spider Bones Tee",
    short: "Dripping bone-spider centre print.",
    desc: "A skeletal spider emblem in dripping bone-white ink — minimal, gothic and just the right amount of unsettling. Centred on a washed black heavyweight tee.",
    price: 2799,
    category: "tees",
    color: { name: "Washed Black", hex: "#2b2b2b" },
    badges: ["New"],
    tags: ["gothic", "spider", "streetwear", "grunge"],
  },
  {
    slug: "hot-girls-hit-curbs",
    title: "Hot Girls Hit Curbs Tee",
    short: "'Pretty. Powerful. Slightly unhinged.'",
    desc: "A retro pin-up mouse flooring a pink convertible — 'Hot Girls Hit Curbs: flawless driving, questionable turning.' A cheeky vintage-poster print on an ivory heavyweight tee.",
    price: 2799,
    category: "tees",
    color: { name: "Ivory", hex: "#efe9dc" },
    badges: ["New"],
    featured: true,
    tags: ["funny", "retro", "meme", "girly"],
  },
  {
    slug: "i-eat-cement",
    title: "I Eat Cement Cats Meme Tee",
    short: "Chaotic cats + a bag of Portland cement.",
    desc: "Three unbothered cats guarding a 50kg bag of cement — 'I Eat Cement.' Peak absurd internet energy, printed big on a soft white heavyweight tee. IYKYK.",
    price: 2699,
    category: "tees",
    color: { name: "White", hex: "#f7f7f4" },
    badges: ["Staff pick"],
    tags: ["meme", "cats", "funny", "cursed"],
  },
  {
    slug: "great-blue-heron",
    title: "Great Blue Heron Tee",
    short: "Wetland herons in soft watercolour.",
    desc: "A pair of great blue herons over a misty marsh at dawn, painted in gentle naturalist watercolour. A calm, elegant print on an ivory garment-dyed tee.",
    price: 2699,
    category: "tees",
    color: { name: "Ivory", hex: "#efe9dc" },
    badges: [],
    tags: ["nature", "birds", "watercolor", "coastal"],
  },
  {
    slug: "just-a-silly-goose",
    title: "Just a Silly Goose Tee",
    short: "Four geese, four holiday moods.",
    desc: "A snorkelling goose, a watermelon goose, a beach-hat goose and a Hawaiian-shirt goose — 'Just a Silly Goose.' Pure summer-camp joy on a soft natural heavyweight tee.",
    price: 2699,
    category: "tees",
    color: { name: "Natural", hex: "#f2efe6" },
    badges: ["Staff pick"],
    featured: true,
    tags: ["funny", "goose", "cute", "summer"],
  },
  {
    slug: "surf-day-duck",
    title: "Surf Day Duck Tee",
    short: "'A good time for ride the wave.'",
    desc: "A cap-and-shades duck carving a wave on a red board — bright, cartoonish and grinning. A feel-good summer print on a clean white heavyweight tee.",
    price: 2599,
    category: "tees",
    color: { name: "White", hex: "#f7f7f4" },
    badges: ["New"],
    tags: ["funny", "duck", "summer", "cartoon"],
  },
  {
    slug: "wild-waters-trout",
    title: "Wild Waters Trout Tee",
    short: "'Live. Explore. Fish.' — est. 2026.",
    desc: "A watercolour cutthroat trout beneath a mountain river scene — 'Wild Waters: pure, clear, wild.' The angler's everyday tee on ivory garment-dyed cotton.",
    price: 2799,
    category: "tees",
    color: { name: "Ivory", hex: "#efe9dc" },
    badges: [],
    tags: ["nature", "fishing", "outdoors", "watercolor"],
  },
  {
    slug: "blocky-knight-cat",
    title: "Blocky Knight Cat Tee",
    short: "Armoured kitten with sword & shield.",
    desc: "A tiny knight cat in a mossy helmet, guarding a pixel-block dungeon with a gem sword and wooden shield. A charming gamer print on a white heavyweight tee.",
    price: 2799,
    category: "tees",
    color: { name: "White", hex: "#f7f7f4" },
    badges: ["New"],
    tags: ["gaming", "cats", "cute", "fantasy"],
  },
  {
    slug: "certified-freak-cat",
    title: "Certified Freak Cat Meme Tee",
    short: "Derpy cat, ransom-note lettering.",
    desc: "A gloriously derpy cat crowned 'Certified Freak' in cut-out ransom-note type. Loud, dumb and perfect — printed on a soft white heavyweight tee.",
    price: 2699,
    category: "tees",
    color: { name: "White", hex: "#f7f7f4" },
    badges: [],
    tags: ["meme", "cats", "funny", "cursed"],
  },
  {
    slug: "later-pre-k-grader",
    title: "Later Pre-K Grader Tee",
    short: "Last-day-of-school gator graphic.",
    desc: "A grinning alligator on candy stripes — 'Later Pre-K Grader.' The end-of-year keepsake tee for little graduates, printed on a Denim garment-dyed Comfort Colors tee.",
    price: 2699,
    category: "tees",
    color: { name: "Denim", hex: "#4a5a72" },
    badges: ["New"],
    tags: ["kids", "school", "cute", "comfort-colors"],
  },
];

export const products: Product[] = DEFS.map((d) => {
  const image = `/products/${d.slug}.jpg`;
  const colors: ProductColor[] = [{ name: d.color.name, hex: d.color.hex, images: [image] }];
  return {
    _id: d.slug,
    slug: d.slug,
    title: d.title,
    shortDescription: d.short,
    description: d.desc,
    price: d.price,
    compareAtPrice: d.compareAt,
    images: [image],
    colors,
    sizes: sizes(d.oos),
    category: d.category,
    tags: d.tags,
    printLocations: d.twoSided ? ["Front", "Back"] : ["Front"],
    badges: d.badges,
    featured: Boolean(d.featured),
    gelatoProductUid: "", // fill in when Gelato is connected
    reviews: [],
    rating: 0,
    reviewCount: 0,
  };
});
