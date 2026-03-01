import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, Users, Handshake } from 'lucide-react';

const AdminDashboard = () => {
    const { user, authFetch } = useAuth();
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        quantity: 1,
        category: 'GAZ'
    });
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('dashboard');

    useEffect(() => {
        // Double check permissions
        if (user && user.role !== 'ADMIN') {
            navigate('/');
        }
        fetchProducts();
    }, [user, navigate]);

    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/products');
            const result = await response.json();
            setProducts(result.data || []);
        } catch (error) {
            console.error('Erreur chargement produits:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePhotoUpload = (e) => {
        if (e.target.files.length > 3) {
            alert('Maximum 3 photos autorisées');
            return;
        }
        setPhotos(Array.from(e.target.files));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formDataObj = new FormData();
        formDataObj.append('title', formData.title);
        formDataObj.append('description', formData.description);
        formDataObj.append('price', formData.price);
        formDataObj.append('quantity', formData.quantity);
        formDataObj.append('category', formData.category);

        photos.forEach(photo => {
            formDataObj.append('photos', photo);
        });

        try {
            const response = await authFetch('http://localhost:5000/api/products', {
                method: 'POST',
                // FormData automatically sets correct Content-Type with boundary
                body: formDataObj,
            });

            if (response.ok) {
                alert('Produit ajouté avec succès !');
                setFormData({ title: '', description: '', price: '', quantity: 1, category: 'GAZ' });
                setPhotos([]);
                fetchProducts(); // Refresh list
            } else {
                const err = await response.json();
                alert(`Erreur: ${err.message}`);
            }
        } catch (error) {
            console.error('Error submitting:', error);
            alert('Erreur réseau.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Voulez-vous vraiment supprimer ce produit ?')) return;
        try {
            const response = await authFetch(`http://localhost:5000/api/products/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                fetchProducts();
            }
        } catch (error) {
            console.error('Erreur supression:', error);
        }
    };

    if (!user || user.role !== 'ADMIN') return null;

    const tabs = {
        dashboard: { label: 'Tableau de bord', icon: LayoutDashboard, color: '#f7931e', glow: 'rgba(247,147,30,0.15)' },
        products: { label: 'Produits', icon: Package, color: '#3b82f6', glow: 'rgba(59,130,246,0.15)' },
        users: { label: 'Utilisateurs', icon: Users, color: '#10b981', glow: 'rgba(16,185,129,0.15)' },
        partners: { label: 'Partenaires', icon: Handshake, color: '#a855f7', glow: 'rgba(168,85,247,0.15)' }
    };

    const navItemStyle = (tabKey) => {
        const isActive = activeTab === tabKey;
        const tabData = tabs[tabKey];

        return {
            padding: '12px 15px',
            borderRadius: '12px',
            cursor: 'pointer',
            background: isActive ? tabData.glow : 'transparent',
            color: isActive ? tabData.color : 'var(--text-muted)',
            border: isActive ? `1px solid ${tabData.color}40` : '1px solid transparent',
            textAlign: 'left',
            fontSize: '15px',
            fontWeight: isActive ? '600' : '500',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: isActive ? `0 4px 12px ${tabData.glow}` : 'none'
        };
    };

    return (
        <div className="fade-in" style={{ padding: '60px 20px', maxWidth: '1400px', margin: '0 auto', display: 'flex', gap: '40px', alignItems: 'flex-start', minHeight: '80vh' }}>

            {/* Sidebar */}
            <div className="bento-card" style={{ width: '250px', padding: '24px', display: 'flex', flexDirection: 'column', position: 'sticky', top: '100px', border: `1px solid ${tabs[activeTab].color}30`, boxShadow: `0 8px 32px ${tabs[activeTab].glow}` }}>
                <h2 style={{ padding: '0 10px 20px 10px', color: 'var(--text-main)', fontSize: '24px', margin: 0, borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '8px', height: '24px', borderRadius: '4px', background: tabs[activeTab].color, transition: 'all 0.3s ease' }}></div>
                    Admin
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '24px' }}>
                    {Object.entries(tabs).map(([key, { label, icon: Icon, color }]) => (
                        <button
                            key={key}
                            onClick={() => setActiveTab(key)}
                            style={navItemStyle(key)}
                            onMouseEnter={(e) => {
                                if (activeTab !== key) {
                                    e.currentTarget.style.color = 'var(--text-main)';
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (activeTab !== key) {
                                    e.currentTarget.style.color = 'var(--text-muted)';
                                    e.currentTarget.style.background = 'transparent';
                                }
                            }}
                        >
                            <Icon
                                size={20}
                                color={activeTab === key ? color : 'currentColor'}
                                strokeWidth={activeTab === key ? 2.5 : 2}
                                style={{ transition: 'all 0.3s ease' }}
                            />
                            <span>{label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content Area */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '30px', minWidth: 0 }}>

                {activeTab === 'dashboard' && (
                    <div className="fade-in">
                        <h2 style={{ color: tabs.dashboard.color, fontSize: '32px', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <LayoutDashboard size={32} />
                            Tableau de bord
                        </h2>
                        <div className="bento-card" style={{ padding: '30px', border: `1px solid ${tabs.dashboard.color}30` }}>
                            <h3 style={{ color: 'var(--text-main)', marginBottom: '15px' }}>Bienvenue, {user.name || 'Admin'}</h3>
                            <p style={{ color: 'var(--text-muted)' }}>Ceci est le tableau de bord principal de l'administration. Sélectionnez une rubrique sur le menu de gauche.</p>
                        </div>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className="fade-in">
                        <h2 style={{ color: tabs.users.color, fontSize: '32px', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <Users size={32} />
                            Gestion des utilisateurs
                        </h2>
                        <div className="bento-card" style={{ padding: '30px', border: `1px solid ${tabs.users.color}30` }}>
                            <p style={{ color: 'var(--text-muted)' }}>Liste des utilisateurs en cours de développement...</p>
                        </div>
                    </div>
                )}

                {activeTab === 'partners' && (
                    <div className="fade-in">
                        <h2 style={{ color: tabs.partners.color, fontSize: '32px', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <Handshake size={32} />
                            Gestion des partenaires
                        </h2>
                        <div className="bento-card" style={{ padding: '30px', border: `1px solid ${tabs.partners.color}30` }}>
                            <p style={{ color: 'var(--text-muted)' }}>Liste des partenaires en cours de développement...</p>
                        </div>
                    </div>
                )}

                {activeTab === 'products' && (
                    <div className="fade-in">
                        <h2 style={{ color: tabs.products.color, fontSize: '32px', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <Package size={32} />
                            Gestion des produits
                        </h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 2fr)', gap: '30px' }}>
                            {/* Formulaire d'ajout */}
                            <div className="bento-card" style={{ padding: '30px', alignSelf: 'start' }}>
                                <h3 style={{ marginBottom: '20px', color: 'var(--text-main)' }}>Ajouter un produit</h3>

                                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    <div>
                                        <label style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Titre du produit</label>
                                        <input type="text" name="title" value={formData.title} onChange={handleInputChange} required style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'var(--bg-tertiary)', border: 'var(--bento-border)', color: 'var(--text-main)', marginTop: '5px' }} />
                                    </div>

                                    <div style={{ display: 'flex', gap: '15px' }}>
                                        <div style={{ flex: 1 }}>
                                            <label style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Catégorie</label>
                                            <select name="category" value={formData.category} onChange={handleInputChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'var(--bg-tertiary)', border: 'var(--bento-border)', color: 'var(--text-main)', marginTop: '5px' }}>
                                                <option value="GAZ">GAZ</option>
                                                <option value="EAU">EAU</option>
                                                <option value="CHARBON">CHARBON</option>
                                                <option value="ACCESSOIRES">ACCESSOIRES</option>
                                            </select>
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <label style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Prix (FCFA)</label>
                                            <input type="number" name="price" value={formData.price} onChange={handleInputChange} required style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'var(--bg-tertiary)', border: 'var(--bento-border)', color: 'var(--text-main)', marginTop: '5px' }} />
                                        </div>
                                    </div>

                                    <div>
                                        <label style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Quantité</label>
                                        <input type="number" name="quantity" value={formData.quantity} onChange={handleInputChange} min="1" required style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'var(--bg-tertiary)', border: 'var(--bento-border)', color: 'var(--text-main)', marginTop: '5px' }} />
                                    </div>

                                    <div>
                                        <label style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Description</label>
                                        <textarea name="description" value={formData.description} onChange={handleInputChange} rows="4" required style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'var(--bg-tertiary)', border: 'var(--bento-border)', color: 'var(--text-main)', marginTop: '5px' }}></textarea>
                                    </div>

                                    <div>
                                        <label style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Photos (Optionnel)</label>
                                        <input type="file" multiple accept="image/*" onChange={handlePhotoUpload} style={{ width: '100%', marginTop: '5px', color: 'var(--text-muted)' }} />
                                    </div>

                                    <button type="submit" className="buy-btn" disabled={loading} style={{ marginTop: '10px' }}>
                                        {loading ? 'Enregistrement...' : 'Ajouter le produit'}
                                    </button>
                                </form>
                            </div>

                            {/* Liste des produits (CRUD) */}
                            <div className="bento-card" style={{ padding: '30px', alignSelf: 'start', overflowX: 'auto' }}>
                                <h3 style={{ marginBottom: '20px', color: 'var(--text-main)' }}>Catalogue ({products.length})</h3>

                                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', color: 'var(--text-main)' }}>
                                    <thead>
                                        <tr style={{ borderBottom: 'var(--bento-border)' }}>
                                            <th style={{ padding: '10px 0', color: 'var(--text-muted)', fontWeight: '500' }}>Catégorie</th>
                                            <th style={{ padding: '10px 0', color: 'var(--text-muted)', fontWeight: '500' }}>Nom du produit</th>
                                            <th style={{ padding: '10px 0', color: tabs.products.color, fontWeight: '600' }}>Prix</th>
                                            <th style={{ padding: '10px 0', color: tabs.products.color, fontWeight: '600', textAlign: 'right' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.map(product => (
                                            <tr key={product.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                <td style={{ padding: '15px 0' }}><span style={{ background: 'var(--bg-tertiary)', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>{product.category}</span></td>
                                                <td style={{ padding: '15px 0', fontWeight: '500' }}>{product.title}</td>
                                                <td style={{ padding: '15px 0' }}>{product.price} FCFA</td>
                                                <td style={{ padding: '15px 0', textAlign: 'right' }}>
                                                    <button onClick={() => handleDelete(product.id)} style={{ background: '#ff4d4d20', color: '#ff4d4d', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>Supprimer</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
