import categoryModel from '../models/category';
import postModel from '../models/post';
import { IPost } from '../models/post';
import mongoose from 'mongoose';

export const createPost = async (
    title: string,
    sender: string,
    content: string,
    imageUrl: string,
    ingredients: string[],
    instructions: string[],
    servings: number,
    time: number,
    category: string
) => {
    return await postModel.create({
        title,
        sender,
        content,
        imageUrl,
        ingredients,
        instructions,
        servings,
        time,
        category
    });
};

export const getPostById = async (id: string, currentUserId: string) => {
    const post = await postModel.getPosts(
        currentUserId,
        { _id: new mongoose.Types.ObjectId(id) },
        0,
        1
    );

    return post[0] ?? null;
};

export const getPosts = async (
    currentUserId: string,
    skip?: number,
    limit?: number,
    search?: string
) => {
    const match = search
        ? { title: { $regex: search, $options: 'i' } }
        : {};

    return await postModel.getPosts(currentUserId, match, skip, limit);
};

export const getPostsBySender = async (
    sender: string,
    currentUserId: string,
    skip?: number,
    limit?: number,
    search?: string
) => {
    const match = {
        sender: new mongoose.Types.ObjectId(sender),
        ...(search && { title: { $regex: search, $options: 'i' } })
    };

    return await postModel.getPosts(currentUserId, match, skip, limit);
};

export const updatePost = async (id: string, postBody: IPost) => {
    return await postModel.findByIdAndUpdate(id, postBody, { new: true });
};

export const likePost = async (postId: string, userId: string) => {
    return await postModel.likePost(postId, userId);
};

export const unlikePost = async (postId: string, userId: string) => {
    return await postModel.unlikePost(postId, userId);
};

export const getCategories = async () => {
    const categories = await categoryModel.find();
    return categories.map(c => c.name);
}