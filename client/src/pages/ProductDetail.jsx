import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingCart } from 'lucide-react'; // icone ajoutée

const ProductDetail = () => {
    const { id } = useParams();
    const { addToCart, cartItems } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                // To support a real detail fetch, the backend should ideally have a single product endpoint.
                // Fetching all for simplicity in this demo and finding the correct one.
                const response = await fetch('https://diyamgaz.onrender.com/api/products');
                const result = await response.json();
                const foundProduct = result.data.find(p => p.id === parseInt(id));
                setProduct(foundProduct);

                // Incrémenter les vues silencieusement
                if (foundProduct) {
                    fetch(`https://diyamgaz.onrender.com/api/products/${id}/views`, { method: 'PUT' }).catch(() => { });
                }
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

    const itemInCart = cartItems && product ? cartItems.find(item => item.id === product.id) : null;
    const quantityInCart = itemInCart ? itemInCart.quantity : 0;

    // Determine image from backend or fallback to category defaults
    let displayImage = '/images/Placeholder.png';

    if (product.photos && product.photos.length > 0) {
        displayImage = `https://diyamgaz.onrender.com${product.photos[0]}`;
    } else if (product.category === 'GAZ') {
        displayImage = '/premium_gas_bottle_senegal_1772229211062.png';
    } else if (product.category === 'EAU') {
        displayImage = '/premium_water_bottle_1772227577044.png';
    } else if (product.category === 'CHARBON') {
        displayImage = '/premium_charcoal_1772227593891.png';
    }

    return (
        <div className="fade-in" style={{ padding: '40px 20px 80px', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ marginBottom: '30px' }}>
                <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', fontWeight: '500', transition: 'var(--transition-fast)' }} onMouseEnter={(e) => e.target.style.color = 'var(--text-main)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}>
                    <span style={{ fontSize: '18px' }}>←</span> Retour à la boutique
                </Link>
            </div>

            <div className="bento-card fade-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '0', overflow: 'hidden', padding: 0 }}>
                {/* Visual Section */}
                <div style={{ background: 'var(--bg-tertiary)', padding: '60px 40px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '500px' }}>
                    <img
                        style={{ filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.15))', mixBlendMode: 'multiply', maxWidth: '100%', maxHeight: '450px', objectFit: 'contain' }}
                        src={displayImage}
                        alt={product.title}
                        className="floating"
                    />
                </div>

                {/* Content Section */}
                <div style={{ padding: '60px 40px', display: 'flex', flexDirection: 'column', background: 'var(--bg-secondary)' }}>
                    <div style={{ marginBottom: 'auto' }}>
                        <span style={{ display: 'inline-block', background: 'var(--primary-gradient)', color: 'white', fontWeight: '600', letterSpacing: '1px', fontSize: '12px', textTransform: 'uppercase', padding: '6px 12px', borderRadius: '100px', marginBottom: '24px' }}>
                            {product.category}
                        </span>

                        <h1 style={{ fontSize: '42px', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 16px 0', lineHeight: '1.1', letterSpacing: '-1px' }}>
                            {product.title}
                        </h1>

                        <div style={{ fontSize: '36px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '32px', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                            {product.price} <span style={{ fontSize: '18px', color: 'var(--text-muted)', fontWeight: '600' }}>FCFA</span>
                        </div>

                        <p style={{ fontSize: '16px', lineHeight: '1.6', color: 'var(--text-muted)', marginBottom: '40px' }}>
                            {product.description}
                            <br /><br />
                            Ce produit est livré avec le plus grand soin par les équipes de <strong>DIYAMGAZ</strong> directement à votre domicile dans les plus brefs délais. Profitez d'une qualité premium et d'un service client à votre écoute.
                        </p>
                    </div>

                    <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid var(--bento-border)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>Quantité</span>
                            <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-tertiary)', borderRadius: '12px', padding: '4px' }}>
                                <button onClick={decrement} style={{ width: '36px', height: '36px', borderRadius: '8px', border: 'none', background: 'white', color: 'var(--text-main)', fontSize: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--bento-shadow)' }}>-</button>
                                <span style={{ width: '40px', textAlign: 'center', fontWeight: '600', fontSize: '16px' }}>{quantity}</span>
                                <button onClick={increment} style={{ width: '36px', height: '36px', borderRadius: '8px', border: 'none', background: 'white', color: 'var(--text-main)', fontSize: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--bento-shadow)' }}>+</button>
                            </div>
                        </div>

                        {quantityInCart > 0 && (
                            <div style={{ marginTop: '12px', padding: '12px', background: '#f8fafc', borderRadius: '12px', color: '#0f172a', fontWeight: 'bold', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                                🛒 Vous avez déjà {quantityInCart} article(s) de ce produit dans votre panier
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                            <button
                                onClick={handleBuy}
                                style={{
                                    flex: 2, padding: '16px', borderRadius: '12px', border: 'none',
                                    background: added ? '#10b981' : 'var(--text-main)', color: 'white',
                                    fontSize: '16px', fontWeight: '600', cursor: 'pointer',
                                    transition: 'var(--transition-fast)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                    boxShadow: added ? '0 10px 25px rgba(16, 185, 129, 0.4)' : '0 10px 25px rgba(0, 0, 0, 0.2)'
                                }}
                                onMouseEnter={(e) => { if (!added) e.currentTarget.style.transform = 'translateY(-2px)' }}
                                onMouseLeave={(e) => { if (!added) e.currentTarget.style.transform = 'translateY(0)' }}
                            >
                                {added ? '✓ Ajouté au panier' : <><ShoppingCart size={20} /> Ajouter {quantity} au panier - {(product.price * quantity).toLocaleString()} FCFA</>}
                            </button>

                            <a
                                href={`https://wa.me/221711425492?text=Bonjour,%20je%20souhaite%20commander%20${quantity}%20x%20${encodeURIComponent(product.title)}%0A%0ALien:%20${encodeURIComponent(window.location.href)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    flex: 1, padding: '16px', borderRadius: '12px', background: '#25D366', color: 'white',
                                    textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                    fontSize: '15px', fontWeight: '600', transition: 'var(--transition-fast)',
                                    boxShadow: '0 10px 25px rgba(37, 211, 102, 0.3)'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                                WhatsApp
                            </a>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></span>
                            En stock et prêt à être expédié
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
