import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import ImageCarousel from '../components/ImageCarousel';

const CATEGORIES = ['TOUS', 'GAZ', 'EAU', 'CHARBON', 'ACCESSOIRES'];

const Home = () => {
    const [products, setProducts] = useState([]);
    const [activeTab, setActiveTab] = useState('TOUS');

    useEffect(() => {
        fetch('https://diyamgaz.onrender.com/api/products')
            .then(res => res.json())
            .then(data => setProducts(data.data || []))
            .catch(err => console.error('Erreur de chargement', err));
    }, []);

    const filteredProducts = activeTab === 'TOUS'
        ? products
        : products.filter(p => p.category === activeTab);

    const heroImages = [
        { src: '/premium_gas_bottle_senegal_1772229211062.png' },
        { src: '/propos.png' },
        { src: '/propos2.png' },
        { src: '/propos3.png' }
    ];

    return (
        <div className="home-page fade-in">
            <section className="hero">
                <div className="hero-main fade-up">
                    <div className="hero-content">
                        <h2>Le gaz, l'eau et le charbon,<br />livrés avec élégance.</h2>
                        <p className="hook">Une expérience premium, directement chez vous.</p>
                        <p className="description">
                            Fini les tracas des bouteilles vides. DIYAMGAZ redéfinit la livraison à domicile avec un service rapide, fiable et moderne. Quelques clics suffisent.
                        </p>
                    </div>
                </div>
                <div className="hero-visual fade-up delay-1" style={{ position: 'relative', width: '100%', height: '600px', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)' }}>
                    <ImageCarousel images={heroImages} interval={4000} />
                </div>
            </section>

            <section className="categories-section fade-up delay-2">
                <div className="category-tabs">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            className={`tab-btn ${activeTab === cat ? 'active' : ''}`}
                            onClick={() => setActiveTab(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </section>

            <section className="products-grid fade-up delay-3">
                {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </section>

            <section className="partners-section fade-in">
                <div className="bento-card" style={{ flex: '1', textAlign: 'center' }}>
                    <h4 style={{ color: 'var(--text-main)', marginBottom: '8px' }}>Partenaires GAZ</h4>
                    <p style={{ color: 'var(--text-muted)' }}>TOTALGaz, Lobbou Gaz, Oryx gaz</p>
                </div>
                <div className="bento-card" style={{ flex: '1', textAlign: 'center' }}>
                    <h4 style={{ color: 'var(--text-main)', marginBottom: '8px' }}>Partenaires EAU</h4>
                    <p style={{ color: 'var(--text-muted)' }}>Kirène, Séo, Casamançaise, Miya</p>
                </div>
            </section>
        </div>
    );
};

export default Home;
