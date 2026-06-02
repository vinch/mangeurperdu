import type { PageServerLoad } from "./$types";
import { getInstagramPosts } from "$lib/server/instagram";

export const prerender = false;

export const load: PageServerLoad = async () => {
  const { posts, error } = await getInstagramPosts(4);
  return {
    instagramPosts: posts,
    instagramLoadError: error,
  };
};
