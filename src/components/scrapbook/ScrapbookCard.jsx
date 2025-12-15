import React from 'react'

const ScrapbookCard = ({ scrapbook, onClick }) => {
    return (
        <div
            onClick={() => onClick(scrapbook)}
            style={{
                background: 'white',
                borderRadius: '15px',
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                cursor: 'pointer',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                position: 'relative'
            }}
            className="scrapbook-card"
        >
            <div style={{ height: '220px', overflow: 'hidden' }}>
                <img
                    src={scrapbook.poster}
                    alt={scrapbook.title}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.5s ease'
                    }}
                    className="scrapbook-poster"
                />
            </div>
            <div style={{ padding: '1.5rem' }}>
                <span style={{
                    display: 'inline-block',
                    padding: '0.3rem 0.8rem',
                    background: 'rgba(7, 237, 117, 0.1)',
                    color: '#07ed75',
                    borderRadius: '50px',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    marginBottom: '0.5rem'
                }}>
                    {scrapbook.date}
                </span>
                <h3 style={{
                    margin: '0',
                    color: 'var(--primary-magenta)',
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.2rem'
                }}>
                    {scrapbook.title}
                </h3>
            </div>

            <style>{`
                .scrapbook-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 15px 40px rgba(0,0,0,0.1);
                }
                .scrapbook-card:hover .scrapbook-poster {
                    transform: scale(1.05);
                }
            `}</style>
        </div>
    )
}

export default ScrapbookCard
