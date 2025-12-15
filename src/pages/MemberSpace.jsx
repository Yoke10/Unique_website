import React, { useState, useEffect } from 'react'
import Login from '../components/admin/Login'
import AdminDashboard from '../components/admin/AdminDashboard'
import MemberDashboard from '../components/member/MemberDashboard'
import { mockDataService } from '../services/mockDataService'

const MemberSpace = () => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const currentUser = mockDataService.getCurrentUser()
        if (currentUser) {
            setUser(currentUser)
        }
        setLoading(false)
    }, [])

    const handleLogin = (loggedInUser) => {
        setUser(loggedInUser)
    }

    const handleLogout = () => {
        mockDataService.logout()
        setUser(null)
    }

    if (loading) return null

    return (
        <div className="memberspace-page">
            {!user ? (
                <Login onLogin={handleLogin} />
            ) : (
                user.role === 'admin' ? (
                    <AdminDashboard user={user} onLogout={handleLogout} />
                ) : (
                    <MemberDashboard user={user} onLogout={handleLogout} />
                )
            )}
        </div>
    )
}

export default MemberSpace
