import { memo } from "react"
import type { typeUser } from "../../../types/user"
import { MdOutlineMail } from "react-icons/md"

function Connect(
    {
        dataUser
    } :
    {
        dataUser: typeUser | undefined
    }
) {
    return (
        <div className="connect-content">
            {
                dataUser?.email ?
                <div>
                    <p>Thông tin liên lạc:</p>
                    <MdOutlineMail /> {dataUser.email}
                </div> : ''
            }
        </div>
    )
}

export default memo(Connect)
