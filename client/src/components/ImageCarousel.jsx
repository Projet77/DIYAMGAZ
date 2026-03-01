import React, { useState, useEffect } from 'react';

const ImageCarousel = ({ images, interval = 5000 }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (!images || images.length <= 1) return;

        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, interval);

        return () => clearInterval(timer);
    }, [images, interval]);

    if (!images || images.length === 0) return null;

    return (
        <div style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            borderRadius: '24px',
            backgroundColor: 'var(--bg-secondary)',
            boxShadow: 'var(--bento-shadow)'
        }}>
            {images.map((img, index) => (
                <div
                    key={index}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        opacity: index === currentIndex ? 1 : 0,
                        transition: 'opacity 1s ease-in-out',
                        transform: index === currentIndex ? 'scale(1)' : 'scale(1.05)',
                        transitionProperty: 'opacity, transform',
                        transitionDuration: '1s',
                        zIndex: index === currentIndex ? 1 : 0
                    }}
                >
                    <img
                        src={img.src}
                        alt={img.alt || `Slide ${index}`}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                        }}
                    />
                    {img.caption && (
                        <div style={{
                            position: 'absolute',
                            bottom: '30px',
                            left: '30px',
                            right: '30px',
                            padding: '20px',
                            background: 'rgba(0, 0, 0, 0.6)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: '16px',
                            color: 'white',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            transform: index === currentIndex ? 'translateY(0)' : 'translateY(20px)',
                            opacity: index === currentIndex ? 1 : 0,
                            transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.3s'
                        }}>
                            <h3 style={{ margin: '0 0 5px 0', fontSize: '20px', fontWeight: '600' }}>{img.title}</h3>
                            {img.subtitle && <p style={{ margin: 0, fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>{img.subtitle}</p>}
                        </div>
                    )}
                </div>
            ))}

            {/* Pagination Dots */}
            {images.length > 1 && (
                <div style={{
                    position: 'absolute',
                    bottom: '15px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    gap: '8px',
                    zIndex: 2
                }}>
                    {images.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            style={{
                                width: index === currentIndex ? '24px' : '8px',
                                height: '8px',
                                borderRadius: '4px',
                                background: index === currentIndex ? 'var(--primary-color)' : 'rgba(255, 255, 255, 0.5)',
                                border: 'none',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer',
                                padding: 0
                            }}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ImageCarousel;
