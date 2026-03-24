import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './Components/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './Screen/Home'
import About from './Screen/About'
import Blog from './Screen/Blog'
import Contact from './Screen/Contact'
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

function App() {
    const [count, setCount] = useState(0)
    const isLoading = useSelector(state => state.user.isLoading)

    return (
        <>
            <Navbar />
            <div className={isLoading ? 'loader' : ''}>
                <ClipLoader size={100} loading={isLoading} color='white' />
            </div>
            <Routes>
                <Route path='/' element={<PageLayout><Home /></PageLayout>} />
                <Route path='/about' element={<PageLayout><About /></PageLayout>} />
                <Route path='/blog' element={<PageLayout><Blog /></PageLayout>} />
                <Route path='/contact' element={<PageLayout><Contact /></PageLayout>} />
                <Route path='/blog/:id' element={<PageLayout><SingleBlog /></PageLayout>} />
                <Route path='/login' element={<PageLayout><Login /></PageLayout>} />
                <Route path='/register' element={<PageLayout><Register /></PageLayout>} />

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
        </>
    )
}

export default App



