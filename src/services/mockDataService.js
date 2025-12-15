// Mock Data Service to simulate Firebase Firestore and Auth
// Uses IndexedDB to persist data (Async)

const EVENTS_KEY = 'rotaract_events'
const BULLETINS_KEY = 'rotaract_bulletins'
const SCRAPBOOKS_KEY = 'rotaract_scrapbooks'
const GALLERY_KEY = 'rotaract_gallery'
const SUPPORT_KEY = 'rotaract_support'
const JOIN_REQUESTS_KEY = 'rotaract_join_requests'
const USER_KEY = 'rotaract_user'
const REPORTS_KEY = 'rotaract_reports'
const BIRTHDAY_CONTACTS_KEY = 'rotaract_birthday_contacts'
const SCHEDULED_OVERRIDES_KEY = 'scheduled_overrides'
const CLUB_CONFIG_KEY = 'club_config'
const SENT_LOGS_KEY = 'sent_logs_v2' //v2 for new structure
const EMAIL_TEMPLATES_KEY = 'email_templates'
const CLUB_RESOURCES_KEY = 'club_resources' // New key for resources
const BOARD_MEMBERS_KEY = 'board_members' // New key for board members

// Mock Club Configuration (For simulation)
const DEFAULT_CLUB_CONFIG = {
    email: 'raccoimbatoreunique@gmail.com',
    name: 'Rotaract Club of Coimbatore Unique'
}


// Initial dummy data
const INITIAL_JOIN_REQUESTS = [
    {
        id: '1',
        fullName: 'Jane Doe',
        dob: '2000-05-15',
        age: '23',
        gender: 'Female',
        email: 'jane@example.com',
        phone: '9876543210',
        location: 'Coimbatore',
        profession: 'Student',
        otherNGO: 'No',
        reason: 'To serve the community',
        source: 'Social Media',
        date: '2023-12-02'
    }
]

