import { memo } from "react"
import type { typeUser } from "../../../types/user"

function Intro(
    {
        dataUser
    } :
    {
        dataUser: typeUser | undefined
    }
) {
    return (
        <div className="intro-content">
            <p>Giới thiêu:</p>
            <p>{dataUser?.bio}</p>
        </div>
    )
}

export default memo(Intro)
