import { GrDocumentText } from "react-icons/gr"
import HeaderAdmin from "../components/layout/HeaderAdmin"

function AdminPage() {
    return (
        <div id="admin-main-layout">
            <HeaderAdmin />

            <div className="admin-parameter">
                <div className="admin-parameter-item">
                    <div className="content">
                        <p className="title">Tổng bài viết</p>
                        <p className="parameter">1,300</p>
                        <p className="increase">+12% so với tháng trước</p>
                    </div>
                    <div className="item-icon">
                        <GrDocumentText 
                            className="icon"
                        />
                    </div>
                </div>
                <div className="admin-parameter-item">
                    <div className="content">
                        <p className="title">Tổng bài viết</p>
                        <p className="parameter">1,300</p>
                        <p className="increase">+12% so với tháng trước</p>
                    </div>
                    <div className="item-icon">
                        <GrDocumentText 
                            className="icon"
                        />
                    </div>
                </div>
                <div className="admin-parameter-item">
                    <div className="content">
                        <p className="title">Tổng bài viết</p>
                        <p className="parameter">1,300</p>
                        <p className="increase">+12% so với tháng trước</p>
                    </div>
                    <div className="item-icon">
                        <GrDocumentText 
                            className="icon"
                        />
                    </div>
                </div>
            </div>

            <div className="admin-menu">
                
            </div>
        </div>
    )
}

export default AdminPage
