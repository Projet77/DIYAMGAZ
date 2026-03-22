import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, Users, Handshake, TrendingUp, Eye, DollarSign, Download, Edit2, Trash2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
    const [stats, setStats] = useState(null);
    const [usersList, setUsersList] = useState([]);
    const [editingProductId, setEditingProductId] = useState(null);

    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [statsPeriod, setStatsPeriod] = useState('month'); // 'week', 'month', 'year'

    useEffect(() => {
        // Double check permissions
        if (user && user.role !== 'ADMIN') {
            navigate('/');
        }
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, navigate, statsPeriod]);

    const fetchData = async () => {
        try {
            const [prodRes, statsRes, usersRes] = await Promise.all([
                fetch('http://localhost:5000/api/products'),
                authFetch(`http://localhost:5000/api/stats?period=${statsPeriod}`),
                authFetch('http://localhost:5000/api/users')
            ]);

            const prodData = await prodRes.json();
            const statsData = await statsRes.json();
            const usersData = await usersRes.json();

            setProducts(prodData.data || []);
            setStats(statsData.data || null);
            setUsersList(usersData.data || []);

        } catch (error) {
            console.error('Erreur de chargement des données Dashboard:', error);
        }
    };

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
        if (e.target.files.length > 4) {
            alert('Maximum 4 photos autorisées');
            return;
        }
        setPhotos(Array.from(e.target.files));
    };

    const handleExportCSV = () => {
        if (!products || products.length === 0) return;

        // CSV Headers
        const headers = ["ID", "Titre", "Categorie", "Prix", "Stock", "Vues", "Date de creation"];
        // CSV Rows
        const rows = products.map(p => [
            p.id,
            `"${p.title.replace(/"/g, '""')}"`, // escape double quotes
            p.category,
            p.price,
            p.quantity,
            p.views,
            new Date(p.createdAt).toLocaleDateString('fr-FR')
        ]);

        const csvContent = "data:text/csv;charset=utf-8,\uFEFF"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `catalogue_produits_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleEditClick = (product) => {
        setEditingProductId(product.id);
        setFormData({
            title: product.title,
            description: product.description,
            price: product.price,
            quantity: product.quantity,
            category: product.category
        });
        setPhotos([]);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingProductId(null);
        setFormData({ title: '', description: '', price: '', quantity: 1, category: 'GAZ' });
        setPhotos([]);
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
            const url = editingProductId
                ? `http://localhost:5000/api/products/${editingProductId}`
                : 'http://localhost:5000/api/products';

            const method = editingProductId ? 'PUT' : 'POST';

            const response = await authFetch(url, {
                method: method,
                // FormData automatically sets correct Content-Type with boundary
                body: formDataObj,
            });

            if (response.ok) {
                alert(`Produit ${editingProductId ? 'modifié' : 'ajouté'} avec succès !`);
                handleCancelEdit(); // Réinitialise le formulaire
                fetchData(); // Refresh list & stats
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
                fetchData();
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
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-tertiary)' }}>

            {/* Sidebar Fixe Moderne */}
            <aside style={{ width: '280px', background: 'var(--bg-sidebar)', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh', zIndex: 10 }}>
                <div style={{ padding: '32px 24px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--primary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ color: 'white', fontWeight: 'bold', fontSize: '18px' }}>D</span>
                    </div>
                    <div>
                        <h1 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: 'var(--text-main)', letterSpacing: '-0.5px' }}>DIYAMGAZ</h1>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Admin Panel</span>
                    </div>
                </div>

                <nav style={{ padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                    {Object.entries(tabs).map(([key, { label, icon: Icon, color }]) => {
                        const isActive = activeTab === key;
                        return (
                            <button
                                key={key}
                                onClick={() => setActiveTab(key)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
                                    borderRadius: '12px', border: 'none', background: isActive ? '#f8fafc' : 'transparent',
                                    color: isActive ? color : 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.2s',
                                    width: '100%', textAlign: 'left', fontWeight: isActive ? '600' : '500',
                                    boxShadow: isActive ? 'inset 3px 0 0 0 ' + color : 'none'
                                }}
                                onMouseEnter={(e) => {
                                    if (!isActive) e.currentTarget.style.background = '#f8fafc';
                                }}
                                onMouseLeave={(e) => {
                                    if (!isActive) e.currentTarget.style.background = 'transparent';
                                }}
                            >
                                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                                <span>{label}</span>
                            </button>
                        );
                    })}
                </nav>

                <div style={{ padding: '24px 16px', borderTop: '1px solid #f1f5f9' }}>
                    <button onClick={() => navigate('/')} style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'transparent', border: '1px solid #e2e8f0', color: 'var(--text-main)', fontWeight: '600', cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center' }}>
                        Retour au site
                    </button>
                </div>
            </aside>

            {/* Contenu Principal */}
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

                {/* Top Header */}
                <header style={{ height: '80px', background: 'white', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px', position: 'sticky', top: 0, zIndex: 5 }}>
                    <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '600', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {tabs[activeTab].label}
                    </h2>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-main)' }}>{user.name || 'Admin'}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{user.email}</div>
                        </div>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontWeight: 'bold' }}>
                            {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
                        </div>
                    </div>
                </header>

                {/* Dashboard Scrollable Content */}
                <div style={{ padding: '40px', overflowY: 'auto', flex: 1 }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

                        {/* ================= TAB: DASHBOARD ================= */}
                        {activeTab === 'dashboard' && stats && (
                            <div className="fade-in">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                    <h3 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>Vue d'ensemble</h3>
                                    <select
                                        value={statsPeriod}
                                        onChange={(e) => setStatsPeriod(e.target.value)}
                                        style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--bento-border)', background: 'white', color: 'var(--text-main)', fontWeight: '500', outline: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
                                    >
                                        <option value="week">7 derniers jours</option>
                                        <option value="month">30 derniers jours</option>
                                        <option value="year">12 derniers mois</option>
                                    </select>
                                </div>

                                {/* Section KPIs */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '40px' }}>

                                    <div className="bento-card">
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                                            <div>
                                                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '14px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Utilisateurs</p>
                                                <h3 style={{ margin: '8px 0 0 0', fontSize: '36px', fontWeight: '800', color: 'var(--text-main)' }}>{stats.summary.totalUsers}</h3>
                                            </div>
                                            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Users size={24} color="#3b82f6" />
                                            </div>
                                        </div>
                                        <div style={{ fontSize: '13px', color: '#10b981', fontWeight: '500' }}>Inscrits sur la plateforme</div>
                                    </div>

                                    <div className="bento-card">
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                                            <div>
                                                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '14px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Catalogue Actif</p>
                                                <h3 style={{ margin: '8px 0 0 0', fontSize: '36px', fontWeight: '800', color: 'var(--text-main)' }}>{stats.summary.totalProducts}</h3>
                                            </div>
                                            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(247, 147, 30, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Package size={24} color="#f7931e" />
                                            </div>
                                        </div>
                                        <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Produits en vente</div>
                                    </div>

                                    <div className="bento-card">
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                                            <div>
                                                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '14px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Chiffre d'affaires</p>
                                                <h3 style={{ margin: '8px 0 0 0', fontSize: '36px', fontWeight: '800', color: 'var(--text-main)' }}>{stats.summary.totalRevenue.toLocaleString()} <span style={{ fontSize: '18px', color: 'var(--text-muted)' }}>FCFA</span></h3>
                                            </div>
                                            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <DollarSign size={24} color="#10b981" />
                                            </div>
                                        </div>
                                        <div style={{ fontSize: '13px', color: '#10b981', fontWeight: '500' }}>Ventes confirmées</div>
                                    </div>

                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '24px' }}>
                                    {/* Chart */}
                                    <div className="bento-card">
                                        <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-main)', marginBottom: '24px' }}>Entrées d'inventaire récentes</h3>
                                        <div style={{ height: '300px', width: '100%', minWidth: 0 }}>
                                            <ResponsiveContainer width="100%" height="100%">
                                                <AreaChart data={stats.charts.inventoryCurve}>
                                                    <defs>
                                                        <linearGradient id="colorInventory" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor={tabs.dashboard.color} stopOpacity={0.2} />
                                                            <stop offset="95%" stopColor={tabs.dashboard.color} stopOpacity={0} />
                                                        </linearGradient>
                                                    </defs>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickMargin={12} />
                                                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(tick) => `${tick}`} />
                                                    <Tooltip
                                                        contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                                                    />
                                                    <Area type="monotone" dataKey="totalStockActivity" stroke={tabs.dashboard.color} strokeWidth={2} fillOpacity={1} fill="url(#colorInventory)" />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    {/* Top Products */}
                                    <div className="bento-card">
                                        <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-main)', marginBottom: '24px' }}>Les plus populaires</h3>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                            {stats.topViewedProducts.map((p, i) => (
                                                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '16px', borderBottom: i !== stats.topViewedProducts.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                                                    <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)' }}>
                                                        {i + 1}
                                                    </div>
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{ fontWeight: '500', color: 'var(--text-main)', fontSize: '14px' }}>{p.title}</div>
                                                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{p.category}</div>
                                                    </div>
                                                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#3b82f6', background: '#eff6ff', padding: '4px 8px', borderRadius: '100px' }}>
                                                        {p.views} <Eye size={12} style={{ display: 'inline', marginLeft: '2px' }} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ================= TAB: USERS ================= */}
                        {activeTab === 'users' && (
                            <div className="fade-in bento-card" style={{ padding: 0 }}>
                                <div style={{ padding: '24px 32px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h3 style={{ margin: 0, fontSize: '18px' }}>Liste des comptes</h3>
                                    <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{usersList.length} total</span>
                                </div>
                                <div style={{ overflowX: 'auto' }}>
                                    <table className="data-table">
                                        <thead>
                                            <tr>
                                                <th>Utilisateur</th>
                                                <th>Email</th>
                                                <th>Rôle</th>
                                                <th style={{ textAlign: 'right' }}>Inscription</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {usersList.map(u => (
                                                <tr key={u.id}>
                                                    <td>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-main)', fontWeight: '600', fontSize: '14px' }}>
                                                                {u.name ? u.name.charAt(0).toUpperCase() : '?'}
                                                            </div>
                                                            <span style={{ fontWeight: '500' }}>{u.name || 'Non renseigné'}</span>
                                                        </div>
                                                    </td>
                                                    <td style={{ color: 'var(--text-muted)' }}>{u.email}</td>
                                                    <td>
                                                        <span style={{
                                                            background: u.role === 'ADMIN' ? '#fee2e2' : u.role === 'B2B' ? '#e0e7ff' : '#f1f5f9',
                                                            color: u.role === 'ADMIN' ? '#ef4444' : u.role === 'B2B' ? '#4f46e5' : '#64748b',
                                                            padding: '4px 10px', borderRadius: '100px', fontSize: '12px', fontWeight: '600'
                                                        }}>
                                                            {u.role}
                                                        </span>
                                                    </td>
                                                    <td style={{ color: 'var(--text-muted)', textAlign: 'right' }}>
                                                        {new Date(u.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                    </td>
                                                </tr>
                                            ))}
                                            {usersList.length === 0 && (
                                                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '40px' }}>Aucun utilisateur</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* ================= TAB: PARTNERS ================= */}
                        {activeTab === 'partners' && (
                            <div className="fade-in bento-card">
                                <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                                    <Handshake size={48} color="var(--text-light)" style={{ marginBottom: '16px' }} />
                                    <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>Gestion des Partenaires</h3>
                                    <p style={{ color: 'var(--text-muted)' }}>Cette section est actuellement en cours de développement.</p>
                                </div>
                            </div>
                        )}

                        {/* ================= TAB: PRODUCTS ================= */}
                        {activeTab === 'products' && (
                            <div className="fade-in">
                                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 2fr)', gap: '32px' }}>

                                    {/* Formulaire Produit */}
                                    <div className="bento-card" style={{ alignSelf: 'start', padding: '32px' }}>
                                        <h3 style={{ fontSize: '18px', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #e2e8f0' }}>
                                            {editingProductId ? 'Éditer le produit' : 'Nouveau Produit'}
                                        </h3>
                                        <form onSubmit={handleSubmit} className="admin-form">
                                            <div className="form-group">
                                                <label>Titre du produit</label>
                                                <input type="text" name="title" value={formData.title} onChange={handleInputChange} required />
                                            </div>

                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label>Catégorie</label>
                                                    <select name="category" value={formData.category} onChange={handleInputChange}>
                                                        <option value="GAZ">GAZ</option>
                                                        <option value="EAU">EAU</option>
                                                        <option value="CHARBON">CHARBON</option>
                                                        <option value="ACCESSOIRES">ACCESSOIRES</option>
                                                    </select>
                                                </div>
                                                <div className="form-group">
                                                    <label>Prix (FCFA)</label>
                                                    <input type="number" name="price" value={formData.price} onChange={handleInputChange} required />
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <label>Stock / Quantité Initiale</label>
                                                <input type="number" name="quantity" value={formData.quantity} onChange={handleInputChange} min="1" required />
                                            </div>

                                            <div className="form-group">
                                                <label>Description courte</label>
                                                <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" required></textarea>
                                            </div>

                                            <div className="form-group">
                                                <label>Téleverser des Photos (Max 4)</label>
                                                <div className="file-upload-wrapper" style={{ padding: '20px', borderRadius: '12px', border: '2px dashed #cbd5e1', background: '#f8fafc', position: 'relative' }}>
                                                    <input type="file" multiple accept="image/*" onChange={handlePhotoUpload} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
                                                    <div style={{ textAlign: 'center', pointerEvents: 'none' }}>
                                                        <span style={{ fontSize: '14px', color: '#64748b', fontWeight: '500' }}>{photos.length > 0 ? `${photos.length} fichiers ajoutés` : 'Glissez vos fichiers ou cliquez'}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
                                                <button type="submit" disabled={loading} style={{ flex: 1, padding: '14px', borderRadius: '12px', background: editingProductId ? 'var(--secondary-color)' : 'var(--text-main)', color: 'white', fontWeight: '600', border: 'none', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                                                    {loading ? 'Traitement...' : editingProductId ? 'Mettre à jour' : 'Publier'}
                                                </button>

                                                {editingProductId && (
                                                    <button type="button" onClick={handleCancelEdit} style={{ padding: '14px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white', color: 'var(--text-main)', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}>
                                                        Annuler
                                                    </button>
                                                )}
                                            </div>
                                        </form>
                                    </div>

                                    {/* Data Table : Catalogue */}
                                    <div className="bento-card" style={{ padding: 0, alignSelf: 'start', overflow: 'hidden' }}>
                                        <div style={{ padding: '24px 32px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white' }}>
                                            <div>
                                                <h3 style={{ margin: 0, fontSize: '18px' }}>Catalogue Actif</h3>
                                                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{products.length} articles en ligne</span>
                                            </div>
                                            <button
                                                onClick={handleExportCSV}
                                                style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white', border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', color: 'var(--text-main)', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
                                                onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                                                onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                                            >
                                                <Download size={16} /> Exporter CSV
                                            </button>
                                        </div>
                                        <div style={{ overflowX: 'auto' }}>
                                            <table className="data-table">
                                                <thead>
                                                    <tr>
                                                        <th>Produit</th>
                                                        <th>Prix</th>
                                                        <th>Stock</th>
                                                        <th style={{ textAlign: 'right' }}>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {products.map(product => (
                                                        <tr key={product.id}>
                                                            <td>
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                                                    <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: '#f8fafc', padding: '4px', border: '1px solid #e2e8f0' }}>
                                                                        <img src={product.photos && product.photos.length > 0 ? `http://localhost:5000${product.photos[0]}` : '/images/Placeholder.png'} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }} />
                                                                    </div>
                                                                    <div>
                                                                        <div style={{ fontWeight: '600', color: 'var(--text-main)', fontSize: '14px' }}>{product.title}</div>
                                                                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>{product.category}</div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td style={{ fontWeight: '500' }}>{product.price} <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>FCFA</span></td>
                                                            <td>
                                                                <span style={{ display: 'inline-block', padding: '4px 8px', borderRadius: '6px', background: product.quantity > 5 ? '#ecfdf5' : '#fef2f2', color: product.quantity > 5 ? '#10b981' : '#ef4444', fontSize: '13px', fontWeight: '600' }}>
                                                                    {product.quantity} u.
                                                                </span>
                                                            </td>
                                                            <td style={{ textAlign: 'right' }}>
                                                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                                    <button
                                                                        onClick={() => handleEditClick(product)}
                                                                        style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#eff6ff', color: '#3b82f6', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', transition: 'all 0.2s' }}
                                                                        onMouseEnter={(e) => e.currentTarget.style.background = '#dbeafe'}
                                                                        onMouseLeave={(e) => e.currentTarget.style.background = '#eff6ff'}
                                                                    >
                                                                        <Edit2 size={14} /> Éditer
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleDelete(product.id)}
                                                                        style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#fef2f2', color: '#ef4444', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', transition: 'all 0.2s' }}
                                                                        onMouseEnter={(e) => e.currentTarget.style.background = '#fee2e2'}
                                                                        onMouseLeave={(e) => e.currentTarget.style.background = '#fef2f2'}
                                                                    >
                                                                        <Trash2 size={14} /> Supprimer
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    {products.length === 0 && (
                                                        <tr><td colSpan="4" style={{ textAlign: 'center', padding: '40px' }}>Catalogue vide</td></tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
