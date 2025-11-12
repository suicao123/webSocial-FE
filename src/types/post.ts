
export interface typePostCount {
    comments: number;
    post_likes: number;
}

export interface typeAuthor {
    user_id: string;
    display_name: string | null;
    avatar_url: string;
    username: string;
}

export interface typePost {
    post_id: string;
    user_id: string;
    admin_id: string | null;
    content: string | null;
    image_url: string[];
    created_at: string | null;
    updated_at: string | null;

    // Quan hệ với tác giả bài viết
    users_posts_user_idTousers: typeAuthor;

    // Đối tượng đếm (thay cho mảng)
    _count: typePostCount;

    isLike: boolean
}

export interface commentAuthor {
    display_name: string | null;
    avatar_url: string;
}

export interface typeComment {
    post_id: string,
    content: string,

    users: commentAuthor
}
