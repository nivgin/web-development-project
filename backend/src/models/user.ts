import mongoose from 'mongoose';

interface IUser {
    username: string,
    email: string,
    passwordHash?: string,
    googleId?: string,
    tokens: string[],
    pfpUrl: string
}

const userSchema = new mongoose.Schema<IUser>({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String, 
        required: true,
        unique: true
    },
    passwordHash: {
        type: String,
        required: false
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true
    },
    tokens: {
        type: [String],
        default: []
    },
    pfpUrl: {
        type: String,
        required: true
    }

});

const userModel = mongoose.model<IUser>("users", userSchema);

export default userModel;
export { IUser };