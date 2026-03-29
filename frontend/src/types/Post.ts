export type Post = {
    _id: string;
    sender: string;
    title: string;
    content: string;
    imageUrl: string;
    likeCount: number;
    isLiked: boolean;
    commentCount: number;
}

export type CreatePostData = {
    title: string;
    content: string;
    image: File;
    ingredients: string[];
    instructions: string[];
    servings: number;
    time: number;
    category: string;
}

export type PostFull = Post & {
    ingredients: string[];
    instructions: string[];
    servings: number;
    time: number;
    category: string;
}