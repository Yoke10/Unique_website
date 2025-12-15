import React from 'react';
import { Zap, Sparkles, Crown } from 'lucide-react';
import GlowingCards, { GlowingCard } from '../ui/GlowingCards';
import './VisionMissionGoalSection.css';

const VisionMissionGoalSection = () => {
    return (
        <section className="vmg-section">
            <h2 className="section-title">Our Vision, Mission & Goal</h2>
            <div className="vmg-cards-container-wrapper">
                {/* Wrapper div to maintain any section-specific spacing if needed, but GlowingCards handles layout */}
                <GlowingCards gap="2rem" maxWidth="1200px">
                    {/* Vision - Purple #400763 */}
                    <GlowingCard glowColor="#400763" className="vmg-card theme-purple">
                        <div className="vmg-content">
                            <div className="vmg-icon-wrapper">
                                <Zap size={48} strokeWidth={1.5} />
                            </div>
                            <h3 className="vmg-title">Our Vision</h3>
                            <p className="vmg-text">
                                To be a leading global community of young adults, taking action for positive change,
                                fostering leadership, and building international understanding.
                            </p>
                        </div>
                    </GlowingCard>

                    {/* Mission - Magenta #680b56 */}
                    <GlowingCard glowColor="#680b56" className="vmg-card theme-magenta">
                        <div className="vmg-content">
                            <div className="vmg-icon-wrapper">
                                <Sparkles size={48} strokeWidth={1.5} />
                            </div>
                            <h3 className="vmg-title">Our Mission</h3>
                            <p className="vmg-text">
                                To provide an opportunity for young men and women to enhance the knowledge and skills
                                that will assist them in personal development, to address the physical and social needs
                                of their communities.
                            </p>
                        </div>
                    </GlowingCard>

                    {/* Goal - Pink #ed0775 */}
                    <GlowingCard glowColor="#ed0775" className="vmg-card theme-pink">
                        <div className="vmg-content">
                            <div className="vmg-icon-wrapper">
                                <Crown size={48} strokeWidth={1.5} />
                            </div>
                            <h3 className="vmg-title">Our Goal</h3>
                            <p className="vmg-text">
                                To empower youth to become effective leaders, responsible citizens, and to promote
                                international peace and understanding through a global network of friendship and service.
                            </p>
                        </div>
                    </GlowingCard>
                </GlowingCards>
            </div>
        </section>
    );
};

export default VisionMissionGoalSection;
