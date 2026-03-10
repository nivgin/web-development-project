export type Post = {
    id: string;
    sender: string;
    title: string;
    content: string;
    imageUrl: string;
    likeCount: number;
    isLiked: boolean;
    commentCount: number;
}