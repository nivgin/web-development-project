import postModel from '../models/post'
import { IPost } from '../models/post'
import mongoose from 'mongoose';

export const createPost = async (title: string, sender: string, content: string) => {
    return await postModel.create({ title, sender, content });
}

export const getPostById = async (id: string, currentUserId: string) => {
    const post = await postModel.getPosts(currentUserId, 0, 1, { _id: new mongoose.Types.ObjectId(id) });

    return post[0] ?? null
}

export const getPosts = async (currentUserId: string, skip?: number, limit?: number) => {
    return await postModel.getPosts(currentUserId, skip, limit);
}

export const getPostsBySender = async (sender: string, currentUserId: string, skip?: number, limit?: number) => {
    return await postModel.getPosts(currentUserId, skip, limit, { sender: new mongoose.Types.ObjectId(sender) });
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