const INITIAL_SUPPORT = [
    {
        id: '1',
        fullName: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        profession: 'Student',
        location: 'Coimbatore',
        purpose: 'Join the organisation',
        message: 'I would like to join Rotaract.',
        date: '2023-12-01'
    }
]
const INITIAL_GALLERY = [
    {
        id: '1',
        eventName: 'Installation Ceremony',
        image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        orientation: 'landscape'
    },
    {
        id: '2',
        eventName: 'Tree Plantation',
        image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb7d5763?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        orientation: 'portrait'
    },
    {
        id: '3',
        eventName: 'Blood Donation Camp',
        image: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        orientation: 'portrait'
    },
    {
        id: '4',
        eventName: 'School Visit',
        image: 'https://images.unsplash.com/photo-1427504494785-3a9ca28497b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        orientation: 'landscape'
    },
    {
        id: '5',
        eventName: 'Charity Run',
        image: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        orientation: 'portrait'
    }
]
const INITIAL_EVENTS = [
    {
        id: '1',
        title: "Community Health Camp",
        description: "Free health checkup and medical consultation for underprivileged communities",
        date: "2023-12-15",
        category: "Healthcare",
        poster: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        images: [
            "https://images.unsplash.com/photo-1579684385760-d977b39abd87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1584515933487-9bdbb0043bf3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        ]
    },
    {
        id: '2',
        title: "Environmental Cleanup Drive",
        description: "Join us in cleaning our local parks and planting trees for a greener tomorrow",
        date: "2023-12-22",
        category: "Environment",
        poster: "https://images.unsplash.com/photo-1562684759-f5291d656797?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        images: [
            "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        ]
    },
    {
        id: '3',
        title: "Education Support Program",
        description: "Providing school supplies and mentorship to students from low-income families",
        date: "2024-01-05",
        category: "Education",
        poster: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        images: []
    }
]

const INITIAL_BULLETINS = [
    {
        id: '1',
        title: "The Rotaractor - Vol 1",
        month: "July 2023",
        poster: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        pdfUrl: "https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf" // Sample PDF
    },
    {
        id: '2',
        title: "The Rotaractor - Vol 2",
        month: "August 2023",
        poster: "https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        pdfUrl: "https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf"
    }
]

const INITIAL_SCRAPBOOKS = [
    {
        id: '1',
        title: "Installation Ceremony 2023",
        date: "July 2023",
        poster: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        pdfUrl: "https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf" // Sample PDF
    }
]

const INITIAL_USERS = [
    {
        id: 'admin_user',
        username: 'admin',
        password: 'admin', // Fixed password to match UI hint
        role: 'admin',
        status: 'active',
        isLocked: false,
        profile: {
            fullName: 'Admin User',
            designation: 'Administrator',
            email: 'admin@rotaract.com',
            phone: '9876543210',
            dob: '2000-01-01',
            bloodGroup: 'O+',
            address: 'Coimbatore, India',
            joiningDate: '2023-01-01'
        }
    },
    {
        id: 'member_user',
        username: 'member',
        password: 'member',
        role: 'member', // Note: role logic in login might check strict 'member'/'admin'
        status: 'active', // Ensure active
        isLocked: false,
        profile: {
            fullName: 'Rotaract Member',
            designation: 'Member',
            email: 'member@rotaract.com',
            phone: '1234567890',
            dob: '2001-01-01',
            bloodGroup: 'A+',
            address: 'Coimbatore, India',
            joiningDate: '2023-02-01'
        }
    }
]

const INITIAL_BOARD_MEMBERS = [
    {
        id: '1',
        name: 'John Alpha',
        role: 'President',
        message: 'Leading with vision and purpose.',
        image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
        id: '2',
        name: 'Jane Beta',
        role: 'Secretary',
        message: 'Ensuring smooth operations.',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
        id: '3',
        name: 'Robert Gamma',
        role: 'Treasurer',
        message: 'Managing resources effectively.',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    }
]


// --- INDEXEDDB IMPLEMENTATION ---

const DB_NAME = 'RotaractClubDB'
const DB_VERSION = 3 // Increment version to trigger upgrade
const STORE_NAMES = [
    EVENTS_KEY, BULLETINS_KEY, SCRAPBOOKS_KEY, GALLERY_KEY, SUPPORT_KEY,
    JOIN_REQUESTS_KEY, USER_KEY, REPORTS_KEY, BIRTHDAY_CONTACTS_KEY,
    EMAIL_TEMPLATES_KEY, CLUB_CONFIG_KEY, SENT_LOGS_KEY, SCHEDULED_OVERRIDES_KEY,
    CLUB_RESOURCES_KEY, BOARD_MEMBERS_KEY // Add new store
]

const openDB = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION)

        request.onupgradeneeded = (event) => {
            const db = event.target.result
            STORE_NAMES.forEach(storeName => {
                if (!db.objectStoreNames.contains(storeName)) {
                    db.createObjectStore(storeName, { keyPath: 'id' })
                }
            })
        }

        request.onsuccess = (event) => {
            resolve(event.target.result)
        }

        request.onerror = (event) => {
            reject(`IndexedDB error: ${event.target.errorCode}`)
        }
    })
}

// Internal Helpers
const getAll = async (storeName) => {
    const db = await openDB()
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readonly')
        const store = transaction.objectStore(storeName)
        const request = store.getAll()
        request.onsuccess = () => resolve(request.result || [])
        request.onerror = () => reject(request.error)
    })
}

const add = async (storeName, item) => {
    const db = await openDB()
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readwrite')
        const store = transaction.objectStore(storeName)
        const request = store.add({ ...item, id: item.id || Date.now().toString() })
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
    })
}

const update = async (storeName, id, updates) => {
    const db = await openDB()
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readwrite')
        const store = transaction.objectStore(storeName)
        const getRequest = store.get(id)

        getRequest.onsuccess = () => {
            const item = getRequest.result
            if (!item) { reject('Item not found'); return }
            const updatedItem = { ...item, ...updates }
            const putRequest = store.put(updatedItem)
            putRequest.onsuccess = () => resolve(updatedItem)
            putRequest.onerror = () => reject(putRequest.error)
        }
        getRequest.onerror = () => reject(getRequest.error)
    })
}

const remove = async (storeName, id) => {
    const db = await openDB()
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readwrite')
        const store = transaction.objectStore(storeName)
        const request = store.delete(id)
        request.onsuccess = () => resolve()
        request.onerror = () => reject(request.error)
    })
}

