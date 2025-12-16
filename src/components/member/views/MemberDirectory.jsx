import React, { useState, useEffect } from 'react';
import { mockDataService } from '../../../services/mockDataService';
import '../MemberDashboard.css';

const MemberDirectory = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadMembers();
    }, []);

    const loadMembers = async () => {
        try {
            const data = await mockDataService.getUsers();
            // Filter only active members? Or all? Usually verified members.
            setMembers(data.filter(u => u.status === 'active'));
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading Directory...</div>;

    return (
        <div className="directory-grid">
            {members.map(member => (
                <div key={member.id} className="directory-card">
                    <div className="dir-avatar">
                        {member.profile?.fullName?.charAt(0) || member.username.charAt(0)}
                    </div>
                    <div className="dir-info">
                        <div className="dir-id">ID: {member.memberId || 'N/A'}</div>
                        <h3>{member.profile?.fullName || member.username}</h3>
                        <div className="dir-details">
                            <p>{member.profile?.designation || 'Member'}</p>
                            <p>{member.profile?.bloodGroup && `🩸 ${member.profile.bloodGroup}`}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MemberDirectory;
