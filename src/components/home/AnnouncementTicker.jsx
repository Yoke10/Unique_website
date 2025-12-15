import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './AnnouncementTicker.css'

const AnnouncementTicker = () => {
    const [isPaused, setIsPaused] = useState(false)

    const announcements = [
        { id: 1, text: "🎉 New Project Launch: Community Health Initiative - Join us this weekend!", link: "/events" },
        { id: 2, text: "📢 Monthly Meeting scheduled for December 15th at 6:00 PM", link: "/events" },
        { id: 3, text: "🌟 Congratulations to our members for winning Best Club Award 2024!", link: "/about" },
        { id: 4, text: "🎓 Leadership Training Workshop - Register now! Limited seats available", link: "/events" },
        { id: 5, text: "💝 Blood Donation Camp on December 20th - Be a lifesaver!", link: "/events" },
        { id: 6, text: "📸 Photo Contest: Share your best moments with us! Deadline: Dec 31st", link: "/gallery" }
    ]

    return (
        <section className="announcement-section">
            <div className="announcement-container">
                <div className="announcement-label">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                    </svg>
                    <span>Announcements</span>
                </div>

                <div
                    className="ticker-wrapper"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    <div className={`ticker-content ${isPaused ? 'paused' : ''}`}>
                        {[...announcements, ...announcements].map((announcement, index) => (
                            <Link
                                key={`${announcement.id}-${index}`}
                                to={announcement.link}
                                className="ticker-item"
                            >
                                {announcement.text}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default AnnouncementTicker
