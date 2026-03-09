import postModel from '../models/post'
import { IPost } from '../models/post'
import mongoose from 'mongoose';

export const createPost = async (title: string, sender: string, content: string) => {
    return await postModel.create({ title, sender, content });
}

export const getPostById = async (id: string, currentUserId: string) => {
    return await postModel.getPostById(id, currentUserId);
}

export const getPosts = async (currentUserId: string) => {
    return await postModel.getPosts(currentUserId);
}

export const getPostsBySender = async (sender: string, currentUserId: string) => {
    return await postModel.aggregate([
        {
            $match: { sender: new mongoose.Types.ObjectId(sender) }
        },
        {
            $addFields: {
                likeCount: { $size: "$likes" },
                isLiked: {
                    $in: [new mongoose.Types.ObjectId(currentUserId), "$likes"]
                }
            }
        },
        {
            $project: { likes: 0 }
        }
    ]);
}

export const updatePost = async (id: string, postBody: IPost) => {
    return await postModel.findByIdAndUpdate(id, postBody, { new: true });
}

export const likePost = async (postId: string, userId: string) => {
    return await postModel.likePost(postId, userId);
}

export const unlikePost = async (postId: string, userId: string) => {
    return await postModel.unlikePost(postId, userId);
}