import React, { Suspense } from 'react'
import HeroSection from '../components/home/HeroSection'
import AnnouncementTicker from '../components/home/AnnouncementTicker'
import AboutUsSection from '../components/home/AboutUsSection'
import PrayerAndTestSection from '../components/home/PrayerAndTestSection'

const OurTeamSection = React.lazy(() => import('../components/home/OurTeamSection'))
const ClubStatsSection = React.lazy(() => import('../components/home/ClubStatsSection'))
const EventsSection = React.lazy(() => import('../components/home/EventsSection'))
const SponsorsSection = React.lazy(() => import('../components/home/SponsorsSection'))
const JoinUsSection = React.lazy(() => import('../components/home/JoinUsSection'))
const GetInTouchSection = React.lazy(() => import('../components/home/GetInTouchSection'))

const Home = () => {
    return (
        <div className="home-page">
            <HeroSection />
            <AnnouncementTicker />
            <AboutUsSection />
            <PrayerAndTestSection />

            <Suspense fallback={<div style={{ height: '200px' }}></div>}>
                <OurTeamSection />
                <ClubStatsSection />
                <EventsSection />
                <SponsorsSection />
                <JoinUsSection />
                <GetInTouchSection />
            </Suspense>
        </div>
    )
}

export default Home
