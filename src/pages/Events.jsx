import React, { useEffect } from 'react' // Removed useState as it is handled by useQuery
import EventCard from '../components/events/EventCard'
import Loading from '../components/common/Loading'
import { firebaseService } from '../services/firebaseService'
import { useQuery } from '@tanstack/react-query'
import './Events.css'

const Events = () => {
    // TanStack Query Hook
    const { data: events = [], isLoading: loading } = useQuery({
        queryKey: ['events'],
        queryFn: firebaseService.getEvents,
        staleTime: 5 * 60 * 1000, // 5 minutes default,
    })

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <div className="events-page">
            <h1 className="events-page-title">
                Upcoming Events
            </h1>

            <div className="events-list-container">
                {loading ? (
                    <div className="loading-container">
                        <Loading fullScreen={false} />
                    </div>
                ) : events.length > 0 ? (
                    events.map((event, index) => (
                        <EventCard
                            key={event.id}
                            event={event}
                            index={index}
                            priority={index < 3}
                        />
                    ))
                ) : (
                    <div className="empty-state">
                        <p className="empty-state-text">
                            No upcoming events at the moment. Stay tuned!
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Events
