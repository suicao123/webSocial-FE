import { useState } from "react"
import LoginForm from "../../../components/ui/LoginForm"
import SignupForm from "../../../components/ui/SignupForm";

function Auth( {setHome} : {setHome: React.Dispatch<React.SetStateAction<boolean>>;} ) {

    const [isAuth, setAuth] = useState<boolean>(true);

    return (
        <>
            <div id="auth-container">
                <div id="auth-container-nav">
                    <div className="auth-container-nav-form">
                        {
                            isAuth ? 
                            <LoginForm 
                                setAuth = {setAuth}
                                setHome = {setHome}
                            /> : 
                            <SignupForm 
                                setAuth = {setAuth}
                            />
                        }
                    </div>

                    <div className="auth-container-nav-img">
                        
                    </div>
                </div>
            </div>
        </>
    )
}

export default Auth
