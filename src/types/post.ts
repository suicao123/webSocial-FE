// 1. (KHUYẾN NGHỊ) Tạo một type cho đối tượng _count
export interface typePostCount {
    comments: number;
    post_likes: number;
}

// 2. Type cho tác giả (vẫn như cũ)
export interface typeAuthor {
    user_id: string;
    display_name: string | null;
    avatar_url: string;
    username: string;
}

// 3. Type POST hoàn chỉnh (đã cập nhật)
export interface typePost {
    // Các trường gốc (vẫn như cũ)
    post_id: string;
    user_id: string;
    admin_id: string | null;
    content: string | null;
    image_url: string[];
    created_at: string | null;
    updated_at: string | null;

    // --- CÁC TRƯỜNG MỚI (ĐÃ THAY ĐỔI) ---

    // Quan hệ với tác giả bài viết
    users_posts_user_idTousers: typeAuthor;

    // Đối tượng đếm (thay cho mảng)
    _count: typePostCount;

    // --- CÁC TRƯỜNG CŨ (BỊ XÓA KHỎI API NÀY) ---
    // comments: typeComment[];     <-- Xóa bỏ
    // post_likes: typePostLike[];  <-- Xóa bỏ
}
