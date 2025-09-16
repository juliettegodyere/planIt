import Fuse from "fuse.js";
import { CategoryItemResponseType } from "@/service/types"; // adjust the import path

export function buildFuseIndex(items: CategoryItemResponseType[]) {
  return new Fuse(items, {
    keys: ["label", "value", "category"],
    threshold: 0.28, // tweak sensitivity
    ignoreLocation: true,
  });
}
