export type CommentSender = {
    _id: string;
    username: string;
    pfpUrl: string;
}

export type Comment = {
    _id: string;
    postId: string;
    sender: CommentSender;
    content: string;
}
