import React, { useState, useEffect } from 'react'
import { mockDataService } from '../../services/mockDataService'
import { useToast } from '../ui/Toast/ToastContext'
import * as XLSX from 'xlsx'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
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

// ================== STYLES ==================
const tabStyle = { padding: '1rem 2rem', border: 'none', background: 'transparent', fontSize: '1rem', fontWeight: '500', color: '#666', cursor: 'pointer', borderBottom: '3px solid transparent' }
const activeTabStyle = { ...tabStyle, color: 'var(--primary-magenta)', borderBottom: '3px solid var(--primary-magenta)', fontWeight: 'bold' }
const thStyle = { padding: '1rem', borderBottom: '2px solid #ddd', color: '#555' }
const tdStyle = { padding: '1rem', borderBottom: '1px solid #eee' }
const labelStyle = { display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#444' }
const inputStyle = { width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', fontFamily: 'inherit' }
const primaryBtn = { padding: '0.8rem 1.5rem', background: 'var(--primary-magenta)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }
const actionBtn = { padding: '0.4rem 0.8rem', border: '1px solid #ddd', background: 'white', borderRadius: '5px', cursor: 'pointer', fontSize: '0.8rem' }

// ================== HELPER COMPONENTS ==================
const ViewDataModal = ({ category, data, onClose, onSave, showAlert }) => {
    const [list, setList] = useState(data || [])
    const [editIdx, setEditIdx] = useState(null)
    const [editItem, setEditItem] = useState({})

    const handleDelete = (idx) => {
        showAlert("Delete Contact?", "Are you sure you want to delete this contact?", () => {
            const newList = list.filter((_, i) => i !== idx)
            setList(newList)
        })
    }

    const handleSaveEdit = () => {
        const newList = [...list]
        newList[editIdx] = editItem
        setList(newList)
        setEditIdx(null)
    }

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
            <div style={{ background: 'white', padding: '2rem', borderRadius: '15px', width: '90%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <h3 style={{ textTransform: 'capitalize' }}>Manage {category}</h3>
                    <button onClick={onClose} style={{ background: 'transparent', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>✕</button>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2rem' }}>
                    <thead>
                        <tr style={{ background: '#f8f9fa', textAlign: 'left' }}>
                            <th style={thStyle}>Name</th>
                            <th style={thStyle}>Email</th>
                            <th style={thStyle}>DOB</th>
                            <th style={thStyle}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list.length === 0 ? <tr><td colSpan="4" style={{ padding: '1rem', textAlign: 'center' }}>No data</td></tr> : list.map((item, idx) => (
                            editIdx === idx ? (
                                <tr key={idx}>
                                    <td><input value={editItem.name || ''} onChange={e => setEditItem({ ...editItem, name: e.target.value })} style={{ padding: '0.4rem' }} /></td>
                                    <td><input value={editItem.email || ''} onChange={e => setEditItem({ ...editItem, email: e.target.value })} style={{ padding: '0.4rem' }} /></td>
                                    <td><input type="date" value={editItem.dob || ''} onChange={e => setEditItem({ ...editItem, dob: e.target.value })} style={{ padding: '0.4rem' }} /></td>
                                    <td>
                                        <button onClick={handleSaveEdit} style={{ ...actionBtn, background: 'green', color: 'white' }}>Save</button>
                                        <button onClick={() => setEditIdx(null)} style={actionBtn}>Cancel</button>
                                    </td>
                                </tr>
                            ) : (
                                <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={tdStyle}>{item.name}</td>
                                    <td style={tdStyle}>{item.email}</td>
                                    <td style={tdStyle}>{item.dob}</td>
                                    <td style={tdStyle}>
                                        <button onClick={() => { setEditIdx(idx); setEditItem(item) }} style={{ ...actionBtn, marginRight: '0.5rem' }}>Edit</button>
                                        <button onClick={() => handleDelete(idx)} style={{ ...actionBtn, color: 'red', borderColor: 'red' }}>Delete</button>
                                    </td>
                                </tr>
                            )
                        ))}
                    </tbody>
                </table>



                {/* ADD NEW ROW */}
                <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '10px', marginBottom: '2rem' }}>
                    <h4 style={{ margin: '0 0 1rem 0' }}>Add New Contact</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '0.5rem', alignItems: 'end' }}>
                        <div>
                            <label style={{ fontSize: '0.8rem', display: 'block', marginBottom: '0.2rem' }}>Name</label>
                            <input placeholder="Name" id="newName" style={{ ...inputStyle, padding: '0.5rem' }} />
                        </div>
                        <div>
                            <label style={{ fontSize: '0.8rem', display: 'block', marginBottom: '0.2rem' }}>Email</label>
                            <input placeholder="Email" id="newEmail" style={{ ...inputStyle, padding: '0.5rem' }} />
                        </div>
                        <div>
                            <label style={{ fontSize: '0.8rem', display: 'block', marginBottom: '0.2rem' }}>DOB</label>
                            <input type="date" id="newDob" style={{ ...inputStyle, padding: '0.5rem' }} />
                        </div>
                        <button onClick={() => {
                            const name = document.getElementById('newName').value
                            const email = document.getElementById('newEmail').value
                            const dob = document.getElementById('newDob').value
                            if (name && email && dob) {
                                setList([...list, { name, email, dob }])
                                document.getElementById('newName').value = ''
                                document.getElementById('newEmail').value = ''
                                document.getElementById('newDob').value = ''
                            } else {
                                alert("Please fill all fields")
                            }
                        }} style={{ ...primaryBtn, padding: '0.5rem 1rem', height: 'fit-content' }}>Add</button>
                    </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                    <button onClick={() => onSave(list)} style={primaryBtn}>Save Changes</button>
                </div>
            </div >
        </div >
    )
}

const UploadCard = ({ title, count, onUpload, onView, color }) => (
    <div style={{ padding: '1.5rem', background: color, borderRadius: '15px', border: '1px solid rgba(0,0,0,0.05)' }}>
        <h4 style={{ margin: '0 0 0.5rem 0' }}>{title}</h4>
        <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#333' }}>{count}</p>
        <span style={{ fontSize: '0.8rem', color: '#666', marginBottom: '1rem', display: 'block' }}>records loaded</span>
        <input type="file" accept=".xlsx" onChange={onUpload} style={{ width: '100%', fontSize: '0.8rem', marginBottom: '0.5rem' }} />
        {count > 0 && (
            <button onClick={onView} style={{ width: '100%', padding: '0.4rem', border: '1px solid #aaa', background: 'white', borderRadius: '5px', cursor: 'pointer', fontSize: '0.9rem' }}>
                View / Edit List
            </button>
        )}
    </div>
)

// ================== MAIN COMPONENT ==================
const EmailManager = () => {
    console.log("Email Manager: Restoring Full Component")
    const { toast } = useToast()
    const [alertConfig, setAlertConfig] = useState({ open: false, title: '', description: '', action: null })

    const showAlert = (title, description, action) => {
        setAlertConfig({ open: true, title, description, action })
    }

    const handleConfirmAction = () => {
        if (alertConfig.action) alertConfig.action()
        setAlertConfig({ ...alertConfig, open: false })
    }

    const [activeTab, setActiveTab] = useState('birthday') // birthday | compose | settings

    // BIRTHDAY STATE
    const [contacts, setContacts] = useState({ presidents: [], secretaries: [], council: [] })
    const [members, setMembers] = useState([])
    const [upcomingMessages, setUpcomingMessages] = useState([])
    const [editingSchedule, setEditingSchedule] = useState(null)
    const [editSubject, setEditSubject] = useState('')
    const [editBody, setEditBody] = useState('')

    // VIEW DATA STATE
    const [viewDataCategory, setViewDataCategory] = useState(null)

    // COMPOSE STATE
    const [bulkRecipients, setBulkRecipients] = useState([])
    const [composeSubject, setComposeSubject] = useState('')
    const [composeBody, setComposeBody] = useState('')
    const [isSending, setIsSending] = useState(false)

    // SETTINGS STATE
    const [config, setConfig] = useState({})
    const [isConfigEditing, setIsConfigEditing] = useState(false)

    // HISTORY STATE
    const [sentLogs, setSentLogs] = useState([])

    // --- DATA LOADING ---
    const loadData = async () => {
        try {
            const loadedContacts = await mockDataService.getBirthdayContacts()
            setContacts(loadedContacts || { presidents: [], secretaries: [], council: [] })

            const loadedUsers = await mockDataService.getUsers()
            setMembers((loadedUsers || []).filter(u => u.type === 'member'))

            const loadedConfig = await mockDataService.getClubConfig()
            setConfig(loadedConfig || {})

            const loadedLogs = await mockDataService.getSentLogs()
            setSentLogs(loadedLogs || [])
            calculateUpcomingSchedule()
        } catch (e) {
            console.error("Error loading mock data:", e)
        }
    }

    useEffect(() => {
        loadData()
    }, [])

    // --- LOGIC ---
    const handleViewList = (category) => {
        if (!contacts?.[category]) return
        setViewDataCategory(category)
    }

    const handleSaveDataList = (category, newData) => {
        const current = contacts || { presidents: [], secretaries: [], council: [] }
        const newContacts = { ...current, [category]: newData }
        setContacts(newContacts)
        mockDataService.saveBirthdayContacts(newContacts)
        setViewDataCategory(null)
        mockDataService.saveBirthdayContacts(newContacts)
        setViewDataCategory(null)
        toast({ title: "Saved", description: `Updated ${category} list!`, variant: "success" })
    }

    // --- HELPERS ---
    const parseDate = (input) => {
        if (!input) return null
        if (typeof input === 'number') {
            const date = new Date(Math.round((input - 25569) * 86400 * 1000))
            return date.toISOString().split('T')[0]
        }
        if (input instanceof Date) return input.toISOString().split('T')[0]

        let str = String(input).trim()

        // Handle DD/MM/YYYY or DD-MM-YYYY
        const dmy = str.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/)
        if (dmy) {
            return `${dmy[3]}-${dmy[2].padStart(2, '0')}-${dmy[1].padStart(2, '0')}`
        }

        // Handle YYYY-MM-DD
        const ymd = str.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/)
        if (ymd) {
            return `${ymd[1]}-${ymd[2].padStart(2, '0')}-${ymd[3].padStart(2, '0')}`
        }

        // Fallback
        const d = new Date(str)
        if (!isNaN(d.getTime())) return d.toISOString().split('T')[0]

        return null
    }

    const handleFileUpload = (e, category) => {
        const file = e.target.files[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (event) => {
            try {
                const data = new Uint8Array(event.target.result)
                const workbook = XLSX.read(data, { type: 'array' })
                const sheetName = workbook.SheetNames[0]
                const worksheet = workbook.Sheets[sheetName]
                const json = XLSX.utils.sheet_to_json(worksheet)

                const normalizedData = json.map(item => {
                    const newItem = {}
                    Object.keys(item).forEach(k => {
                        const key = k.toLowerCase().trim()
                        if (key.includes('mail')) newItem.email = item[k]
                        else if (key.includes('name')) newItem.name = item[k]
                        else if (key.includes('dob')) {
                            newItem.dob = parseDate(item[k])
                        } else {
                            newItem[key] = item[k]
                        }
                    })
                    return newItem
                }).filter(item => item.email && item.dob)

                console.log(`Parsed ${normalizedData.length} valid contacts from ${json.length} rows.`)

                if (category === 'bulk') {
                    setBulkRecipients(normalizedData)
                    toast({ title: "Loaded", description: `Loaded ${normalizedData.length} recipients for bulk mail!`, variant: "success" })
                } else {
                    const current = contacts || { presidents: [], secretaries: [], council: [] }
                    const newContacts = { ...current, [category]: normalizedData }
                    setContacts(newContacts)
                    mockDataService.saveBirthdayContacts(newContacts)
                    toast({ title: "Imported", description: `Imported ${normalizedData.length} ${category}!`, variant: "success" })
                }

            } catch (err) {
                console.error("Excel parse error:", err)
                toast({ title: "Parse Error", description: "Error parsing Excel file.", variant: "destructive" })
            }
        }
        reader.readAsArrayBuffer(file)
    }

    // --- SCHEDULE LOGIC ---
    const calculateUpcomingSchedule = async () => {
        if (!contacts) return

        const now = new Date()
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()) // 00:00:00 Local

        console.log("=== CALCULATING SCHEDULE ===")
        console.log("Today:", today.toDateString())

        try {
            const templates = (await mockDataService.getEmailTemplates()) || {}
            const sentLogs = (await mockDataService.getSentLogs()) || []

            const processContact = async (contact, category) => {
                if (!contact.dob) return null

                // Re-parse to be safe, using the robust helper
                const dobStr = parseDate(contact.dob)
                if (!dobStr) {
                    console.log(`Skipping invalid date for ${contact.name}: ${contact.dob}`)
                    return null
                }

                const [y, m, d] = dobStr.split('-').map(Number)

                // Construct birthday for THIS YEAR
                const currentYearBirthday = new Date(today.getFullYear(), m - 1, d)
                const nextYearBirthday = new Date(today.getFullYear() + 1, m - 1, d)

                let nextBirthday = currentYearBirthday

                // DEBUG LOG
                // console.log(`Checking ${contact.name} (${dobStr}). This Year: ${currentYearBirthday.toDateString()}`)

                // If strictly less than today (yesterday or before), it's passed.
                // If EQUAL to today, it is today.
                if (currentYearBirthday.getTime() < today.getTime()) {
                    nextBirthday = nextYearBirthday
                }

                const diffTime = nextBirthday.getTime() - today.getTime()
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

                // console.log(`  -> Next: ${nextBirthday.toDateString()}, Days Away: ${diffDays}`)

                if (diffDays >= 0 && diffDays <= 30) {
                    const dateStr = `${nextBirthday.getFullYear()}-${String(nextBirthday.getMonth() + 1).padStart(2, '0')}-${String(nextBirthday.getDate()).padStart(2, '0')}`

                    // Fix: Strict Name Matching. 
                    // Legacy logs (no name) are ignored to prevent false positives.
                    const isSent = sentLogs.some(log => log.email === contact.email && log.date === dateStr && log.type === 'birthday' && log.name === contact.name)
                    // Fix: Pass name to get specific draft for this person
                    const override = await mockDataService.getScheduledOverride(contact.email, dateStr, contact.name)

                    let role = 'member'
                    if (category === 'presidents') role = 'president'
                    if (category === 'secretaries') role = 'secretary'
                    if (category === 'council') role = 'council'

                    // Template Fallback Logic - HTML Supported
                    let defaultTemplate = {
                        subject: 'Happy Birthday!',
                        body: '<p>Dear <strong>{name}</strong>,</p><p>Wishing you a very <strong>Happy Birthday</strong>! Have a fantastic year ahead.</p><p><br></p><p>Best Regards,</p><p><em>Rotaract Club</em></p>'
                    }
                    if (Array.isArray(templates) && templates.length > 0) {
                        // User requested common template
                        const found = templates[0] // Just take the first valid one if we want commonality, or strict check
                        if (found) defaultTemplate = found
                    }

                    return {
                        ...contact,
                        nextBirthday: dateStr,
                        daysAway: diffDays,
                        category,
                        subject: override ? override.subject : defaultTemplate.subject,
                        body: override ? override.body : (defaultTemplate.body || '').replace('{name}', contact.name || 'Friend'),
                        isOverride: !!override,
                        isSent: isSent
                    }
                }
                return null
            }

            const promises = []
            if (contacts.presidents) contacts.presidents.forEach(c => promises.push(processContact(c, 'presidents')))
            if (contacts.secretaries) contacts.secretaries.forEach(c => promises.push(processContact(c, 'secretaries')))
            if (contacts.council) contacts.council.forEach(c => promises.push(processContact(c, 'council')))

            if (members) {
                members.forEach(m => {
                    if (m.profile?.dob && m.profile?.email) {
                        promises.push(processContact({
                            name: m.profile.fullName || m.username,
                            email: m.profile.email,
                            dob: m.profile.dob
                        }, 'members'))
                    }
                })
            }

            const results = await Promise.all(promises)
            const validResults = results.filter(r => r !== null)
            validResults.sort((a, b) => a.daysAway - b.daysAway)

            console.log(`Found ${validResults.length} upcoming birthdays.`)
            setUpcomingMessages(validResults)

        } catch (err) {
            console.error("Error calculating schedule:", err)
        }
    }

    // Dependency Effect for Schedule
    useEffect(() => {
        if (contacts) {
            calculateUpcomingSchedule()
        }
    }, [contacts, members])

    // --- ACTIONS ---
    const handleEditSchedule = (msg) => {
        setEditingSchedule(msg)
        setEditSubject(msg.subject)
        setEditBody(msg.body)
    }

    const handleSaveScheduleOverride = async () => {
        if (!editingSchedule) return
        await mockDataService.saveScheduledOverride(editingSchedule.email, editingSchedule.nextBirthday, editSubject, editBody, editingSchedule.name)
        setEditingSchedule(null)
        calculateUpcomingSchedule()
        await mockDataService.saveScheduledOverride(editingSchedule.email, editingSchedule.nextBirthday, editSubject, editBody, editingSchedule.name)
        setEditingSchedule(null)
        calculateUpcomingSchedule()
        toast({ title: "Draft Saved", description: "Message draft updated for " + editingSchedule.name, variant: "success" })
    }

    const handleMarkUnsent = async (msg) => {
        showAlert("Mark Unsent?", `Mark email to ${msg.name} as UNSENT? This will allow you to send it again.`, async () => {
            await mockDataService.removeSentLog(msg.email, msg.nextBirthday, msg.name)
            calculateUpcomingSchedule()
            await mockDataService.removeSentLog(msg.email, msg.nextBirthday, msg.name)
            calculateUpcomingSchedule()
            toast({ title: "Marked Unsent", description: `Status reset for ${msg.name}`, variant: "info" })
        })
    }

    const sendScheduledMail = async (msg, isAuto = false) => {
        if (msg.isSent) return

        try {
            if (!isAuto) setIsSending(true)

            const success = await mockDataService.mockSendEmail(msg.email, msg.subject, msg.body)
            if (success) {
                await mockDataService.logEmailSent(msg.email, msg.nextBirthday, 'birthday', msg.subject, 'sent', msg.name)
                if (!isAuto) toast({ title: "Sent", description: `Sent birthday wish to ${msg.name}!`, variant: "success" })
                calculateUpcomingSchedule()
                // Update logs
                const newLogs = await mockDataService.getSentLogs()
                setSentLogs(newLogs)
            }

        } catch (error) {
            console.error("Send failed:", error)
            if (!isAuto) toast({ title: "Send Failed", description: "Failed to send email.", variant: "destructive" })
        } finally {
            if (!isAuto) {
                setIsSending(false)
            }
        }
    }

    const sendBulkMail = async () => {
        if (bulkRecipients.length === 0) { toast({ title: "Error", description: "Upload recipients first.", variant: "destructive" }); return }
        if (!composeSubject || !composeBody) { toast({ title: "Error", description: "Enter subject and body.", variant: "destructive" }); return }

        showAlert("Send Bulk Mail?", `Ready to send emails to ${bulkRecipients.length} recipients?`, async () => {
            setIsSending(true)
            try {
                for (const r of bulkRecipients) {
                    const body = composeBody.replace('{name}', r.name || 'Friend')
                    const success = await mockDataService.mockSendEmail(r.email, composeSubject, body)
                    await mockDataService.logEmailSent(r.email, new Date().toISOString().split('T')[0], 'bulk', composeSubject, success ? 'sent' : 'failed', r.name)
                }
                const newLogs = await mockDataService.getSentLogs()
                setSentLogs(newLogs)
                toast({ title: "Success", description: "Bulk mail processed!", variant: "success" })
            } catch (error) {
                toast({ title: "Error", description: "Failed to send bulk emails.", variant: "destructive" })
            } finally {
                setIsSending(false)
            }
        })
    }

    const handleSaveConfig = () => {
        mockDataService.saveClubConfig(config)
        setIsConfigEditing(false)
        toast({ title: "Saved", description: "Configuration Saved Successfully!", variant: "success" })
    }

    const handleTestConnection = async () => {
        if (!config.apps_script_url) { toast({ title: "Missing URL", description: "Please save a URL first.", variant: "destructive" }); return }
        setIsSending(true)
        try {
            await mockDataService.sendEmail(config.email || 'test@example.com', 'Test Connection', 'This is a test email to verify configuration.')
            toast({ title: "Success", description: "Test Successful! Server responded with 200 OK.", variant: "success" })
        } catch (e) {
            toast({ title: "Test Failed", description: e.message, variant: "destructive" })
        } finally {
            setIsSending(false)
        }
    }

    const handleClearHistory = async () => {
        showAlert("Clear History?", "Are you sure you want to clear ALL send history? This cannot be undone.", async () => {
            await mockDataService.clearSentLogs()
            setSentLogs([])
            toast({ title: "Cleared", description: "History cleared.", variant: "default" })
        })
    }

    return (
        <div style={{ background: 'white', padding: '2rem', borderRadius: '20px', minHeight: '80vh' }}>
            <h2 style={{ color: 'var(--primary-magenta)', marginBottom: '1.5rem' }}>Email Scheduler & Manager</h2>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid #eee' }}>
                <button onClick={() => setActiveTab('birthday')} style={activeTab === 'birthday' ? activeTabStyle : tabStyle}>Birthday Scheduler</button>
                <button onClick={() => setActiveTab('compose')} style={activeTab === 'compose' ? activeTabStyle : tabStyle}>General Mail</button>
                <button onClick={() => setActiveTab('history')} style={activeTab === 'history' ? activeTabStyle : tabStyle}>History</button>
                <button onClick={() => setActiveTab('settings')} style={activeTab === 'settings' ? activeTabStyle : tabStyle}>Configuration</button>
            </div>

            {activeTab === 'birthday' && (
                <div>
                    {!editingSchedule ? (
                        <>
                            {/* CARDS */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                                <UploadCard title="Presidents" count={contacts?.presidents?.length || 0} onUpload={(e) => handleFileUpload(e, 'presidents')} onView={() => handleViewList('presidents')} color="#e3f2fd" />
                                <UploadCard title="Secretaries" count={contacts?.secretaries?.length || 0} onUpload={(e) => handleFileUpload(e, 'secretaries')} onView={() => handleViewList('secretaries')} color="#f3e5f5" />
                                <UploadCard title="Council" count={contacts?.council?.length || 0} onUpload={(e) => handleFileUpload(e, 'council')} onView={() => handleViewList('council')} color="#fff3e0" />
                                <div style={{ padding: '1.5rem', background: '#f8f9fa', borderRadius: '15px', border: '1px solid #eee' }}>
                                    <h4 style={{ margin: '0 0 0.5rem 0' }}>Internal Members</h4>
                                    <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: 'var(--primary-magenta)' }}>{members?.length || 0}</p>
                                </div>
                            </div>

                            {/* TABLE */}
                            <h3 style={{ marginBottom: '1rem' }}>Upcoming (30 Days)</h3>
                            <div style={{ overflowX: 'auto', background: 'white', border: '1px solid #eee', borderRadius: '10px' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ background: '#f8f9fa', textAlign: 'left' }}>
                                            <th style={thStyle}>Date</th>
                                            <th style={thStyle}>Name</th>
                                            <th style={thStyle}>Category</th>
                                            <th style={thStyle}>Status</th>
                                            <th style={thStyle}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {upcomingMessages.length === 0 ? (
                                            <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>No upcoming birthdays found.</td></tr>
                                        ) : (
                                            upcomingMessages.map((msg, idx) => (
                                                <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                                                    <td style={tdStyle}>
                                                        <strong>{msg.nextBirthday}</strong><br />
                                                        <small style={{ color: msg.daysAway === 0 ? 'green' : '#666' }}>{msg.daysAway === 0 ? 'TODAY' : `${msg.daysAway} days`}</small>
                                                    </td>
                                                    <td style={tdStyle}>{msg.name}<br /><small>{msg.email}</small></td>
                                                    <td style={tdStyle}>{msg.category}</td>
                                                    <td style={tdStyle}>
                                                        {msg.isSent ? <span style={{ color: 'green' }}>✅ Sent</span> : (msg.isOverride ? <span style={{ color: 'blue' }}>Modified</span> : 'Pending')}
                                                    </td>
                                                    <td style={tdStyle}>
                                                        {!msg.isSent && (
                                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                                <button onClick={() => handleEditSchedule(msg)} style={actionBtn}>Edit</button>
                                                                {msg.daysAway === 0 && <button onClick={() => sendScheduledMail(msg)} style={{ ...actionBtn, background: 'green', color: 'white' }}>Send</button>}
                                                            </div>
                                                        )}
                                                        {msg.isSent && (
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                                <small style={{ color: 'green' }}>Completed</small>
                                                                <button onClick={() => handleMarkUnsent(msg)} style={{ ...actionBtn, color: 'orange', borderColor: 'orange', padding: '0.2rem 0.5rem', fontSize: '0.7rem' }}>Reset</button>
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    ) : (
                        // EDIT FORM
                        <div style={{ background: '#f8f9fa', padding: '2rem', borderRadius: '15px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <h3>Customize Message</h3>
                                <button onClick={() => setEditingSchedule(null)}>Cancel</button>
                            </div>
                            <input value={editSubject} onChange={e => setEditSubject(e.target.value)} style={{ ...inputStyle, marginBottom: '1rem' }} placeholder="Subject" />
                            <div style={{ height: '300px', marginBottom: '3rem' }}>
                                <ReactQuill theme="snow" value={editBody} onChange={setEditBody} style={{ height: '250px' }} />
                            </div>
                            <button onClick={handleSaveScheduleOverride} style={primaryBtn}>Save Changes</button>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'compose' && (
                <div>
                    <h3>Send Bulk Email</h3>
                    <input type="file" accept=".xlsx" onChange={(e) => handleFileUpload(e, 'bulk')} style={{ marginBottom: '1rem' }} />
                    {bulkRecipients.length > 0 && <p>{bulkRecipients.length} recipients loaded.</p>}
                    <input value={composeSubject} onChange={e => setComposeSubject(e.target.value)} style={{ ...inputStyle, marginBottom: '1rem' }} placeholder="Subject" />
                    <div style={{ height: '300px', marginBottom: '3rem' }}>
                        <ReactQuill theme="snow" value={composeBody} onChange={setComposeBody} style={{ height: '250px' }} />
                    </div>
                    <button onClick={sendBulkMail} disabled={isSending} style={primaryBtn}>{isSending ? 'Sending...' : 'Send All'}</button>
                </div>
            )}

            {activeTab === 'settings' && (
                <div style={{ maxWidth: '600px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3>Email Configuration</h3>
                        {!isConfigEditing && <button onClick={() => setIsConfigEditing(true)} style={actionBtn}>Edit Configuration</button>}
                    </div>

                    {!isConfigEditing ? (
                        <div style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '10px' }}>
                            <p><strong>Sender Name:</strong> {config.name || '(Not Set)'}</p>
                            <p><strong>Sender Email:</strong> {config.email || '(Not Set)'}</p>
                            <p><strong>Web App URL:</strong> {config.apps_script_url ? '●●●●●●●●●●●●●●●●' : '(Not Configured)'}</p>
                            <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                                <button onClick={handleTestConnection} style={{ ...primaryBtn, background: '#17a2b8' }} disabled={isSending}>
                                    {isSending ? 'Testing...' : 'Test Connection'}
                                </button>
                            </div>
                            <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '1rem' }}>Use the "Edit" button to change these details.</p>
                        </div>
                    ) : (
                        <div style={{ background: '#fff', border: '1px solid #ddd', padding: '1.5rem', borderRadius: '10px' }}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={labelStyle}>Sender Name</label>
                                <input value={config.name || ''} onChange={e => setConfig({ ...config, name: e.target.value })} style={inputStyle} />
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={labelStyle}>Sender Email</label>
                                <input value={config.email || ''} onChange={e => setConfig({ ...config, email: e.target.value })} style={inputStyle} />
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={labelStyle}>Web App URL (Google Apps Script)</label>
                                <input value={config.apps_script_url || ''} onChange={e => setConfig({ ...config, apps_script_url: e.target.value })} style={inputStyle} placeholder="https://script.google.com/..." />
                            </div>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button onClick={handleSaveConfig} style={primaryBtn}>Save & Close</button>
                                <button onClick={() => setIsConfigEditing(false)} style={{ ...primaryBtn, background: '#6c757d' }}>Cancel</button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'history' && (
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3>Sent Email History</h3>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button onClick={loadData} style={actionBtn}>Refresh</button>
                            <button onClick={handleClearHistory} style={{ ...actionBtn, color: 'red', borderColor: 'red' }}>Clear History</button>
                        </div>
                    </div>
                    <div style={{ overflowX: 'auto', background: 'white', border: '1px solid #eee', borderRadius: '10px' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: '#f8f9fa', textAlign: 'left' }}>
                                    <th style={thStyle}>Date & Time</th>
                                    <th style={thStyle}>Recipient</th>
                                    <th style={thStyle}>Subject</th>
                                    <th style={thStyle}>Type</th>
                                    <th style={thStyle}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sentLogs.length === 0 ? (
                                    <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>No logs found.</td></tr>
                                ) : (
                                    [...sentLogs].sort((a, b) => new Date(b.timestamp || b.date) - new Date(a.timestamp || a.date)).map((log, idx) => (
                                        <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                                            <td style={tdStyle}>
                                                {log.timestamp ? new Date(log.timestamp).toLocaleString() : log.date}
                                            </td>
                                            <td style={tdStyle}>{log.email}</td>
                                            <td style={tdStyle}>{log.subject || '-'}</td>
                                            <td style={tdStyle}><span style={{ padding: '2px 8px', borderRadius: '10px', background: log.type === 'birthday' ? '#e3f2fd' : '#f3e5f5', fontSize: '0.8rem' }}>{log.type}</span></td>
                                            <td style={tdStyle}>{log.status === 'sent' ? <span style={{ color: 'green' }}>✔ Sent</span> : <span style={{ color: 'red' }}>✖ Failed</span>}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {viewDataCategory && contacts && contacts[viewDataCategory] && (
                <ViewDataModal
                    category={viewDataCategory}
                    data={contacts[viewDataCategory]}
                    onClose={() => setViewDataCategory(null)}
                    onSave={(newData) => handleSaveDataList(viewDataCategory, newData)}
                    showAlert={showAlert} // Pass helper
                />
            )}

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

export default EmailManager
