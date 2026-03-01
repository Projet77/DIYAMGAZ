import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isB2B, setIsB2B] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            // Provide explicit choice for requested B2B role
            const role = isB2B ? 'B2B' : 'CLIENT';

            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, role })
            });
            const data = await response.json();

            if (response.ok && data.success) {
                // Auto login after successful register
                login(data.user, data.token);
                navigate('/');
            } else {
                setError(data.message || 'Erreur lors de l’inscription');
            }
        } catch (err) {
            setError('Erreur réseau');
        }
    };

    return (
        <div className="fade-in" style={{ display: 'flex', justifyContent: 'center', padding: '100px 20px' }}>
            <div className="bento-card" style={{ width: '100%', maxWidth: '400px', padding: '40px' }}>
                <h2 style={{ marginBottom: '30px', textAlign: 'center', color: 'var(--text-main)' }}>Inscription</h2>

                {error && <div style={{ background: '#ff4d4d20', color: '#ff4d4d', padding: '10px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center' }}>{error}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <input
                        type="text"
                        placeholder="Nom complet"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                        style={{ padding: '15px', borderRadius: '12px', background: 'var(--bg-tertiary)', border: 'var(--bento-border)', color: 'var(--text-main)' }}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        style={{ padding: '15px', borderRadius: '12px', background: 'var(--bg-tertiary)', border: 'var(--bento-border)', color: 'var(--text-main)' }}
                    />
                    <input
                        type="password"
                        placeholder="Créer un mot de passe"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        style={{ padding: '15px', borderRadius: '12px', background: 'var(--bg-tertiary)', border: 'var(--bento-border)', color: 'var(--text-main)' }}
                    />

                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)', cursor: 'pointer' }}>
                        <input
                            type="checkbox"
                            checked={isB2B}
                            onChange={e => setIsB2B(e.target.checked)}
                            style={{ transform: 'scale(1.2)' }}
                        />
                        <span>M'inscrire en tant qu'entreprise (B2B)</span>
                    </label>

                    <button type="submit" className="buy-btn" style={{ width: '100%', marginTop: '10px' }}>
                        Créer mon compte
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '30px', color: 'var(--text-muted)' }}>
                    Déjà un compte ? <Link to="/login" style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>Connectez-vous</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
