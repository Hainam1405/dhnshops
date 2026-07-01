import imageUrlBuilder from "@sanity/image-url";
import { sanityClient } from "./client";

const builder = imageUrlBuilder(sanityClient);

type ImageSource = Parameters<typeof builder.image>[0];

/** Build an optimized image URL from a Sanity image field. */
export function urlForImage(source: ImageSource) {
  return builder.image(source);
}
