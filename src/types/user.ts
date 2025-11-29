
export interface typeUser {
    user_id: number;
    username: string;
    email: string | null;
    avatar_url: string;
    display_name: string;
    bio: string;
}

export interface payload {
    user_id: string,
    username: string,
    display_name: string,
    email: string,
    role: number
};

export interface typeFriends {
    user_id: string,
    display_name: string,
    avatar_url: string
};
