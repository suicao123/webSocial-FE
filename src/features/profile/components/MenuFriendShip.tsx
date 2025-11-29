import { memo } from "react"
import { CiSearch } from "react-icons/ci"
import { IoEllipsisHorizontalOutline } from "react-icons/io5"
import type { typeFriends } from "../../../types/user"

function MenuFriendShip(
    {
        dataFriends
    } :
    {
        dataFriends: typeFriends[] | undefined
    }
) {

    return (
        <div className="profile-layout-friendships">
            <div className="profile-layout-friendships-header">
                <div className="profile-layout-friendships-header-left">
                    <p>Bạn bè</p>
                </div>
                <div className="profile-layout-friendships-header-right">
                    <div className="invite-friendship">
                        Lòi mời kết bạn
                    </div>
                    <div className="find-friendship">
                        Tìm bạn
                    </div>
                    <div className="input-header">
                        <CiSearch
                            className="icon"
                        />
                        <input 
                            type="text" 
                            placeholder="Tìm kiếm"
                        />
                    </div>
                </div>
            </div>
            <div className="profile-layout-friendships-list-friends">
                {
                    dataFriends?.map(friend => {
                        return (
                            <div className="item">
                            <div className="item-container">
                                <div className="left">
                                    <img src={friend.avatar_url } />
                                    <p>{friend.display_name}</p>
                                </div>
                                <div className="right">
                                    <IoEllipsisHorizontalOutline 
                                        className="icon"
                                    />
                                </div>
                            </div>
                        </div>
                        )
                    })
                }
                {/* <div className="item">
                    <div className="item-container">
                        <div className="left">
                            <img src="https://res.cloudinary.com/dd0yqxowo/image/upload/v1761823049/user-default_jxnvbw.jpg" />
                            <p>Name</p>
                        </div>
                        <div className="right">
                            <IoEllipsisHorizontalOutline 
                                className="icon"
                            />
                        </div>
                    </div>
                </div> */}
            </div>
        </div>
    )
}

export default memo(MenuFriendShip)
