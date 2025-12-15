import React from 'react'
import './AboutHeroSection.css'

const AboutHeroSection = () => {
    return (
        <section className="about-hero-section">
            <div className="about-hero-visual">
                <div className="years-3d-container">
                    <div className="years-text-3d">25+</div>
                </div>
                <div className="years-label">Years of Service</div>
            </div>
            <div className="about-hero-content">
                <h1 className="about-hero-title">Legacy of Service & Leadership</h1>
                <p className="about-hero-subtitle">
                    Celebrating over two decades of making a difference, empowering youth, and serving our community with passion and dedication.
                </p>
            </div>
        </section>
    )
}

export default AboutHeroSection
