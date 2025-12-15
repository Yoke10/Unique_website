import React, { useEffect } from 'react'
import TeamGridSection from '../components/team/TeamGridSection'

const Team = () => {
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <div className="team-page" style={{ marginTop: '80px' }}>
            <TeamGridSection />
        </div>
    )
}

export default Team
