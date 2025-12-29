
export interface SignUpErrors {
    username?: string;
    displayName?: string;
    password?: string;
}

export const validateLogin = (username: string, password: string) => {
    if (username === '' || password === '')
        return true;
    return false;
}

export const validateSignup = (username: string, fullname: string, password: string, passwordA: string) => {
    const errors: SignUpErrors = {};

    if (!fullname || fullname.trim() === '') {
        errors.displayName = "Vui lòng nhập tên hiển thị";
    }

    if (!username || username.trim() === '') {
        errors.username = "Vui lòng nhập tên đăng nhập";
    }

    if (!password || password === '') {
        errors.password = "Vui lòng nhập mật khẩu";
    } else if (password.length < 6) {
        errors.password = "Mật khẩu phải lớn hơn 6 ký tự";
    } else if (password !== passwordA) {
        errors.password = "Nhập lại mật khẩu không giống nhau";
    }

    return errors;
}
