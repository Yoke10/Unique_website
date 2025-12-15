import React, { useState, useEffect } from 'react'
import { mockDataService } from '../../services/mockDataService'
import ReportGenerator from '../reports/ReportGenerator'
import { generateReportPDF, generateBulkPDF } from '../../utils/pdfGenerator'
import EmailManager from './EmailManager'
import ResourceManager from './ResourceManager'
import { useToast } from '../ui/Toast/ToastContext'
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "../ui/AlertDialog/AlertDialog"
import './AdminDashboard.css'

// Helper: Convert file to Base 64
const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = (error) => reject(error)
    })
}

// Constants
const MAX_IMAGE_SIZE = 2 * 1024 * 1024 // 2MB
const MAX_PDF_SIZE = 5 * 1024 * 1024 // 5MB

const AdminDashboard = ({ user, onLogout }) => {
    const { toast } = useToast()
    const [alertConfig, setAlertConfig] = useState({ open: false, title: '', description: '', action: null }) // NEW: Alert State

    const showAlert = (title, description, action) => {
        setAlertConfig({ open: true, title, description, action })
    }

    const handleConfirmAction = () => {
        if (alertConfig.action) alertConfig.action()
        setAlertConfig({ ...alertConfig, open: false })
    }

    const [activeSection, setActiveSection] = useState('events')
    const [formKey, setFormKey] = useState(0)

    // Events
    const [events, setEvents] = useState([])
    const [newEvent, setNewEvent] = useState({
        title: '', description: '', date: '', category: '',
        poster: '', image1: '', image2: '', image3: ''
    })

    // Bulletin
    const [bulletins, setBulletins] = useState([])
    const [newBulletin, setNewBulletin] = useState({
        title: '', month: '', poster: '', pdfUrl: ''
    })

    // Scrapbook
    const [scrapbooks, setScrapbooks] = useState([])
    const [newScrapbook, setNewScrapbook] = useState({
        title: '', date: '', poster: '', pdfUrl: ''
    })

    // Gallery
    const [galleryItems, setGalleryItems] = useState([])
    const [newGalleryItem, setNewGalleryItem] = useState({
        eventName: '', image: ''
    })

    // Support
    const [supportMessages, setSupportMessages] = useState([])
    const [selectedMessage, setSelectedMessage] = useState(null)

    // Joining Enquiry
    const [joiningEnquiries, setJoiningEnquiries] = useState([])
    const [selectedEnquiry, setSelectedEnquiry] = useState(null)

    // Members
    const [users, setUsers] = useState([])
    const [newUser, setNewUser] = useState({ username: '', password: '' })
    const [selectedUser, setSelectedUser] = useState(null)
    const [isEditingUser, setIsEditingUser] = useState(false)
    const [userEditForm, setUserEditForm] = useState({})

    const [message, setMessage] = useState('')

    // Reports
    const [reports, setReports] = useState([])
    const [reportFilter, setReportFilter] = useState({ month: new Date().toISOString().substring(0, 7), avenue: '' })
    const [selectedReport, setSelectedReport] = useState(null)

    // Storage
    const [storageUsage, setStorageUsage] = useState('0.00')

    // Board Members
    const [boardMembers, setBoardMembers] = useState([])
    const [newBoardMember, setNewBoardMember] = useState({
        name: '', role: '', message: '', image: ''
    })

    // Load Data
    useEffect(() => {
        loadData()
    }, [activeSection])

    const loadData = async () => {
        try {
            if (activeSection === 'events') setEvents(await mockDataService.getEvents())
            else if (activeSection === 'bulletin') setBulletins(await mockDataService.getBulletins())
            else if (activeSection === 'scrapbook') setScrapbooks(await mockDataService.getScrapbooks())
            else if (activeSection === 'gallery') setGalleryItems(await mockDataService.getGallery())
            else if (activeSection === 'support') setSupportMessages(await mockDataService.getSupportMessages())
            else if (activeSection === 'joining') setJoiningEnquiries(await mockDataService.getJoinRequests())
            else if (activeSection === 'members') setUsers(await mockDataService.getUsers())
            else if (activeSection === 'joining') setJoiningEnquiries(await mockDataService.getJoinRequests())
            else if (activeSection === 'members') setUsers(await mockDataService.getUsers())
            else if (activeSection === 'reports') setReports(await mockDataService.getReports())
            else if (activeSection === 'board') setBoardMembers(await mockDataService.getBoardMembers())

            // Usage
            setStorageUsage(await mockDataService.getStorageInfo())
        } catch (error) {
            console.error("Failed to load data", error)
        }
    }

    // FILE EXTRACT AND VALIDATE
    const handleFileSelect = async (e, type, setter, field) => {
        const file = e.target.files[0]
        if (!file) return

        // Validate Size
        if (type === 'image' && file.size > MAX_IMAGE_SIZE) {
            toast({ title: "File too large", description: `Image size should be less than ${MAX_IMAGE_SIZE / 1024 / 1024}MB`, variant: "destructive" })
            e.target.value = null
            return
        }
        if (type === 'pdf' && file.size > MAX_PDF_SIZE) {
            toast({ title: "File too large", description: `PDF size should be less than ${MAX_PDF_SIZE / 1024 / 1024}MB`, variant: "destructive" })
            e.target.value = null
            return
        }

        // Validate Type
        if (type === 'image' && file.type !== 'image/webp') {
            toast({ title: "Invalid File Type", description: 'Only WebP images are allowed', variant: "warning" })
            e.target.value = null
            return
        }
        if (type === 'pdf' && file.type !== 'application/pdf') {
            toast({ title: "Invalid File Type", description: 'Only PDF files are allowed', variant: "warning" })
            e.target.value = null
            return
        }

        try {
            const base64 = await fileToBase64(file)
            setter(prev => ({ ...prev, [field]: base64 }))
        } catch (err) {
            console.error("File reading failed", err)
            toast({ title: "Error", description: "Failed to read file", variant: "destructive" })
        }
    }

    // EVENTS HANDLERS
    const handleEventChange = (e) => {
        const { name, value } = e.target
        setNewEvent(prev => ({ ...prev, [name]: value }))
    }

    const handleEventSubmit = async (e) => {
        e.preventDefault()
        const images = [newEvent.image1, newEvent.image2, newEvent.image3].filter(img => img)
        if (!newEvent.poster) { toast({ title: "Missing Poster", description: "Poster is required (WebP)", variant: "destructive" }); return }

        await mockDataService.addEvent({ ...newEvent, images })
        toast({ title: "Success", description: "Event added successfully!", variant: "success" })
        setNewEvent({ title: '', description: '', date: '', category: '', poster: '', image1: '', image2: '', image3: '' })
        setFormKey(prev => prev + 1)
        loadData()
        setTimeout(() => setMessage(''), 3000)
    }

    const handleDeleteEvent = (id) => {
        showAlert("Delete Event?", "Are you sure you want to delete this event? This action cannot be undone.", async () => {
            await mockDataService.deleteEvent(id)
            loadData()
            toast({ title: "Deleted", description: "Event deleted successfully", variant: "default" })
        })
    }

    // BULLETIN HANDLERS
    const handleBulletinChange = (e) => {
        const { name, value } = e.target
        setNewBulletin(prev => ({ ...prev, [name]: value }))
    }

    const handleBulletinSubmit = async (e) => {
        e.preventDefault()
        if (!newBulletin.poster) { toast({ title: "Missing Cover", description: "Cover image is required (WebP)", variant: "destructive" }); return }
        if (!newBulletin.pdfUrl) { toast({ title: "Missing PDF", description: "PDF file or URL is required", variant: "destructive" }); return }

        await mockDataService.addBulletin(newBulletin)
        toast({ title: "Success", description: "Bulletin added successfully!", variant: "success" })
        setNewBulletin({ title: '', month: '', poster: '', pdfUrl: '' })
        setFormKey(prev => prev + 1)
        loadData()
        setTimeout(() => setMessage(''), 3000)
    }

    const handleDeleteBulletin = (id) => {
        showAlert("Delete Bulletin?", "Delete this bulletin and its files?", async () => {
            await mockDataService.deleteBulletin(id)
            loadData()
            toast({ title: "Deleted", description: "Bulletin deleted", variant: "default" })
        })
    }

    // SCRAPBOOK HANDLERS
    const handleScrapbookChange = (e) => {
        const { name, value } = e.target
        setNewScrapbook(prev => ({ ...prev, [name]: value }))
    }

    const handleScrapbookSubmit = async (e) => {
        e.preventDefault()
        if (!newScrapbook.poster) { toast({ title: "Missing Cover", description: "Cover image is required (WebP)", variant: "destructive" }); return }
        if (!newScrapbook.pdfUrl) { toast({ title: "Missing PDF", description: "PDF file or URL is required", variant: "destructive" }); return }

        try {
            await mockDataService.addScrapbook(newScrapbook)
            toast({ title: "Success", description: "Scrapbook added successfully!", variant: "success" })
            setNewScrapbook({ title: '', date: '', poster: '', pdfUrl: '' })
            setFormKey(prev => prev + 1)
            loadData()
        } catch (error) {
            console.error("Error saving scrapbook:", error)
            toast({ title: "Error", description: "Failed to save scrapbook. LocalStorage might be full. Try PDF URL.", variant: "destructive" })
        }
    }

    const handleDeleteScrapbook = (id) => {
        showAlert("Delete Scrapbook?", "Delete this scrapbook entry?", async () => {
            await mockDataService.deleteScrapbook(id)
            loadData()
            toast({ title: "Deleted", description: "Scrapbook deleted", variant: "default" })
        })
    }

    // GALLERY HANDLERS
    const handleGalleryChange = (e) => {
        const { name, value } = e.target
        setNewGalleryItem(prev => ({ ...prev, [name]: value }))
    }

    const handleGallerySubmit = async (e) => {
        e.preventDefault()
        if (!newGalleryItem.image) { toast({ title: "Missing Image", description: "Image is required (WebP)", variant: "destructive" }); return }

        await mockDataService.addGalleryItem(newGalleryItem)
        toast({ title: "Success", description: "Gallery item added!", variant: "success" })
        setNewGalleryItem({ eventName: '', image: '' })
        setFormKey(prev => prev + 1)
        loadData()
        setTimeout(() => setMessage(''), 3000)
    }

    const handleDeleteGalleryItem = (id) => {
        showAlert("Delete Image?", "Remove this image from the gallery?", async () => {
            await mockDataService.deleteGalleryItem(id)
            loadData()
        })
    }

    // SUPPORT HANDLERS
    const handleDeleteMessage = (id) => {
        showAlert("Delete Message?", "Permanently remove this support message?", async () => {
            await mockDataService.deleteSupportMessage(id)
            loadData()
            if (selectedMessage && selectedMessage.id === id) setSelectedMessage(null)
            toast({ title: "Deleted", description: "Message deleted", variant: "default" })
        })
    }

    // JOINING HANDLERS
    const handleDeleteEnquiry = (id) => {
        showAlert("Delete Enquiry?", "Remove this joining request?", async () => {
            await mockDataService.deleteJoinRequest(id)
            loadData()
            if (selectedEnquiry && selectedEnquiry.id === id) setSelectedEnquiry(null)
            toast({ title: "Deleted", description: "Enquiry deleted", variant: "default" })
        })
    }

    // MEMBERS HANDLERS
    const handleUserChange = (e) => {
        const { name, value } = e.target
        setNewUser(prev => ({ ...prev, [name]: value }))
    }

    const handleUserSubmit = async (e) => {
        e.preventDefault()
        try {
            // Generate Member ID First
            const memberId = await mockDataService.generateMemberId()
            // Add User with generated ID and default/provided details
            await mockDataService.addUser(newUser.username, newUser.password, memberId)
            toast({ title: "User Added", description: `User added successfully! Member ID: ${memberId}`, variant: "success", duration: 5000 })
            setNewUser({ username: '', password: '' })
            loadData()
        } catch (err) {
            toast({ title: "Error", description: err.message, variant: "destructive" })
        }
    }

    const handleDeleteUser = (id) => {
        showAlert("Delete User?", "Permanently delete this member/admin? This cannot be undone.", async () => {
            await mockDataService.deleteUser(id)
            loadData()
            toast({ title: "Deleted", description: "User deleted", variant: "default" })
        })
    }

    const toggleUserStatus = (user) => {
        const newStatus = user.status === 'active' ? 'deactive' : 'active'
        showAlert("Change Status?", `Change user status to ${newStatus.toUpperCase()}?`, async () => {
            await mockDataService.updateUser(user.id, { status: newStatus })
            loadData()
            toast({ title: "Status Updated", description: `User status changed to ${newStatus.toUpperCase()}`, variant: "success" })
        })
    }

    const toggleUserLock = (user) => {
        showAlert("Toggle Lock?", `${user.isLocked ? 'Unlock' : 'Lock'} this user account?`, async () => {
            await mockDataService.updateUser(user.id, { isLocked: !user.isLocked })
            loadData()
            toast({ title: "Lock Status Updated", description: `User ${user.isLocked ? 'Unlocked' : 'Locked'}`, variant: "info" })
        })
    }

    const handleViewUser = (user) => {
        setSelectedUser(user)
        setIsEditingUser(false)
        // Flatten for easier form handling
        setUserEditForm({
            username: user.username,
            role: user.role,
            ...user.profile
        })
    }

    const handleEditUserToggle = () => {
        if (!isEditingUser) setIsEditingUser(true)
        else {
            setIsEditingUser(false)
            // Reset form
            setUserEditForm({
                username: selectedUser.username,
                role: selectedUser.role,
                ...selectedUser.profile
            })
        }
    }

    const handleUserEditChange = (e) => {
        const { name, value } = e.target
        setUserEditForm(prev => ({ ...prev, [name]: value }))
    }

    const handleUserEditSave = () => {
        showAlert("Save Changes?", "Update user profile details?", async () => {
            try {
                // Separate root fields from profile fields
                const { username, role, ...profileData } = userEditForm

                await mockDataService.updateUser(selectedUser.id, {
                    username,
                    role,
                    profile: profileData
                })

                setSelectedUser(prev => ({ ...prev, username, role, profile: profileData }))
                setIsEditingUser(false)
                toast({ title: "Updated", description: "User details updated successfully", variant: "success" })
                loadData()
            } catch (err) {
                toast({ title: "Update Failed", description: "Failed to update: " + err.message, variant: "destructive" })
            }
        })
    }

    // BOARD MEMBER HANDLERS
    const handleBoardMemberChange = (e) => {
        const { name, value } = e.target
        setNewBoardMember(prev => ({ ...prev, [name]: value }))
    }

    const handleBoardMemberSubmit = async (e) => {
        e.preventDefault()
        if (!newBoardMember.image) { toast({ title: "Missing Image", description: "Image is required", variant: "destructive" }); return }

        await mockDataService.addBoardMember(newBoardMember)
        toast({ title: "Success", description: "Board Member added!", variant: "success" })
        setNewBoardMember({ name: '', role: '', message: '', image: '' })
        setFormKey(prev => prev + 1)
        loadData()
    }

    const handleDeleteBoardMember = (id) => {
        showAlert("Delete Member?", "Remove this board member?", async () => {
            await mockDataService.deleteBoardMember(id)
            loadData()
            toast({ title: "Deleted", description: "Member removed", variant: "default" })
        })
    }

    return (
        <div className="admin-container">
            {/* SIDEBAR */}
            <div className="admin-sidebar">
                <h2 className="sidebar-title">Admin Panel</h2>
                <nav className="sidebar-nav">
                    {['events', 'bulletin', 'scrapbook', 'gallery', 'board', 'support', 'joining', 'members', 'reports', 'resources', 'email'].map(s => (
                        <button key={s} onClick={() => setActiveSection(s)}
                            className={`nav-btn ${activeSection === s ? 'active' : ''}`}>
                            {s.charAt(0).toUpperCase() + s.slice(1).replace('email', 'Email Manager').replace('joining', 'Joining Enquiry').replace('board', 'Board Members')}
                        </button>
                    ))}
                </nav>
                <div className="sidebar-footer">
                    <div className="storage-info">
                        Storage Used: {storageUsage} MB / 5.00 MB
                    </div>
                    <button onClick={() => showAlert("Clear All Data?", "DANGER: This will wipe all data including users and events. Continue?", () => mockDataService.clearAllData())}
                        className="clear-data-btn">
                        Clear Data
                    </button>
                    <div style={{ marginBottom: '1rem', fontWeight: '600' }}>{user.username}</div>
                    <button onClick={() => showAlert("Logout?", "Are you sure you want to log out?", onLogout)} className="logout-btn">Logout</button>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="admin-main">
                <h1 className="section-title">Manage {activeSection.toUpperCase()}</h1>
                {message && <div className="message-box">{message}</div>}

                <div className={`dashboard-grid ${['support', 'joining', 'reports', 'email', 'resources'].includes(activeSection) ? 'full' : 'split'}`}>

                    {/* FORMS SECTION */}
                    {!['support', 'joining', 'reports', 'email', 'resources'].includes(activeSection) && (
                        <div className="form-card">
                            <h2 className="card-title">Add New</h2>

                            {/* EVENTS FORM */}
                            {activeSection === 'events' ? (
                                <form onSubmit={handleEventSubmit} className="admin-form">
                                    <input name="title" value={newEvent.title} onChange={handleEventChange} placeholder="Event Title" required className="admin-input" />
                                    <select name="category" value={newEvent.category} onChange={handleEventChange} required className="admin-input">
                                        <option value="">Select Category</option>
                                        <option value="Community Service">Community Service</option>
                                        <option value="Professional Development">Professional Development</option>
                                        <option value="International Service">International Service</option>
                                        <option value="Club Service">Club Service</option>
                                        <option value="Healthcare">Healthcare</option>
                                        <option value="Education">Education</option>
                                        <option value="Environment">Environment</option>
                                    </select>
                                    <textarea name="description" value={newEvent.description} onChange={handleEventChange} placeholder="Short Description" required className="admin-input admin-textarea" />
                                    <input type="date" name="date" value={newEvent.date} onChange={handleEventChange} required className="admin-input" />
                                    <div className="file-input-group">
                                        <label className="file-label">Poster (WebP, Max 2MB)</label>
                                        <input key={formKey} type="file" accept="image/webp" onChange={(e) => handleFileSelect(e, 'image', setNewEvent, 'poster')} required className="admin-input" />
                                    </div>
                                    <div className="image-grid">
                                        <div className="file-input-group">
                                            <label className="file-label">Image 1</label>
                                            <input key={formKey} type="file" accept="image/webp" onChange={(e) => handleFileSelect(e, 'image', setNewEvent, 'image1')} className="admin-input" />
                                        </div>
                                        <div className="file-input-group">
                                            <label className="file-label">Image 2</label>
                                            <input key={formKey + 1} type="file" accept="image/webp" onChange={(e) => handleFileSelect(e, 'image', setNewEvent, 'image2')} className="admin-input" />
                                        </div>
                                        <div className="file-input-group">
                                            <label className="file-label">Image 3</label>
                                            <input key={formKey + 2} type="file" accept="image/webp" onChange={(e) => handleFileSelect(e, 'image', setNewEvent, 'image3')} className="admin-input" />
                                        </div>
                                    </div>
                                    <button type="submit" className="primary-btn">Save Event</button>
                                </form>
                            ) : activeSection === 'bulletin' ? (
                                <form onSubmit={handleBulletinSubmit} className="admin-form">
                                    <input name="title" value={newBulletin.title} onChange={handleBulletinChange} placeholder="Bulletin Title" required className="admin-input" />
                                    <input name="month" value={newBulletin.month} onChange={handleBulletinChange} placeholder="Edition Month" required className="admin-input" />
                                    <div className="file-input-group">
                                        <label className="file-label">Cover Page (WebP, Max 2MB)</label>
                                        <input key={formKey} type="file" accept="image/webp" onChange={(e) => handleFileSelect(e, 'image', setNewBulletin, 'poster')} required className="admin-input" />
                                    </div>
                                    <div className="file-input-group">
                                        <label className="file-label">PDF File (Max 5MB) OR Paste URL below</label>
                                        <input key={formKey} type="file" accept="application/pdf" onChange={(e) => handleFileSelect(e, 'pdf', setNewBulletin, 'pdfUrl')} className="admin-input" />
                                        <input name="pdfUrl" value={newBulletin.pdfUrl} onChange={handleBulletinChange} placeholder="OR Paste PDF URL here" className="admin-input" />
                                    </div>
                                    <button type="submit" className="primary-btn">Save Bulletin</button>
                                </form>
                            ) : activeSection === 'scrapbook' ? (
                                <form onSubmit={handleScrapbookSubmit} className="admin-form">
                                    <input name="title" value={newScrapbook.title} onChange={handleScrapbookChange} placeholder="Scrapbook Title" required className="admin-input" />
                                    <input name="date" value={newScrapbook.date} onChange={handleScrapbookChange} placeholder="Date/Year" required className="admin-input" />
                                    <div className="file-input-group">
                                        <label className="file-label">Cover Page (WebP, Max 2MB)</label>
                                        <input key={formKey} type="file" accept="image/webp" onChange={(e) => handleFileSelect(e, 'image', setNewScrapbook, 'poster')} required className="admin-input" />
                                    </div>
                                    <div className="file-input-group">
                                        <label className="file-label">PDF File (Max 5MB) OR Paste URL below</label>
                                        <input key={formKey} type="file" accept="application/pdf" onChange={(e) => handleFileSelect(e, 'pdf', setNewScrapbook, 'pdfUrl')} className="admin-input" />
                                        <input name="pdfUrl" value={newScrapbook.pdfUrl} onChange={handleScrapbookChange} placeholder="OR Paste PDF URL here" className="admin-input" />
                                    </div>
                                    <button type="submit" className="primary-btn">Save Scrapbook</button>
                                </form>
                            ) : activeSection === 'gallery' ? (
                                <form onSubmit={handleGallerySubmit} className="admin-form">
                                    <input name="eventName" value={newGalleryItem.eventName} onChange={handleGalleryChange} placeholder="Event Name" required className="admin-input" />
                                    <div className="file-input-group">
                                        <label className="file-label">Image (WebP, Max 2MB)</label>
                                        <input key={formKey} type="file" accept="image/webp" onChange={(e) => handleFileSelect(e, 'image', setNewGalleryItem, 'image')} required className="admin-input" />
                                    </div>
                                    <button type="submit" className="primary-btn">Save Image</button>
                                </form>
                            ) : activeSection === 'board' ? (
                                <form onSubmit={handleBoardMemberSubmit} className="admin-form">
                                    <input name="name" value={newBoardMember.name} onChange={handleBoardMemberChange} placeholder="Member Name" required className="admin-input" />
                                    <input name="role" value={newBoardMember.role} onChange={handleBoardMemberChange} placeholder="Role / Portfolio" required className="admin-input" />
                                    <textarea name="message" value={newBoardMember.message} onChange={handleBoardMemberChange} placeholder="Short Message / Quote" className="admin-input admin-textarea" />
                                    <div className="file-input-group">
                                        <label className="file-label">Profile Image (WebP, Max 2MB)</label>
                                        <input key={formKey} type="file" accept="image/webp" onChange={(e) => handleFileSelect(e, 'image', setNewBoardMember, 'image')} required className="admin-input" />
                                    </div>
                                    <button type="submit" className="primary-btn">Add Board Member</button>
                                </form>
                            ) : (
                                <form onSubmit={handleUserSubmit} className="admin-form">
                                    <input name="username" value={newUser.username} onChange={handleUserChange} placeholder="Username" required className="admin-input" />
                                    <input type="password" name="password" value={newUser.password} onChange={handleUserChange} placeholder="Temporary Password" required className="admin-input" />
                                    <button type="submit" className="primary-btn">Add Member</button>
                                </form>
                            )}
                        </div>
                    )}

                    {/* LIST SECTION */}
                    <div className="list-card">
                        <h2 className="card-title">Existing Items</h2>
                        <div className="list-container">
                            {activeSection === 'events' && events.map(event => (
                                <div key={event.id} className="list-item">
                                    <img src={event.poster} alt={event.title} className="item-thumb" />
                                    <div className="item-content">
                                        <h4 className="item-title">{event.title}</h4>
                                        <span className="item-subtitle">{event.date}</span>
                                    </div>
                                    <button onClick={() => handleDeleteEvent(event.id)} className="delete-btn">Delete</button>
                                </div>
                            ))}
                            {activeSection === 'bulletin' && bulletins.map(bulletin => (
                                <div key={bulletin.id} className="list-item">
                                    <img src={bulletin.poster} alt={bulletin.title} className="item-thumb" />
                                    <div className="item-content">
                                        <h4 className="item-title">{bulletin.title}</h4>
                                        <span className="item-subtitle">{bulletin.month}</span>
                                    </div>
                                    <button onClick={() => handleDeleteBulletin(bulletin.id)} className="delete-btn">Delete</button>
                                </div>
                            ))}
                            {activeSection === 'scrapbook' && scrapbooks.map(scrapbook => (
                                <div key={scrapbook.id} className="list-item">
                                    <img src={scrapbook.poster} alt={scrapbook.title} className="item-thumb" />
                                    <div className="item-content">
                                        <h4 className="item-title">{scrapbook.title}</h4>
                                        <span className="item-subtitle">{scrapbook.date}</span>
                                    </div>
                                    <button onClick={() => handleDeleteScrapbook(scrapbook.id)} className="delete-btn">Delete</button>
                                </div>
                            ))}
                            {activeSection === 'gallery' && galleryItems.map(item => (
                                <div key={item.id} className="list-item">
                                    <img src={item.image} alt={item.eventName} className="item-thumb" />
                                    <div className="item-content">
                                        <h4 className="item-title">{item.eventName}</h4>
                                    </div>
                                    <button onClick={() => handleDeleteGalleryItem(item.id)} className="delete-btn">Delete</button>
                                </div>
                            ))}
                            {activeSection === 'board' && boardMembers.map(item => (
                                <div key={item.id} className="list-item">
                                    <img src={item.image} alt={item.name} className="item-thumb" style={{ borderRadius: '50%' }} />
                                    <div className="item-content">
                                        <h4 className="item-title">{item.name}</h4>
                                        <span className="item-subtitle">{item.role}</span>
                                    </div>
                                    <button onClick={() => handleDeleteBoardMember(item.id)} className="delete-btn">Delete</button>
                                </div>
                            ))}
                            {activeSection === 'support' && supportMessages.map(msg => (
                                <div key={msg.id} className="list-item">
                                    <div className="item-content">
                                        <h4 className="item-title">{msg.fullName}</h4>
                                        <p style={{ margin: 0 }}>{msg.email}</p>
                                    </div>
                                    <div className="action-btn-group">
                                        <button onClick={() => setSelectedMessage(msg)} className="primary-btn view-btn">View</button>
                                        <button onClick={() => handleDeleteMessage(msg.id)} className="delete-btn">Delete</button>
                                    </div>
                                </div>
                            ))
                            }
                            {activeSection === 'joining' && joiningEnquiries.map(enquiry => (
                                <div key={enquiry.id} className="list-item">
                                    <div className="item-content">
                                        <h4 className="item-title">{enquiry.fullName}</h4>
                                        <p style={{ margin: 0 }}>{enquiry.email}</p>
                                    </div>
                                    <div className="action-btn-group">
                                        <button onClick={() => setSelectedEnquiry(enquiry)} className="primary-btn view-btn">View</button>
                                        <button onClick={() => handleDeleteEnquiry(enquiry.id)} className="delete-btn">Delete</button>
                                    </div>
                                </div>
                            ))
                            }
                            {activeSection === 'members' && users.map(u => (
                                <div key={u.id} className="list-item">
                                    <div className="item-content">
                                        <h4 className="item-title">{u.profile && u.profile.fullName ? u.profile.fullName : u.username}</h4>
                                        <p className="item-subtitle">ID: {u.memberId || 'Pending'} | {u.status}</p>
                                    </div>
                                    <div className="action-btn-group">
                                        <button onClick={() => handleViewUser(u)} className="primary-btn sm-btn">View</button>
                                        <button onClick={() => toggleUserStatus(u)} className="primary-btn sm-btn" style={{ background: u.status === 'active' ? '#ffc107' : '#28a745', color: '#333' }}>{u.status === 'active' ? 'Deactivate' : 'Activate'}</button>
                                        <button onClick={() => toggleUserLock(u)} className="primary-btn sm-btn" style={{ background: '#6c757d' }}>{u.isLocked ? 'Unlock' : 'Lock'}</button>
                                        <button onClick={() => handleDeleteUser(u.id)} className="delete-btn">Delete</button>
                                    </div>
                                </div>
                            ))
                            }
                            {activeSection === 'reports' && (
                                <div>
                                    <div className="report-filter">
                                        <input type="month" value={reportFilter.month} onChange={e => setReportFilter({ ...reportFilter, month: e.target.value })} className="admin-input" style={{ width: 'auto' }} />
                                        <button onClick={() => generateBulkPDF(reports, `Reports_${reportFilter.month}.pdf`)} className="primary-btn view-btn" style={{ background: '#17a2b8' }}>Download Filtered</button>
                                    </div>
                                    {reports.filter(r => (!reportFilter.month || r.eventDate.startsWith(reportFilter.month))).map(report => (
                                        <div key={report.id} className="list-item">
                                            <div className="item-content">
                                                <h4 className="item-title">{report.eventName}</h4>
                                                <p className="item-subtitle">{report.eventDate}</p>
                                            </div>
                                            <div className="action-btn-group">
                                                <button onClick={() => setSelectedReport(report)} className="primary-btn view-btn">View</button>
                                                <button onClick={() => generateReportPDF(report)} className="primary-btn view-btn" style={{ background: '#17a2b8' }}>Download</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {activeSection === 'email' && <EmailManager />}
                            {activeSection === 'resources' && <ResourceManager />}
                        </div>
                    </div>
                </div>

                {/* MODALS */}
                {
                    selectedMessage && (
                        <div className="modal-overlay"><div className="modal-box"><button onClick={() => setSelectedMessage(null)} className="modal-close-btn">✕</button>
                            <h2 className="modal-title">Message Details</h2>
                            <p><strong>Name:</strong> {selectedMessage.fullName}</p>
                            <p><strong>Email:</strong> {selectedMessage.email}</p>
                            <p><strong>Phone:</strong> {selectedMessage.phone || '-'}</p>
                            <p><strong>Profession:</strong> {selectedMessage.profession || '-'}</p>
                            <p><strong>Location:</strong> {selectedMessage.location || '-'}</p>
                            <p><strong>Purpose:</strong> {selectedMessage.purpose || '-'}</p>
                            <p><strong>Date:</strong> {selectedMessage.date || '-'}</p>
                            <div className="detail-msg-box">
                                <p style={{ margin: 0, fontWeight: 'bold' }}>Message:</p>
                                <p style={{ margin: '0.5rem 0 0 0', whiteSpace: 'pre-wrap' }}>{selectedMessage.message}</p>
                            </div>
                        </div></div>
                    )
                }
                {
                    selectedEnquiry && (
                        <div className="modal-overlay"><div className="modal-box large"><button onClick={() => setSelectedEnquiry(null)} className="modal-close-btn">✕</button>
                            <h2 className="modal-title">Joining Enquiry Details</h2>
                            <div className="detail-grid">
                                <div><p><strong>Name:</strong> {selectedEnquiry.fullName}</p></div>
                                <div><p><strong>Email:</strong> {selectedEnquiry.email}</p></div>
                                <div><p><strong>Phone:</strong> {selectedEnquiry.phone || '-'}</p></div>
                                <div><p><strong>DOB:</strong> {selectedEnquiry.dob || '-'}</p></div>
                                <div><p><strong>Gender:</strong> {selectedEnquiry.gender || '-'}</p></div>
                                <div><p><strong>Location:</strong> {selectedEnquiry.location || '-'}</p></div>
                                <div><p><strong>Profession:</strong> {selectedEnquiry.profession || '-'}</p></div>
                                <div><p><strong>Request Date:</strong> {selectedEnquiry.date || '-'}</p></div>
                            </div>
                            <p><strong>Other NGO Experience:</strong> {selectedEnquiry.otherNGO || '-'}</p>
                            <p><strong>Source:</strong> {selectedEnquiry.source || '-'}</p>
                            <div className="detail-msg-box">
                                <p style={{ margin: 0, fontWeight: 'bold' }}>Reason for Joining:</p>
                                <p style={{ margin: '0.5rem 0 0 0', whiteSpace: 'pre-wrap' }}>{selectedEnquiry.reason}</p>
                            </div>
                        </div></div>
                    )
                }
                {
                    selectedUser && (
                        <div className="modal-overlay">
                            <div className="modal-box large" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
                                <button onClick={() => setSelectedUser(null)} className="modal-close-btn">✕</button>
                                <h2 className="modal-title">User Details & Edit</h2>

                                {isEditingUser ? (
                                    <div className="edit-user-grid">
                                        <h3 style={{ gridColumn: '1 / -1', borderBottom: '1px solid #eee', paddingBottom: '0.5rem', color: '#666' }}>Account Info</h3>
                                        <div>
                                            <label className="file-label">Username</label>
                                            <input name="username" value={userEditForm.username || ''} onChange={handleUserEditChange} className="admin-input" />
                                        </div>
                                        <div>
                                            <label className="file-label">Role</label>
                                            <select name="role" value={userEditForm.role || 'member'} onChange={handleUserEditChange} className="admin-input">
                                                <option value="member">Member</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </div>

                                        <h3 style={{ gridColumn: '1 / -1', borderBottom: '1px solid #eee', paddingBottom: '0.5rem', marginTop: '1rem', color: '#666' }}>Personal Details</h3>
                                        <div>
                                            <label className="file-label">Full Name</label>
                                            <input name="fullName" value={userEditForm.fullName || ''} onChange={handleUserEditChange} className="admin-input" />
                                        </div>
                                        <div>
                                            <label className="file-label">Email</label>
                                            <input name="email" value={userEditForm.email || ''} onChange={handleUserEditChange} className="admin-input" />
                                        </div>
                                        <div>
                                            <label className="file-label">Date of Birth</label>
                                            <input type="date" name="dob" value={userEditForm.dob || ''} onChange={handleUserEditChange} className="admin-input" />
                                        </div>
                                        <div>
                                            <label className="file-label">Gender</label>
                                            <select name="gender" value={userEditForm.gender || ''} onChange={handleUserEditChange} className="admin-input">
                                                <option value="">Select</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="file-label">Blood Group</label>
                                            <select name="bloodGroup" value={userEditForm.bloodGroup || ''} onChange={handleUserEditChange} className="admin-input">
                                                <option value="">Select</option>
                                                <option value="A+">A+</option>
                                                <option value="A-">A-</option>
                                                <option value="B+">B+</option>
                                                <option value="B-">B-</option>
                                                <option value="AB+">AB+</option>
                                                <option value="AB-">AB-</option>
                                                <option value="O+">O+</option>
                                                <option value="O-">O-</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="file-label">RI ID</label>
                                            <input name="riId" value={userEditForm.riId || ''} onChange={handleUserEditChange} className="admin-input" />
                                        </div>

                                        <h3 style={{ gridColumn: '1 / -1', borderBottom: '1px solid #eee', paddingBottom: '0.5rem', marginTop: '1rem', color: '#666' }}>Contact Info</h3>
                                        <div>
                                            <label className="file-label">Phone</label>
                                            <input name="contact" value={userEditForm.contact || ''} onChange={handleUserEditChange} className="admin-input" />
                                        </div>
                                        <div>
                                            <label className="file-label">Emergency Contact</label>
                                            <input name="emergencyContact" value={userEditForm.emergencyContact || ''} onChange={handleUserEditChange} className="admin-input" />
                                        </div>
                                        <div style={{ gridColumn: '1 / -1' }}>
                                            <label className="file-label">Address Line 1</label>
                                            <input name="addressLine1" value={userEditForm.addressLine1 || ''} onChange={handleUserEditChange} className="admin-input" />
                                        </div>
                                        <div style={{ gridColumn: '1 / -1' }}>
                                            <label className="file-label">Address Line 2</label>
                                            <input name="addressLine2" value={userEditForm.addressLine2 || ''} onChange={handleUserEditChange} className="admin-input" />
                                        </div>

                                        <h3 style={{ gridColumn: '1 / -1', borderBottom: '1px solid #eee', paddingBottom: '0.5rem', marginTop: '1rem', color: '#666' }}>Other Info</h3>
                                        <div>
                                            <label className="file-label">Profession</label>
                                            <select name="profession" value={userEditForm.profession || 'Student'} onChange={handleUserEditChange} className="admin-input">
                                                <option value="Student">Student</option>
                                                <option value="Working Professional">Working Professional</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="file-label">Hobbies</label>
                                            <input name="hobbies" value={userEditForm.hobbies || ''} onChange={handleUserEditChange} className="admin-input" />
                                        </div>
                                        <div>
                                            <label className="file-label">Parent Name</label>
                                            <input name="parentName" value={userEditForm.parentName || ''} onChange={handleUserEditChange} className="admin-input" />
                                        </div>
                                        <div>
                                            <label className="file-label">Parent Contact</label>
                                            <input name="parentContact" value={userEditForm.parentContact || ''} onChange={handleUserEditChange} className="admin-input" />
                                        </div>

                                        <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                                            <button onClick={handleUserEditSave} className="primary-btn" style={{ background: 'green' }}>Save Everything</button>
                                            <button onClick={() => setIsEditingUser(false)} className="primary-btn" style={{ background: '#666' }}>Cancel</button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="view-user-details" style={{ lineHeight: '1.6' }}>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                            <div><strong>Username:</strong> {selectedUser.username}</div>
                                            <div><strong>Member ID:</strong> {selectedUser.memberId || '-'}</div>
                                            <div><strong>Role:</strong> {selectedUser.role}</div>
                                            <div><strong>Status:</strong> <span style={{ color: selectedUser.status === 'active' ? 'green' : 'red' }}>{selectedUser.status}</span></div>
                                            <div><strong>Date of Birth:</strong> {selectedUser.profile?.dob || '-'}</div>
                                            <div><strong>Gender:</strong> {selectedUser.profile?.gender || '-'}</div>
                                            <div><strong>Blood Group:</strong> {selectedUser.profile?.bloodGroup || '-'}</div>
                                            <div><strong>RI ID:</strong> {selectedUser.profile?.riId || '-'}</div>
                                        </div>
                                        <hr style={{ margin: '1rem 0', borderColor: '#eee' }} />
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                            <div><strong>Full Name:</strong> {selectedUser.profile?.fullName || '-'}</div>
                                            <div><strong>Email:</strong> {selectedUser.profile?.email || '-'}</div>
                                            <div><strong>Contact:</strong> {selectedUser.profile?.contact || '-'}</div>
                                            <div><strong>Emergency:</strong> {selectedUser.profile?.emergencyContact || '-'}</div>
                                        </div>
                                        <p><strong>Address:</strong> {selectedUser.profile?.addressLine1}{selectedUser.profile?.addressLine2 ? ', ' + selectedUser.profile.addressLine2 : ''}</p>
                                        <hr style={{ margin: '1rem 0', borderColor: '#eee' }} />
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                            <div><strong>Profession:</strong> {selectedUser.profile?.profession || '-'}</div>
                                            <div><strong>Hobbies:</strong> {selectedUser.profile?.hobbies || '-'}</div>
                                            <div><strong>Parent Name:</strong> {selectedUser.profile?.parentName || '-'}</div>
                                            <div><strong>Parent Contact:</strong> {selectedUser.profile?.parentContact || '-'}</div>
                                        </div>

                                        <button onClick={handleEditUserToggle} className="primary-btn" style={{ marginTop: '2rem', width: '100%' }}>Edit Details</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                }
                {
                    selectedReport && (
                        <div className="modal-overlay"><div className="modal-box xl">
                            <ReportGenerator user={user} reportData={selectedReport} isAdmin={true} onSave={(data) => { mockDataService.updateReport(data.id, data); setSelectedReport(null); loadData(); }} onCancel={() => setSelectedReport(null)} />
                        </div></div>
                    )
                }
            </div>
            {/* ALERT DIALOG */}
            <AlertDialog open={alertConfig.open} onOpenChange={(open) => setAlertConfig(prev => ({ ...prev, open }))}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{alertConfig.title}</AlertDialogTitle>
                        <AlertDialogDescription>{alertConfig.description}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmAction}>Confirm</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default AdminDashboard
