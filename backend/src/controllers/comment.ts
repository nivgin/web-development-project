import commentModel from '../models/comment'
import postModel from '../models/post'

export const createComment = async (postId: string, sender: string, content: string) => {
    const comment = await commentModel.create({ postId, sender, content });
    await postModel.findByIdAndUpdate(postId, { $inc: { commentCount: 1 } });
    return comment;
}

export const getComments = async () => {
    return await commentModel.find();
}

export const getCommentById = async (commentId: string) => {
    return await commentModel.findById(commentId);
}

export const deleteComment = async (commentId: string) => {
    const comment = await commentModel.findByIdAndDelete(commentId);
    await postModel.findByIdAndUpdate(comment!.postId, { $inc: { commentCount: -1 } });
    return comment;
}

export const updateComment = async (commentId: string, content: string) => {
    return await commentModel.findByIdAndUpdate(commentId, { content }, { new: true });
}

export const getCommentsByPostId = async (postId: string) => {
    return await commentModel.find({ postId: postId });
}