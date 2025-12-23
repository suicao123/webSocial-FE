import { memo, useState } from "react"
import type { typeUser } from "../../../types/user";
import Connect from "../../../components/ui/about/Connect";
import Intro from "../../../components/ui/about/Intro";

function MenuAbout(
    {
        dataUser
    } :
    {
        dataUser: typeUser | undefined
    }
) {
    const [activeMenu, setActiveMenu] = useState<number>(1);

    function handleMenu(index: number) {
        setActiveMenu(index);
    }

    return (
        <div className="menu-about-main">
            <div className="intro-menu">
                <p>Giới thiệu</p>
                <div 
                    className={`menu-content ${activeMenu == 1 ? 'show' : ''}`}
                    onClick={ () => handleMenu(1) }
                >
                    <p>Tổng quan</p>
                </div>
                <div 
                    className={`menu-content ${activeMenu == 2 ? 'show' : ''}`}
                    onClick={ () => handleMenu(2) }
                >
                    <p>Thông tin liên lạc</p>
                </div>
            </div>
            {
                activeMenu == 1 ?
                <Intro
                    dataUser={dataUser}
                /> : ''
            }
            {
                activeMenu == 2 ?
                <Connect
                    dataUser={dataUser}
                /> : ''
            }
        </div>
    )
}

export default memo(MenuAbout)
