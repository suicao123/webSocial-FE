import { useState } from "react";
import Auth from "../features/auth/components/Auth"
import Home from "../features/home/components/Home";

function HomePage() {

    const [isHome, setHome] = useState<boolean>(false);

    return (
        <>
            {
                isHome ?
                <Home /> :
                <Auth 
                    setHome = {setHome}
                />
            }
        </>
    )
}

export default HomePage
