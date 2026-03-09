import mongoose from 'mongoose';

interface IPost {
    sender: mongoose.Types.ObjectId,
    title: string,
    content: string,
    likes: mongoose.Types.ObjectId[],
    commentCount: number
}

interface IPostDTO {
    _id: mongoose.Types.ObjectId,
    sender: mongoose.Types.ObjectId,
    title: string,
    content: string,
    likeCount: number,
    isLiked: boolean,
    commentCount: number
}

const postSchema = new mongoose.Schema<IPost>({
    title: {
        type: String,
        required: true,
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    content: {
        type: String,
        required: true
    },
    likes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "users",
        default: []
    },
    commentCount: {
        type: Number,
        default: 0
    }
});

postSchema.statics.getPosts = async function(currentUserId: string): Promise<IPostDTO[]> {
    return this.aggregate([
        {
            $addFields: {
                likeCount: { $size: "$likes" },
                isLiked: {
                    $in: [new mongoose.Types.ObjectId(currentUserId), "$likes"]
                }
            }
        },
        {
            $project: {
                likes: 0
            }
        }
    ]);
};

postSchema.statics.getPostById = async function(postId: string, currentUserId: string): Promise<IPostDTO | null> {
    const result = await this.aggregate([
        {
            $match: { _id: new mongoose.Types.ObjectId(postId) }
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
            $project: {
                likes: 0
            }
        }
    ]);
    return result[0] ?? null;
};

postSchema.statics.likePost = async function(postId: string, userId: string): Promise<void> {
    await this.findByIdAndUpdate(postId, {
        $addToSet: { likes: new mongoose.Types.ObjectId(userId) }
    });
};

postSchema.statics.unlikePost = async function(postId: string, userId: string): Promise<void> {
    await this.findByIdAndUpdate(postId, {
        $pull: { likes: new mongoose.Types.ObjectId(userId) }
    });
};

interface IPostModel extends mongoose.Model<IPost> {
    getPosts(currentUserId: string): Promise<IPostDTO[]>;
    getPostById(postId: string, currentUserId: string): Promise<IPostDTO | null>;
    likePost(postId: string, userId: string): Promise<void>;
    unlikePost(postId: string, userId: string): Promise<void>;
}

const postModel = mongoose.model<IPost, IPostModel>("posts", postSchema);

export default postModel;
export { IPost, IPostDTO };