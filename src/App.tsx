
import { Route, Routes } from 'react-router'
import HomePage from './pages/HomePage'
import ProfilePage from './pages/ProfilePage'
import ProtectedRoute from './components/ProtectedRoute'

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
            </Routes>
        </>
    )
}

export default App
