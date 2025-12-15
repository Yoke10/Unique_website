import React from 'react'
import './FAQ.css'

const FAQ = () => {
    return (
        <main className="faq-page">
            <div className="faq-grid">
                {/* Intro Section - Item 1 */}
                <section className="faq-card faq-item-1">
                    <h1>Frequently Asked Questions</h1>
                    <p>Have questions? We have answers. Hover over the cards to discover more about our club.</p>
                </section>

                {/* Question 1 */}
                <section className="faq-card accent-pink">
                    <h2>How do I join?</h2>
                    <p>Membership is open to youth ages 18-30. Click 'Join Us' to start!</p>
                </section>

                {/* Spacer/Empty cards for visual effect if desired, or filled with more Qs */}
                <section className="faq-card accent-purple">
                    <h2>Meeting Times?</h2>
                    <p>We meet every 2nd and 4th Saturday at 6 PM.</p>
                </section>

                <section className="faq-card accent-magenta">
                    <h2>Is it free?</h2>
                    <p>There is a nominal annual fee to cover club administrative costs.</p>
                </section>

                <section className="faq-card accent-pink">
                    <h2>Leadership?</h2>
                    <p>Opportunities abound! You can lead committees or run for board positions.</p>
                </section>

                <section className="faq-card accent-purple">
                    <h2>Projects?</h2>
                    <p>We focus on community service, professional development, and international service.</p>
                </section>

                <section className="faq-card accent-magenta">
                    <h2>Networking?</h2>
                    <p>Connect with Rotarians and other young professionals locally and globally.</p>
                </section>

                <section className="faq-card accent-pink">
                    <h2>Events?</h2>
                    <p>Socials, workshops, fundraisers, and community cleanups regularly.</p>
                </section>

                <section className="faq-card accent-purple">
                    <h2>Guest Policy?</h2>
                    <p>Guests are always welcome to attend our meetings and see what we're about.</p>
                </section>

                <section className="faq-card accent-magenta">
                    <h2>Contact?</h2>
                    <p>Reach out via our 'Contact Us' page or DM us on Instagram.</p>
                </section>

            </div>
        </main>
    )
}

export default FAQ
