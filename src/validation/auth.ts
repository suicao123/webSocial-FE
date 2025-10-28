
export const validateLogin = (username: string, password: string) => {
    if(username === '' || password === '')
        return true;
    return false;
}

export const validateSignup = (username: string, fullname: string, password: string) => {
    if(username === '' || fullname === '' || password === '')
        return true;
    if(password.length < 6)
        return true;
    return false;
}
