import React from 'react'
import './TeamMemberCard.css'

const TeamMemberCard = ({ name, role, image, message }) => {
    return (
        <div className="team-member-card">
            <div className="member-image-container">
                <img src={image} alt={name} className="member-image" />
                <div className="member-overlay">
                    <p className="member-message">"{message}"</p>
                </div>
            </div>
            <div className="member-info">
                <h3 className="member-name">{name}</h3>
                <span className="member-role">{role}</span>
            </div>
        </div>
    )
}

export default TeamMemberCard