// Cleanup Legacy Data & Seed
const initData = async () => {
    // We don't necessarily clear legacy data, but we seed if DB is empty.
    const events = await getAll(EVENTS_KEY)
    if (events.length === 0) {
        for (const item of INITIAL_EVENTS) await add(EVENTS_KEY, item)
    }
    const gallery = await getAll(GALLERY_KEY)
    if (gallery.length === 0) {
        for (const item of INITIAL_GALLERY) await add(GALLERY_KEY, item)
    }
    const users = await getAll(USER_KEY)
    if (users.length === 0) {
        for (const item of INITIAL_USER) await add(USER_KEY, item)
    }
    const bulletins = await getAll(BULLETINS_KEY)
    if (bulletins.length === 0) {
        for (const item of INITIAL_BULLETINS) await add(BULLETINS_KEY, item)
    }
    const scrapbooks = await getAll(SCRAPBOOKS_KEY)
    if (scrapbooks.length === 0) {
        for (const item of INITIAL_SCRAPBOOKS) await add(SCRAPBOOKS_KEY, item)
    }
}
initData().catch(console.error)


// EXPORTED SERVICE
export const mockDataService = {
    // EVENTS
    getEvents: () => getAll(EVENTS_KEY),
    addEvent: (event) => add(EVENTS_KEY, event),
    deleteEvent: (id) => remove(EVENTS_KEY, id),
    updateEvent: (id, updates) => update(EVENTS_KEY, id, updates),

    // BULLETINS
    getBulletins: () => getAll(BULLETINS_KEY),
    addBulletin: (bulletin) => add(BULLETINS_KEY, bulletin),
    deleteBulletin: (id) => remove(BULLETINS_KEY, id),
    updateBulletin: (id, updates) => update(BULLETINS_KEY, id, updates),

    // SCRAPBOOKS
    getScrapbooks: () => getAll(SCRAPBOOKS_KEY),
    addScrapbook: (item) => add(SCRAPBOOKS_KEY, item),
    deleteScrapbook: (id) => remove(SCRAPBOOKS_KEY, id),
    updateScrapbook: (id, updates) => update(SCRAPBOOKS_KEY, id, updates),

    // GALLERY
    getGallery: () => getAll(GALLERY_KEY),
    addGalleryItem: (item) => add(GALLERY_KEY, item),
    deleteGalleryItem: (id) => remove(GALLERY_KEY, id),
    updateGalleryItem: (id, updates) => update(GALLERY_KEY, id, updates),

    // SUPPORT
    getSupportMessages: () => getAll(SUPPORT_KEY),
    addSupportMessage: (msg) => add(SUPPORT_KEY, msg),
    deleteSupportMessage: (id) => remove(SUPPORT_KEY, id),

    // JOIN REQUESTS
    getJoinRequests: () => getAll(JOIN_REQUESTS_KEY),
    addJoinRequest: (req) => add(JOIN_REQUESTS_KEY, req),
    deleteJoinRequest: (id) => remove(JOIN_REQUESTS_KEY, id),
    updateJoinRequest: (id, updates) => update(JOIN_REQUESTS_KEY, id, updates),

    // REPORTS
    getReports: () => getAll(REPORTS_KEY),
    addReport: (report) => add(REPORTS_KEY, report),
    deleteReport: (id) => remove(REPORTS_KEY, id),
    updateReport: (id, updates) => update(REPORTS_KEY, id, updates),

    // AUTH / USER
    getUsers: () => getAll(USER_KEY),
    addUser: async (username, password, memberId) => {
        const users = await getAll(USER_KEY)
        if (users.find(u => u.username === username)) throw new Error("User already exists")

        // Use provided memberId, or 'Pending' if not provided (though AdminDashboard now generates it)
        const finalMemberId = memberId || 'Pending'

        return add(USER_KEY, {
            username, password, role: 'member', status: 'active', isLocked: false,
            memberId: finalMemberId,
            isFirstLogin: true,
            profile: {
                fullName: username, designation: 'Member', email: '', phone: '',
                dob: '', bloodGroup: '', address: '', joiningDate: new Date().toISOString().split('T')[0]
            }
        })
    },
    deleteUser: (id) => remove(USER_KEY, id),
    updateUser: async (id, updates) => {
        if (updates.username) {
            const users = await getAll(USER_KEY)
            const existing = users.find(u => u.username === updates.username && u.id !== id)
            if (existing) throw new Error("Username already taken by another user")
        }
        return update(USER_KEY, id, updates)
    },

    login: async (username, password, role) => {
        let users = await getAll(USER_KEY)
        console.log("DEBUG LOGIN: Attempting login for:", username, "Role:", role);

        // Smarter Auto-seed: check if defaults exist.
        // If 'admin' or 'member' is missing, re-add them.
        const seedNeeded = !users.some(u => u.username === 'admin') || !users.some(u => u.username === 'member')

        // AUTO-FIX: If admin exists but password is wrong (e.g. legacy data), update it? 
        // Or just ensure 'admin' exists. 
        // Let's force update the admin user to ensure known credentials if it exists but is broken.
        const existingAdmin = users.find(u => u.username === 'admin');
        if (existingAdmin && existingAdmin.password !== 'admin') {
            console.log("Fixing corrupted admin user...");
            await update(USER_KEY, existingAdmin.id, { password: 'admin', role: 'admin', status: 'active' });
        }

        if (seedNeeded) {
            console.log("Seeding missing default users...")
            for (const u of INITIAL_USERS) {
                if (!users.some(existing => existing.username === u.username)) {
                    await add(USER_KEY, u)
                }
            }
            users = await getAll(USER_KEY)
        }

        const user = users.find(u => (u.username === username || u.memberId === username) && u.password === password)

        if (user) {
            console.log("DEBUG LOGIN: User credentials matched:", user);
            if (role && user.role !== role) {
                console.error(`DEBUG LOGIN: Role mismatch. Expected ${role}, got ${user.role}`);
                throw new Error("Invalid Role Access")
            }
            if (user.status === 'deactive') throw new Error("Account Deactivated")
            if (user.isLocked) throw new Error("Account Locked")
            sessionStorage.setItem('rotaract_session_user', JSON.stringify(user))
            return user
        }
        console.error("DEBUG LOGIN: No matching user found for:", username, password);
        console.log("DEBUG LOGIN: Available users:", users.map(u => ({ u: u.username, p: u.password, r: u.role })));
        throw new Error("Invalid Credentials")
    },

    logout: () => {
        sessionStorage.removeItem('rotaract_session_user')
    },

    getCurrentUser: () => {
        const userStr = sessionStorage.getItem('rotaract_session_user')
        return userStr ? JSON.parse(userStr) : null
    },

    // TEMPLATES
    // TEMPLATES
    getEmailTemplates: async () => {
        const templates = await getAll(EMAIL_TEMPLATES_KEY)
        if (templates.length === 0) {
            // Updated to HTML for Rich Text support
            const commonTemplate = {
                subject: 'Happy Birthday!',
                body: '<p>Dear <strong>{name}</strong>,</p><p>Wishing you a very <strong>Happy Birthday</strong>! Have a fantastic year ahead.</p><p><br></p><p>Best Regards,</p><p><em>Rotaract Club</em></p>'
            }

            // User requested common template for all
            const defaults = [
                { role: 'president', ...commonTemplate },
                { role: 'secretary', ...commonTemplate },
                { role: 'council', ...commonTemplate },
                { role: 'member', ...commonTemplate }
            ]
            return defaults
        }
        return templates
    },
    addEmailTemplate: (t) => add(EMAIL_TEMPLATES_KEY, t),
    updateEmailTemplate: (id, u) => update(EMAIL_TEMPLATES_KEY, id, u),
    deleteEmailTemplate: (id) => remove(EMAIL_TEMPLATES_KEY, id),

    // BIRTHDAY CONTACTS
    getBirthdayContacts: async () => {
        // Return structured object. IDB returns array.
        // For simplicity, we can store a SINGLE object with ID 'contacts' in this store.
        const db = await openDB()
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([BIRTHDAY_CONTACTS_KEY], 'readonly')
            const store = transaction.objectStore(BIRTHDAY_CONTACTS_KEY)
            const request = store.get('contacts')
            request.onsuccess = () => {
                resolve(request.result || { id: 'contacts', presidents: [], secretaries: [], council: [] })
            }
            request.onerror = () => reject(request.error)
        })
    },

    saveBirthdayContacts: async (contactsObj) => {
        const db = await openDB()
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([BIRTHDAY_CONTACTS_KEY], 'readwrite')
            const store = transaction.objectStore(BIRTHDAY_CONTACTS_KEY)
            const item = { ...contactsObj, id: 'contacts' }
            const request = store.put(item)
            request.onsuccess = () => resolve()
            request.onerror = () => reject(request.error)
        })
    },

    // CLUB CONFIG
    getClubConfig: async () => {
        const db = await openDB()
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([CLUB_CONFIG_KEY], 'readonly')
            const store = transaction.objectStore(CLUB_CONFIG_KEY)
            const request = store.get('config')
            request.onsuccess = () => {
                resolve(request.result || { ...DEFAULT_CLUB_CONFIG, id: 'config', apps_script_url: '' })
            }
            request.onerror = () => reject(request.error)
        })
    },

    saveClubConfig: async (config) => {
        const db = await openDB()
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([CLUB_CONFIG_KEY], 'readwrite')
            const store = transaction.objectStore(CLUB_CONFIG_KEY)
            const item = { ...config, id: 'config' }
            const request = store.put(item)
            request.onsuccess = () => resolve()
            request.onerror = () => reject(request.error)
        })
    },

    // EMAIL SERVICE
    sendEmail: async (to, subject, body) => {
        console.log(`[EMAIL SERVICE] Initiating send to ${to}...`)
        try {
            // 1. Validate Payload
            if (!to || !to.includes('@')) {
                console.error("[EMAIL SERVICE] Invalid recipient:", to)
                alert("Error: Invalid Email Address")
                return false
            }
            if (!body || body.trim() === '') {
                console.error("[EMAIL SERVICE] Empty body")
                alert("Error: Email body is empty")
                return false
            }

            // 2. Get Config
            const config = await mockDataService.getClubConfig()
            if (!config || !config.apps_script_url) {
                console.warn("[EMAIL SERVICE] No App Script URL configured.")
                alert("Error: Email Configuration missing (Web App URL). check Settings.")
                return false
            }

            const payload = {
                to: to,
                subject: subject,
                body: body,
                name: config.name || 'Rotaract Club'
            }
            console.log("[EMAIL SERVICE] Sending Payload:", payload)

            // 3. Send Request
            const response = await fetch(config.apps_script_url, {
                method: 'POST',
                mode: 'cors', // Changed from no-cors to cors to get actual response
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8',
                },
                body: JSON.stringify(payload)
            })

            if (!response.ok) {
                throw new Error(`Server responded with ${response.status}: ${response.statusText}`)
            }

            const result = await response.text()
            console.log(`[EMAIL SERVICE] Success:`, result)
            return true

        } catch (error) {
            console.error("[EMAIL SERVICE] Failed to send:", error)
            alert(`Email Failed: ${error.message}`)
            return false
        }
    },
    mockSendEmail: async (to, subject, body) => {
        return await mockDataService.sendEmail(to, subject, body)
    },

    // SENT LOGS
    getSentLogs: () => getAll(SENT_LOGS_KEY),
    // Updated signature to include Name for uniqueness
    logEmailSent: (email, date, type, subject = '', status = 'sent', name = '') => add(SENT_LOGS_KEY, { email, date, type, subject, status, name, timestamp: new Date().toISOString() }),

    removeSentLog: async (email, date, name) => {
        const logs = await getAll(SENT_LOGS_KEY)
        // Match by Email AND Date AND Name (if provided)
        // If name is not provided (legacy logs), we might fall back to just email/date, but for now strict matching is better to fix the bug.
        const toRemove = logs.filter(l => l.email === email && l.date === date && (name ? l.name === name : true))

        const db = await openDB()
        return new Promise((resolve, reject) => {
            const tx = db.transaction([SENT_LOGS_KEY], 'readwrite')
            const store = tx.objectStore(SENT_LOGS_KEY)
            toRemove.forEach(item => store.delete(item.id))
            tx.oncomplete = () => resolve()
            tx.onerror = () => reject(tx.error)
        })
    },
    // Fix: getAll returns array of items. removeSentLog implementation looked suspicious (it used 'store.put' on an array which violates IDB if keypath is id).
    // Let's implement correctly: data in SENT_LOGS_KEY are individual items with logicless IDs?
    // Actually, looking at 'add', it adds items. So 'getAll' returns list of items.
    // 'removeSentLog' looked broken in previous code (it referenced `store` which wasn't defined).
    // Let's implement clearSentLogs correctly.

    clearSentLogs: async () => {
        const db = await openDB()
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([SENT_LOGS_KEY], 'readwrite')
            const store = transaction.objectStore(SENT_LOGS_KEY)
            const request = store.clear()
            request.onsuccess = () => resolve()
            request.onerror = () => reject(request.error)
        })
    },

    // SCHEDULE OVERRIDES
    // SCHEDULE OVERRIDES
    getScheduledOverride: async (email, date, name) => {
        const overrides = await getAll(SCHEDULED_OVERRIDES_KEY)
        // Fix: content contamination. Match by Name as well.
        return overrides.find(o => o.email === email && o.date === date && (name ? o.name === name : true))
    },
    saveScheduledOverride: async (email, date, subject, body, name) => {
        // Simple implementation: delete old if exists, add new
        const overrides = await getAll(SCHEDULED_OVERRIDES_KEY)
        const existing = overrides.find(o => o.email === email && o.date === date && (name ? o.name === name : true))
        if (existing) await remove(SCHEDULED_OVERRIDES_KEY, existing.id)
        return add(SCHEDULED_OVERRIDES_KEY, { email, date, subject, body, name })
    },

    // RESOURCES
    getResources: () => getAll(CLUB_RESOURCES_KEY),
    addResource: (resource) => add(CLUB_RESOURCES_KEY, { ...resource, date: new Date().toISOString() }),
    deleteResource: (id) => remove(CLUB_RESOURCES_KEY, id),
    updateResource: (id, data) => update(CLUB_RESOURCES_KEY, { ...data, id }),

    // BOARD MEMBERS
    getBoardMembers: () => getAll(BOARD_MEMBERS_KEY),
    addBoardMember: (member) => add(BOARD_MEMBERS_KEY, member),
    deleteBoardMember: (id) => remove(BOARD_MEMBERS_KEY, id),
    updateBoardMember: (id, updates) => update(BOARD_MEMBERS_KEY, id, updates),

    // METADATA (For ID Generation)
    getMetadata: async () => {
        const db = await openDB()
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([CLUB_CONFIG_KEY], 'readonly')
            const store = transaction.objectStore(CLUB_CONFIG_KEY) // Reuse config store for metadata
            const request = store.get('metadata')
            request.onsuccess = () => resolve(request.result || { id: 'metadata', lastMemberIdSequence: 0 })
            request.onerror = () => reject(request.error)
        })
    },

    generateMemberId: async () => {
        const db = await openDB()
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([CLUB_CONFIG_KEY], 'readwrite')
            const store = transaction.objectStore(CLUB_CONFIG_KEY)
            const request = store.get('metadata')

            request.onsuccess = () => {
                let metadata = request.result || { id: 'metadata', lastMemberIdSequence: 0 }
                metadata.lastMemberIdSequence += 1

                // Format: 50295 + 3 digit sequence (e.g. 50295001)
                const sequenceStr = metadata.lastMemberIdSequence.toString().padStart(3, '0')
                const newId = `50295${sequenceStr}`

                const putRequest = store.put(metadata)
                putRequest.onsuccess = () => resolve(newId)
                putRequest.onerror = () => reject(putRequest.error)
            }
            request.onerror = () => reject(request.error)
        })
    },

    getStorageInfo: async () => {
        if (navigator.storage && navigator.storage.estimate) {
            const estimate = await navigator.storage.estimate()
            return (estimate.usage / 1024 / 1024).toFixed(2)
        }
        return "Unknown"
    },

    clearAllData: async () => {
        return new Promise((resolve, reject) => {
            const req = indexedDB.deleteDatabase(DB_NAME)
            req.onsuccess = () => {
                sessionStorage.clear()
                window.location.reload()
                resolve()
            }
            req.onerror = () => reject("Failed to delete DB")
            req.onblocked = () => window.location.reload()
        })
    },

    // Password Change
    changePassword: async (userId, newPassword) => {
        return update(USER_KEY, userId, { password: newPassword })
    }
}
