import { groq } from "next-sanity";
import { sanityClient } from "./client";
import type { Category, Product } from "@/lib/types";

/**
 * Maps a Sanity `product` document to the app's Product type. Prices are stored
 * in Sanity as USD dollars and converted to integer cents here.
 */
const productProjection = groq`{
  "_id": _id,
  "slug": slug.current,
  title,
  "shortDescription": coalesce(shortDescription, ""),
  "description": coalesce(description, ""),
  "price": round(coalesce(price, 0) * 100),
  "compareAtPrice": select(defined(compareAtPrice) => round(compareAtPrice * 100), null),
  "images": coalesce(images[].asset->url, []),
  "colors": coalesce(colors[]{
    "name": coalesce(name, "Default"),
    "hex": coalesce(hex, "#0d0f16"),
    "images": coalesce(images[].asset->url, [])
  }, []),
  "sizes": coalesce(sizes[]{ "label": label, "inStock": coalesce(inStock, true) }, []),
  "category": category->slug.current,
  "tags": coalesce(tags, []),
  "printLocations": coalesce(printLocations, []),
  "badges": coalesce(badges, []),
  "featured": coalesce(featured, false),
  "model3d": model3d.asset->url,
  "gelatoProductUid": coalesce(gelatoProductUid, ""),
  "reviews": *[_type == "review" && references(^._id)] | order(date desc){
    "id": _id,
    "author": authorName,
    rating,
    "text": coalesce(text, ""),
    "photo": photo.asset->url,
    "verified": coalesce(verified, false),
    "date": coalesce(date, _createdAt)
  },
  "rating": round(coalesce(math::avg(*[_type == "review" && references(^._id)].rating), 0) * 10) / 10,
  "reviewCount": count(*[_type == "review" && references(^._id)])
}`;

export async function getAllProducts(): Promise<Product[]> {
  return sanityClient.fetch(groq`*[_type == "product"] | order(featured desc) ${productProjection}`);
}

export async function getCategories(): Promise<Category[]> {
  return sanityClient.fetch(groq`*[_type == "collection"]{
    "slug": slug.current,
    title,
    "description": coalesce(description, ""),
    "heroImage": coalesce(heroImage.asset->url, "")
  }`);
}
