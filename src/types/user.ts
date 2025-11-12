
export interface typeUser {
    user_id: number;
    username: string;
    email: string | null;
    avatar_url: string;
    display_name: string;
}

export interface payload {
    user_id: string,
    username: string,
    display_name: string,
    email: string
};
