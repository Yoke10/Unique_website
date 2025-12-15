import React from "react";
import "./HeroSection.css";

const HeroSection = () => {
    const title = "COIMBATORE UNIQUE";

    return (
        <section className="hero-section">
            <div className="hero-bg-image"></div>
            <div className="hero-background"></div>
            <div className="hero-floating-circles"></div>
            <div className="hero-content">

                <p className="hero-subtitle">Rotaract Club of</p>

                {/* Auto-split title into spans */}
                <h1 className="hero-title">
                    {title.split("").map((char, index) => (
                        <span key={index} className="hero-letter">
                            {char === " " ? "\u00A0" : char}
                        </span>
                    ))}
                </h1>

                <div className="hero-info">
                    <span className="hero-district">Rotary International District 3206</span>
                    <span className="hero-separator">|</span>
                    <span className="hero-charter">Charter Day - 21.11.2000</span>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
