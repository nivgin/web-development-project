import userModel from '../models/user'
import { IUser } from '../models/user'

export const createUser = async (username: string, email: string, passwordHash: string | undefined, pfpUrl: string, googleId?: string) => {
    return await userModel.create({ username, email, passwordHash, pfpUrl, googleId });
}

const PUBLIC_FIELDS = 'username email googleId pfpUrl';

export const getUserById = async (id: string, classified: boolean = false) => {
    if (classified) return await userModel.findById(id).select(PUBLIC_FIELDS);
    return await userModel.findById(id);
}

export const getUsers = async () => {
    return await userModel.find().select(PUBLIC_FIELDS);
}

export const getUserByUsername = async (username: string, classified: boolean = false) => {
    if (classified) return await userModel.findOne({ username }).select(PUBLIC_FIELDS);
    return await userModel.findOne({ username });
}

export const getUserByGoogleId = async (googleId: string) => {
    return await userModel.findOne({ googleId });
}

export const updateUser = async (id: string, userBody: IUser) => {  
    return await userModel.findByIdAndUpdate(id, userBody, { new: true });
}

export const deleteUser = async (id: string) => {
    return await userModel.findByIdAndDelete(id);
}