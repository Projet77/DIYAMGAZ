import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ProductCard = ({ product }) => {
    const { addToCart, cartItems } = useCart();
    const { user } = useAuth();
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);

    // B2B Pricing Logic (15% discount for B2B users)
    const isB2B = user?.role === 'B2B';
    const displayPrice = isB2B ? product.price * 0.85 : product.price;

    const increment = () => setQuantity(prev => prev + 1);
    const decrement = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

    const handleBuy = () => {
        addToCart({ ...product, price: displayPrice }, quantity);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000); // Reset after 2s for demo
    };

    const itemInCart = cartItems ? cartItems.find(item => item.id === product.id) : null;
    const quantityInCart = itemInCart ? itemInCart.quantity : 0;

    // Determine image from backend or default fallback
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
        <div className="product-card slide-up">
            <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="product-image-container">
                    <img src={displayImage} alt={product.title} className="product-image" style={{ mixBlendMode: 'multiply' }} />
                </div>
            </Link>
            <div className="product-info">
                <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <h3>{product.title}</h3>
                </Link>
                <div className="price-tag">
                    {displayPrice} FCFA
                    {isB2B && <span style={{ marginLeft: '10px', fontSize: '10px', background: 'var(--primary-color)', color: 'white', padding: '2px 6px', borderRadius: '4px' }}>Tarif B2B</span>}
                </div>
                <p className="product-desc">{product.description}</p>
                {quantityInCart > 0 && (
                    <div style={{ fontSize: '13px', color: '#10b981', fontWeight: 'bold', marginBottom: '12px' }}>
                        🛒 {quantityInCart} dans le panier
                    </div>
                )}

                <div className="action-row">
                    <div className="quantity-selector">
                        <button onClick={decrement} className="qty-btn">-</button>
                        <span className="qty-value">{quantity}</span>
                        <button onClick={increment} className="qty-btn">+</button>
                    </div>

                    <button
                        onClick={handleBuy}
                        className={`buy-btn ${added ? 'added' : ''}`}
                    >
                        {added ? 'Ajouté ✓' : 'Acheter'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
