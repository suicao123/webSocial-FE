
import { Route, Routes } from 'react-router'
import HomePage from './pages/HomePage'
import ProfilePage from './pages/ProfilePage'
import ProtectedRoute from './components/ProtectedRoute'
import FriendPage from './pages/FriendPage'
import ChatPage from './pages/ChatPage'

function App() {

    return (
        <>
            <Routes>
                <Route path='/' element={<HomePage />} />
                
                {/* Route cần bảo vệ (Private Routes) */}
                {/* Mọi route nằm trong này đều bắt buộc phải đăng nhập */}
                <Route element={<ProtectedRoute />}>
                    <Route path='/profile/:user_id' element={<ProfilePage />} />
                </Route>
                <Route element={<ProtectedRoute />}>
                    <Route path='/friends' element={<FriendPage />} />
                </Route>
                <Route element={<ProtectedRoute />}>
                    <Route path='/chat' element={<ChatPage />} />
                </Route>
            </Routes>
        </>
    )
}

export default App
