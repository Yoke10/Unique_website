import React, { useState } from 'react'
import { mockDataService } from '../../services/mockDataService'
import { useToast } from '../ui/Toast/ToastContext'

// Component defined OUTSIDE to prevent re-mounting on every render
const InfoRow = ({ label, value, field, isEditing, formData, onChange }) => (
    <div style={{ marginBottom: '1rem', borderBottom: '1px solid #f0f0f0', paddingBottom: '0.5rem' }}>
        <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '0.2rem' }}>{label}</div>
        {isEditing ? (
            <input
                name={field}
                value={formData[field] || ''}
                onChange={onChange}
                style={inputStyle}
            />
        ) : (
            <div style={{ fontWeight: '500', color: '#333' }}>{value || '-'}</div>
        )}
    </div>
)

const MemberProfile = ({ user, onUpdate }) => {
    const { toast } = useToast()
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState(user.profile)
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSave = async () => {
        setLoading(true)
        try {
            const updatedUser = mockDataService.updateUser(user.id, { profile: formData })
            onUpdate(updatedUser)
            toast({ title: "Profile Updated", description: "Your details have been saved.", variant: "success" })
            setIsEditing(false)
        } catch (err) {
            console.error(err)
            toast({ title: "Update Failed", description: "Failed to update profile.", variant: "destructive" })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ maxWidth: '1000px', margin: '2rem auto', display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem' }}>
            {/* Sidebar Card */}
            <div style={{ background: 'white', padding: '2rem', borderRadius: '15px', height: 'fit-content', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <div style={{ width: '100px', height: '100px', background: 'var(--primary-magenta)', borderRadius: '50%', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '2.5rem', fontWeight: 'bold' }}>
                    {user.profile.fullName ? user.profile.fullName.charAt(0) : 'U'}
                </div>
                <h2 style={{ margin: '0.5rem 0', color: '#333' }}>{user.profile.fullName}</h2>
                <div style={{ color: 'var(--primary-pink)', fontWeight: '600', marginBottom: '1.5rem' }}>{user.memberId}</div>

                <div style={{ textAlign: 'left', background: '#f9f9f9', padding: '1rem', borderRadius: '10px' }}>
                    <div style={{ marginBottom: '0.5rem' }}><strong>Status:</strong> <span style={{ color: 'green' }}>Active</span></div>
                    <div style={{ marginBottom: '0.5rem' }}><strong>Joined:</strong> 2023</div>
                </div>
            </div>

            {/* Main Content */}
            <div style={{ background: 'white', padding: '2rem', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
                    <h2 style={{ color: 'var(--primary-magenta)', margin: 0 }}>My Profile</h2>
                    {!user.isLocked && (
                        <button
                            onClick={isEditing ? handleSave : () => setIsEditing(true)}
                            style={isEditing ? saveBtnStyle : editBtnStyle}
                            disabled={loading}
                        >
                            {loading ? "Saving..." : (isEditing ? "Save Changes" : "Edit Profile")}
                        </button>
                    )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    <div>
                        <h4 style={{ color: '#555', marginBottom: '1rem', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>Personal Details</h4>
                        <InfoRow label="Full Name" value={user.profile.fullName} field="fullName" isEditing={isEditing} formData={formData} onChange={handleChange} />
                        <InfoRow label="Date of Birth" value={user.profile.dob} field="dob" isEditing={isEditing} formData={formData} onChange={handleChange} />
                        <InfoRow label="Gender" value={user.profile.gender} field="gender" isEditing={isEditing} formData={formData} onChange={handleChange} />
                        <InfoRow label="Blood Group" value={user.profile.bloodGroup} field="bloodGroup" isEditing={isEditing} formData={formData} onChange={handleChange} />
                    </div>
                    <div>
                        <h4 style={{ color: '#555', marginBottom: '1rem', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>Contact Details</h4>
                        <InfoRow label="Email" value={user.profile.email} field="email" isEditing={isEditing} formData={formData} onChange={handleChange} />
                        <InfoRow label="Phone" value={user.profile.contact} field="contact" isEditing={isEditing} formData={formData} onChange={handleChange} />
                        <InfoRow label="Address" value={`${user.profile.addressLine1}, ${user.profile.addressLine2}`} field="addressLine1" isEditing={isEditing} formData={formData} onChange={handleChange} />
                        <InfoRow label="Emergency Contact" value={user.profile.emergencyContact} field="emergencyContact" isEditing={isEditing} formData={formData} onChange={handleChange} />
                    </div>
                </div>

                <div style={{ marginTop: '1rem' }}>
                    <h4 style={{ color: '#555', marginBottom: '1rem', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>Additional Info</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                        <InfoRow label="Profession" value={user.profile.profession} field="profession" isEditing={isEditing} formData={formData} onChange={handleChange} />
                        <InfoRow label="RI ID" value={user.profile.riId} field="riId" isEditing={isEditing} formData={formData} onChange={handleChange} />
                        <InfoRow label="Hobbies" value={user.profile.hobbies} field="hobbies" isEditing={isEditing} formData={formData} onChange={handleChange} />
                    </div>
                </div>

                {isEditing && (
                    <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                        <button onClick={() => setIsEditing(false)} style={cancelBtnStyle}>Cancel</button>
                    </div>
                )}
            </div>
        </div>
    )
}

const inputStyle = {
    width: '100%',
    padding: '0.5rem',
    borderRadius: '5px',
    border: '1px solid #ddd',
    fontSize: '0.9rem'
}

const editBtnStyle = {
    padding: '0.5rem 1.5rem',
    background: 'white',
    color: 'var(--primary-magenta)',
    border: '1px solid var(--primary-magenta)',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer'
}

const saveBtnStyle = {
    padding: '0.5rem 1.5rem',
    background: 'var(--primary-magenta)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer'
}

const cancelBtnStyle = {
    padding: '0.5rem 1.5rem',
    background: '#eee',
    color: '#555',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer'
}

export default MemberProfile