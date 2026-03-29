import './App.css'
import Navbar from './Components/Navbar'
import { Toaster } from 'react-hot-toast'
import { Route, Routes } from 'react-router-dom'
import Home from './Screen/Home'
import About from './Screen/About'
import Blog from './Screen/Blog'
import Contact from './Screen/Contact'
import Categories from './Screen/Categories'
import SingleBlog from './Screen/SingleBlog'
import AddBlog from './Screen/AddBlog'
import AdminDashboard from './Screen/AdminDashboard'
import AdminProtectedRoute from './middleware/AdminProtectedRoute'
import { useSelector } from 'react-redux'
import { ClipLoader } from 'react-spinners'
import Login from './Screen/Login'
import Register from './Screen/Register'
import ProtectedRoute from './middleware/ProtectedRoute'
import Profile from './Screen/Profile'
import EditBlog from './Screen/EditBlog'
import PageLayout from './Components/PageLayout'
import Footer from './Components/Footer'
import Maintenance from './Screen/Maintenance'
import EditProfileModal from './Components/EditProfileModal'


import { useEffect } from 'react'
import api from './utils/api'

function App() {
    const isLoading = useSelector(state => state.user.isLoading)

    const token = useSelector(state => state.user.token)

    useEffect(() => {
        // Global check to see if site is in maintenance mode
        const checkStatus = async () => {
            try {
                // Any call to an /api/ route will trigger the interceptor if 503 occurs
                await api.get('/blog'); 
            } catch (error) {
                console.error("Site heartbeat check:", error.message);
            }
        };
        checkStatus();
    }, []);

    useEffect(() => {
        let interval;
        if (token) {
            // Immediate ping on login/mount
            api.post('/user/ping').catch(() => {});
            
            // Heartbeat every 2 minutes
            interval = setInterval(() => {
                api.post('/user/ping').catch(() => {});
            }, 120000); 
        }
        return () => clearInterval(interval);
    }, [token]);

    return (
        <>
            <Navbar />
            <EditProfileModal />
            <Toaster position="top-center" reverseOrder={false} />

            <div className={isLoading ? 'loader' : ''}>
                <ClipLoader size={100} loading={isLoading} color='white' />
            </div>
            <Routes>
                <Route path='/' element={<PageLayout><Home /></PageLayout>} />
                <Route path='/maintenance' element={<Maintenance />} />
                <Route path='/about' element={<PageLayout><About /></PageLayout>} />
                <Route path='/blog' element={<PageLayout><Blog /></PageLayout>} />
                <Route path='/contact' element={<PageLayout><Contact /></PageLayout>} />
                <Route path='/categories' element={<PageLayout><Categories /></PageLayout>} />
                <Route path='/blog/:id' element={<PageLayout><SingleBlog /></PageLayout>} />
                <Route path='/login' element={<PageLayout><Login /></PageLayout>} />
                <Route path='/register' element={<PageLayout><Register /></PageLayout>} />
                <Route path='/user/:id' element={<PageLayout><Profile /></PageLayout>} />

                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                    <Route path='/add-blog' element={<PageLayout><AddBlog /></PageLayout>} />
                    <Route path='/profile' element={<PageLayout><Profile /></PageLayout>} />
                </Route>

                {/* Admin Routes */}
                <Route element={<AdminProtectedRoute />}>
                    <Route path='/admin' element={<PageLayout><AdminDashboard /></PageLayout>} />
                    <Route path='/edit-blog/:id' element={<PageLayout><EditBlog /></PageLayout>} />
                </Route>
            </Routes>
            <Footer />
        </>
    )
}

export default App



