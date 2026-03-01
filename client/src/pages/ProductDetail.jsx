import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
    const { id } = useParams();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                // To support a real detail fetch, the backend should ideally have a single product endpoint.
                // Fetching all for simplicity in this demo and finding the correct one.
                const response = await fetch('http://localhost:5000/api/products');
                const result = await response.json();
                const foundProduct = result.data.find(p => p.id === parseInt(id));
                setProduct(foundProduct);
            } catch (error) {
                console.error('Error fetching product details:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) return <div className="app-container" style={{ padding: '100px 0', textAlign: 'center' }}>Chargement...</div>;
    if (!product) return <div className="app-container" style={{ padding: '100px 0', textAlign: 'center' }}>Produit introuvable.</div>;

    const increment = () => setQuantity(prev => prev + 1);
    const decrement = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

    const handleBuy = () => {
        addToCart(product, quantity);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    // Determine premium AI image based on category
    let displayImage = product.image;
    if (!displayImage || displayImage.includes('unsplash')) {
        if (product.category === 'GAZ') displayImage = '/premium_gas_bottle_senegal_1772229211062.png';
        if (product.category === 'EAU') displayImage = '/premium_water_bottle_1772227577044.png';
        if (product.category === 'CHARBON') displayImage = '/premium_charcoal_1772227593891.png';
    }

    return (
        <div className="fade-in" style={{ padding: '40px 0 80px' }}>
            <div className="hero" style={{ marginBottom: '20px', gridTemplateColumns: '1fr', padding: '0' }}>
                <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', marginBottom: '20px', display: 'inline-block' }}>
                    ← Retour à la boutique
                </Link>
            </div>

            <div className="hero">
                <div className="hero-visual fade-up" style={{ minHeight: '500px', padding: '40px' }}>
                    <img style={{ filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.5))', maxWidth: '80%', maxHeight: '400px', objectFit: 'contain' }} src={displayImage} alt={product.title} className="floating" />
                </div>

                <div className="hero-main fade-up delay-1">
                    <div className="hero-content">
                        <span style={{ color: 'var(--primary-color)', fontWeight: '600', letterSpacing: '1px', fontSize: '14px', textTransform: 'uppercase' }}>{product.category}</span>
                        <h2 style={{ fontSize: '48px', marginTop: '16px', marginBottom: '24px' }}>{product.title}</h2>
                        <div style={{ fontSize: '32px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '32px' }}>
                            {product.price} FCFA
                        </div>

                        <p className="description" style={{ marginBottom: '40px' }}>
                            {product.description} Ce produit est livré avec le plus grand soin par les équipes de DIYAMGAZ directement à votre domicile dans les plus brefs délais. Profitez d'une qualité premium.
                        </p>

                        <div className="action-row" style={{ display: 'flex', gap: '20px', alignItems: 'center', marginTop: 'auto' }}>
                            <div className="quantity-selector" style={{ height: '56px', padding: '0 10px' }}>
                                <button onClick={decrement} className="qty-btn" style={{ fontSize: '24px' }}>-</button>
                                <span className="qty-value" style={{ fontSize: '18px', padding: '0 20px' }}>{quantity}</span>
                                <button onClick={increment} className="qty-btn" style={{ fontSize: '24px' }}>+</button>
                            </div>

                            <button
                                onClick={handleBuy}
                                className={`buy-btn ${added ? 'added' : ''}`}
                                style={{ height: '56px', fontSize: '18px', flexGrow: '1' }}
                            >
                                {added ? 'Ajouté au panier ✓' : 'Ajouter au panier'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
