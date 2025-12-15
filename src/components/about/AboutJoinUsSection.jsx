import React from 'react'
import { Link } from 'react-router-dom'
import './AboutJoinUsSection.css'

const AboutJoinUsSection = () => {
    return (
        <section className="about-join-section">
            <div className="about-join-content">
                <h2 className="about-join-title">Join Our Mission</h2>
                <p className="about-join-text">
                    Be a part of a global movement that is changing the world.
                    Whether you want to lead, serve, or connect, there is a place for you in our Rotaract family.
                </p>
                <Link to="/join" className="about-join-btn">
                    Join Us
                </Link>
            </div>
        </section>
    )
}

export default AboutJoinUsSection
