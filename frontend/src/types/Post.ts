export type Post = {
    id: string;
    sender: string;
    title: string;
    content: string;
    likeCount: number;
    isLiked: boolean;
    commentCount: number;
}