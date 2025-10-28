import { useState } from "react"
import { IoEye, IoEyeOff } from "react-icons/io5";
import { validateLogin } from "../../validation/auth";

function LoginForm( {
    setAuth,
    setHome
} : {
    setAuth: React.Dispatch<React.SetStateAction<boolean>>;
    setHome: React.Dispatch<React.SetStateAction<boolean>>;
} ) {

    const [isError, setError] = useState<boolean>(false);
    const [isHidden, setHidden] = useState<boolean>(true);
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    function handleHiddenPass(): void {
        setHidden((prev) => !prev);
    }

    function handleSignup(): void {
        setAuth((prev) => !prev);
    }

    function handleUsername(e: any): void {
        setError(false);
        setUsername(e.target.value);
    }

    function handlePassword(e: any): void {
        setError(false);
        setPassword(e.target.value);
    }

    const handleLogin = async () => {
        setError(validateLogin(username, password));
        
        if(!validateLogin(username, password)) {

            try {
                const response = await fetch('http://localhost:8080/api/v1/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({username, password}),
                });

                // const data = await response.json();

                if (response.ok) {
                    setHome((prev) => !prev)
                }
            }
            catch (error) {
                alert('Lỗi đăng nhập');
            }
        }
    }

    return (
        <div className="auth-container-nav-form-auth">
            <form method="post">
                <h1>Login</h1>

                <div className="form-group">
                    <span>USERNAME</span>
                    <div className="form-wrapper">
                        <input
                            type="text"
                            name="username"
                            onChange={ handleUsername }
                            value={username}
                            placeholder="Enter your username"
                        />
                    </div>
                </div>

                <div className="form-group">
                    <span>PASSWORD</span>
                    <div className="form-wrapper">
                        <input
                            type={isHidden ? 'password' : 'text'}
                            name="password"
                            onChange={ handlePassword }
                            value={password}
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
                        onClick={ handleLogin }
                    >
                        Login
                    </div>
                    <div 
                        className="button-right"
                        onClick={ handleSignup }
                    >
                        Sign Up
                    </div>
                </div>
            </form>
        </div>
    )
}

export default LoginForm
