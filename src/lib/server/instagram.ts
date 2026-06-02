import { env } from "$env/dynamic/private";
import {
  beholdFeedUrl,
  instagramHandle,
  instagramProfileUrl,
} from "$lib/instagram/config";
import type { InstagramPost } from "$lib/types/instagram";

type BeholdSizedImage = {
  width: number;
  height: number;
  mediaUrl: string;
};

type BeholdPost = {
  id: string;
  permalink: string;
  mediaType: string;
  mediaUrl?: string;
  thumbnailUrl?: string;
  caption?: string;
  prunedCaption?: string;
  timestamp: string;
  likeCount?: number;
  commentsCount?: number;
  children?: BeholdPost[];
  sizes?: {
    small?: BeholdSizedImage;
    medium?: BeholdSizedImage;
    large?: BeholdSizedImage;
    full?: BeholdSizedImage;
  };
};

type BeholdFeed = {
  username?: string;
  posts?: BeholdPost[];
};

function feedUrl(): string {
  return env.BEHOLD_FEED_URL?.trim() || beholdFeedUrl;
}

function pickMediaUrl(post: BeholdPost): string | null {
  const sized =
    post.sizes?.medium?.mediaUrl ??
    post.sizes?.large?.mediaUrl ??
    post.sizes?.small?.mediaUrl;

  if (post.mediaType === "VIDEO") {
    return post.thumbnailUrl ?? sized ?? post.mediaUrl ?? null;
  }

  return sized ?? post.mediaUrl ?? post.thumbnailUrl ?? null;
}

function mapBeholdPost(item: BeholdPost): InstagramPost | null {
  const mediaUrl = pickMediaUrl(item);
  if (!mediaUrl) return null;

  return {
    id: item.id,
    permalink: item.permalink,
    mediaUrl,
    caption: item.caption ?? item.prunedCaption ?? null,
    mediaType: item.mediaType,
    timestamp: item.timestamp,
    likeCount: item.likeCount ?? 0,
    commentCount: item.commentsCount ?? 0,
  };
}

export async function getInstagramPosts(
  limit = 4,
): Promise<{ posts: InstagramPost[]; error: string | null }> {
  try {
    const res = await fetch(feedUrl(), {
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      console.error("Behold feed:", res.status, res.statusText);
      return {
        posts: [],
        error: "Impossible de charger les publications Instagram.",
      };
    }

    const json = (await res.json()) as BeholdFeed;
    const posts = (json.posts ?? [])
      .slice(0, limit)
      .map(mapBeholdPost)
      .filter((p): p is InstagramPost => p !== null);

    return { posts, error: null };
  } catch (err) {
    console.error("Behold feed fetch failed:", err);
    return {
      posts: [],
      error: "Impossible de charger les publications Instagram.",
    };
  }
}

export { instagramHandle, instagramProfileUrl };
