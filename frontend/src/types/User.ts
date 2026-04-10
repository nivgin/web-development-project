export type User = {
    id: string;
    username: string;
    email: string;
    password: string;
    pfpUrl: string;
};

export type UpdateUserData = {
    email?: string;
    password?: string;
    image?: File | null;
    existingPfpUrl: string;
};