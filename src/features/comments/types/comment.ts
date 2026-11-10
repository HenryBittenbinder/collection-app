export interface CommentAuthor {
  id: number;
  name: string;
  username: string;
  avatar: string | null;
}

export interface Comment {
  id: number;
  body: string;
  created_at: string;
  author: CommentAuthor;
}
