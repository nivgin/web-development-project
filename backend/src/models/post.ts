import mongoose from 'mongoose';

interface IPost {
    sender: mongoose.Types.ObjectId;
    title: string;
    content: string;
    imageUrl: string;
    likes: mongoose.Types.ObjectId[];
    commentCount: number;
    ingredients: string[];
    instructions: string[];
    servings: number;
    time: number;
    category: string;
}

interface IPostDTO {
    _id: mongoose.Types.ObjectId;
    sender: mongoose.Types.ObjectId;
    title: string;
    content: string;
    imageUrl: string;
    likeCount: number;
    isLiked: boolean;
    commentCount: number;
    ingredients: string[];
    instructions: string[];
    servings: number;
    time: number;
    category: string;
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
    imageUrl: {
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
    },
    ingredients: {
        type: [String],
        required: true
    },
    instructions: {
        type: [String],
        required: true
    },
    servings: {
        type: Number,
        required: true
    },
    time: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    }
});

postSchema.statics.getPosts = async function (
    currentUserId: string,
    match: object,
    skip?: number,
    limit?: number
): Promise<IPostDTO[]> {

    return this.aggregate([
        { $match: match },
        { $skip: (!skip || isNaN(skip)) ? 0 : skip },
        { $limit: (!limit || isNaN(limit)) ? 10 : limit },
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

postSchema.statics.likePost = async function (postId: string, userId: string): Promise<void> {
    await this.findByIdAndUpdate(postId, {
        $addToSet: { likes: new mongoose.Types.ObjectId(userId) }
    });
};

postSchema.statics.unlikePost = async function (postId: string, userId: string): Promise<void> {
    await this.findByIdAndUpdate(postId, {
        $pull: { likes: new mongoose.Types.ObjectId(userId) }
    });
};

interface IPostModel extends mongoose.Model<IPost> {
    getPosts(currentUserId: string, match: object, skip?: number, limit?: number): Promise<IPostDTO[]>;
    likePost(postId: string, userId: string): Promise<void>;
    unlikePost(postId: string, userId: string): Promise<void>;
}

const postModel = mongoose.model<IPost, IPostModel>("posts", postSchema);

export default postModel;
export { IPost, IPostDTO };
