import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ImageCarousel from '../components/ImageCarousel';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();

            if (response.ok && data.success) {
                login(data.user, data.token);
                if (data.user.role === 'ADMIN') {
                    navigate('/admin');
                } else {
                    navigate('/');
                }
            } else {
                setError(data.message || 'Erreur de connexion');
            }
        } catch (err) {
            setError('Erreur réseau');
        }
    };

    const carouselImages = [
        { src: '/images/carousel_gas.png' },
        { src: '/images/carousel_water.png' },
        { src: '/images/carousel_charcoal.png' }
    ];

    return (
        <div className="fade-in" style={{ padding: '60px 20px', maxWidth: '1200px', margin: '0 auto', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(400px, 1fr) 1.5fr', gap: '30px', width: '100%', height: '600px' }}>

                {/* Formulaire de Connexion */}
                <div className="bento-card" style={{ padding: '50px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <h2 style={{ marginBottom: '10px', color: 'var(--text-main)', fontSize: '32px' }}>Bienvenue</h2>
                    <p style={{ marginBottom: '30px', color: 'var(--text-muted)' }}>Connectez-vous pour continuer vers DIYAMGAZ.</p>

                    {error && <div style={{ background: '#ff4d4d20', color: '#ff4d4d', padding: '12px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center', fontWeight: '500' }}>{error}</div>}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            style={{ padding: '15px', borderRadius: '12px', background: 'var(--bg-tertiary)', border: 'var(--bento-border)', color: 'var(--text-main)', fontSize: '16px' }}
                        />
                        <input
                            type="password"
                            placeholder="Mot de passe"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            style={{ padding: '15px', borderRadius: '12px', background: 'var(--bg-tertiary)', border: 'var(--bento-border)', color: 'var(--text-main)', fontSize: '16px' }}
                        />

                        <button type="submit" className="buy-btn" style={{ width: '100%', marginTop: '10px', fontSize: '16px', padding: '16px' }}>
                            Se connecter
                        </button>
                    </form>

                    <p style={{ textAlign: 'center', marginTop: '30px', color: 'var(--text-muted)' }}>
                        Pas encore de compte ? <Link to="/register" style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>S'inscrire</Link>
                    </p>
                </div>

                {/* Carrousel visuel Bento Box */}
                <div style={{ borderRadius: '24px', overflow: 'hidden', display: 'flex', '@media (max-width: 900px)': { display: 'none' } }} className="hero-visual">
                    <ImageCarousel images={carouselImages} interval={3500} />
                </div>
            </div>
        </div>
    );
};

export default Login;
