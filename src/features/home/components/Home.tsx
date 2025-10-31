import Header from "../../../components/layout/Header"
import Post from "../../../components/ui/posts/Post"
import PostComposer from "../../../components/ui/posts/PostComposer"

function Home() {
    return (
        <div id="main-layout">
            <Header />
            <div id="main-layout-home">
                <div className="main-layout-home-left"></div>
                <div className="main-layout-home-center">
                    <PostComposer />
                    <Post />
                </div>
                <div className="main-layout-home-right"></div>
            </div>
        </div>
    )
}

export default Home
