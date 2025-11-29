import { useState } from "react";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { validateSignup } from "../../validation/auth";

const PROTOCOL = import.meta.env.VITE_API_PROTOCOL || 'http';
const HOST = import.meta.env.VITE_API_HOST || 'localhost';
const PORT = import.meta.env.VITE_API_PORT || '8080';

function SignupForm( 
    {setAuth} : {setAuth: React.Dispatch<React.SetStateAction<boolean>>;} 
) {

    const [isError, setError] = useState<boolean>(false);
    const [isHidden, setHidden] = useState<boolean>(true);
    const [username, setUsername] = useState<string>('');
    const [fullname, setFullname] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    function handleUsername(e: any) {
        setError(false);
        setUsername(e.target.value);
    }

    function handleFullname(e: any) {
        setError(false);
        setFullname(e.target.value);
    }

    function handlePassword(e: any) {
        setError(false);
        setPassword(e.target.value);
    }

    function handleHiddenPass() {
        setHidden((prev) => !prev);
    }

    function handleLogin() {
        setAuth((prev) => !prev);
    }

    function handleSignup() {
        setError(validateSignup(username, fullname, password));

        if(!validateSignup(username, fullname, password)) {
            setAuth((prev) => !prev);
        }
    }

    return (
        <div className="auth-container-nav-form-auth">
            <form method="post">
                <h1>Sign Up</h1>

                <div className="form-group">
                    <span>USERNAME</span>
                    <div className="form-wrapper">
                        <input
                            type="text"
                            name="username"
                            value={username}
                            onChange={ handleUsername }
                            placeholder="Enter your username"
                        />
                    </div>
                </div>

                <div className="form-group">
                    <span>FULLNAME</span>
                    <div className="form-wrapper">
                        <input
                            type="text"
                            name="fullname"
                            value={fullname}
                            onChange={ handleFullname }
                            placeholder="Enter your name"
                        />
                    </div>
                </div>

                <div className="form-group">
                    <span>PASSWORD</span>
                    <div className="form-wrapper">
                        <input
                            type={isHidden ? 'password' : 'text'}
                            name="password"
                            value={password}
                            onChange={ handlePassword }
                            placeholder="••••••••"
                        />
                        {
                            isHidden ?
                            <IoEyeOff 
                                className="icon" 
                                onClick={ handleHiddenPass }
                            /> :
                            <IoEye
                                className="icon" 
                                onClick={ handleHiddenPass }
                            />
                        }
                    </div>
                </div>

                <span className={`error-message ${isError ? 'show' : ''}`}>Sai thông tin đăng nhập!!!</span> 

                <div className="button">
                    <div 
                        className="button-left"
                        onClick={ handleSignup }
                    >
                        Sign Up
                    </div>
                    <div 
                        className="button-right"
                        onClick={ handleLogin }
                    >
                        Login
                    </div>
                </div>
            </form>
        </div>
    )
}

export default SignupForm
