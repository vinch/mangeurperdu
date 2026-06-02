export type InstagramPost = {
  id: string;
  permalink: string;
  mediaUrl: string;
  caption: string | null;
  mediaType: string;
  timestamp: string;
  likeCount: number;
  commentCount: number;
};
