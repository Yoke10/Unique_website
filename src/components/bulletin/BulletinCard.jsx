import React from 'react'

const BulletinCard = ({ bulletin, onClick }) => {
    return (
        <div
            onClick={() => onClick(bulletin)}
            style={{
                background: 'white',
                borderRadius: '15px',
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                cursor: 'pointer',
                position: 'relative'
            }}
            className="bulletin-card"
        >
            <div style={{ width: '100%', aspectRatio: '210/297', overflow: 'hidden' }}>
                <img
                    src={bulletin.poster}
                    alt={bulletin.title}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.5s ease'
                    }}
                    className="bulletin-poster"
                />
            </div>
            <div style={{ padding: '1.5rem' }}>
                <span style={{
                    display: 'inline-block',
                    padding: '0.3rem 0.8rem',
                    background: 'rgba(237, 7, 117, 0.1)',
                    color: 'var(--primary-pink)',
                    borderRadius: '50px',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    marginBottom: '0.5rem'
                }}>
                    {bulletin.month}
                </span>
                <h3 style={{
                    margin: '0',
                    color: 'var(--primary-magenta)',
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.2rem'
                }}>
                    {bulletin.title}
                </h3>
            </div>


        </div>
    )
}

export default BulletinCard
