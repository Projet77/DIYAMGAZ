import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';

const ZONES = [
    { id: 'zone1', name: 'Zone 1 (Rufisque, Kounoune...)', price: 500 },
    { id: 'zone2', name: 'Zone 2 (Zac Mbao, Diakhaye...)', price: 1000 },
    { id: 'zone3', name: 'Zone 3 (Keur Ndiaye lo, Bambilor...)', price: 1500 }
];

const Checkout = () => {
    const { cartItems, getCartTotal, clearCart } = useCart();
    const [selectedZone, setSelectedZone] = useState(ZONES[0].price);
    const navigate = useNavigate();

    const cartSubtotal = getCartTotal();
    const total = cartSubtotal + selectedZone;

    if (cartItems.length === 0) {
        return (
            <div className="checkout-page fade-in" style={{ textAlign: 'center', padding: '100px 0' }}>
                <h2>Votre panier est vide</h2>
                <p style={{ margin: '20px 0', color: 'var(--text-muted)' }}>Vous n'avez pas encore ajouté de produits à votre panier.</p>
                <Link to="/" className="buy-btn" style={{ textDecoration: 'none', display: 'inline-block' }}>Retour à la boutique</Link>
            </div>
        );
    }

    return (
        <div className="checkout-page fade-in">
            <h2>Finalisation de la commande</h2>

            <div className="checkout-container glass-panel">
                <div className="order-summary">
                    <h3>Résumé du panier</h3>
                    {cartItems.map((item, index) => (
                        <div key={index} className="summary-item">
                            <span>{item.title} (x{item.quantity})</span>
                            <span>{item.price * item.quantity} FCFA</span>
                        </div>
                    ))}
                    <div className="summary-item subtotal">
                        <span>Sous-total</span>
                        <span>{cartSubtotal} FCFA</span>
                    </div>
                </div>

                <div className="delivery-zones">
                    <h3>Zone de Livraison</h3>
                    <p className="zone-info">Choisissez votre zone pour calculer les frais de port :</p>

                    <div className="zone-options">
                        {ZONES.map(zone => (
                            <label
                                key={zone.id}
                                className={`zone-card ${selectedZone === zone.price ? 'selected' : ''}`}
                            >
                                <input
                                    type="radio"
                                    name="deliveryZone"
                                    value={zone.price}
                                    checked={selectedZone === zone.price}
                                    onChange={() => setSelectedZone(zone.price)}
                                />
                                <div className="zone-details">
                                    <span className="zone-name">{zone.name}</span>
                                    <span className="zone-price">+{zone.price} FCFA</span>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="total-section">
                    <h3>Total à payer : <span className="highlight-price">{total} FCFA</span></h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <button
                            className="confirm-btn pulse-anim"
                            onClick={async () => {
                                try {
                                    const response = await fetch('https://diyamgaz.onrender.com/api/orders', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({
                                            total_amount: cartSubtotal,
                                            delivery_zone: ZONES.find(z => z.price === selectedZone)?.name,
                                            delivery_fee: selectedZone
                                        })
                                    });
                                    if (response.ok) {
                                        alert('Commande confirmée avec succès !');
                                    } else {
                                        alert('Erreur lors de la confirmation');
                                    }
                                } catch (error) {
                                    console.error('Error:', error);
                                    alert('Erreur réseau');
                                }
                            }}
                            style={{ width: '100%', padding: '16px', borderRadius: '12px', background: 'var(--text-main)', color: 'white', border: 'none', fontSize: '16px', fontWeight: '600', cursor: 'pointer', transition: 'var(--transition-fast)' }}
                        >
                            Confirmer la commande
                        </button>

                        <a
                            href={`https://wa.me/221711425492?text=Bonjour,%20je%20souhaite%20finaliser%20ma%20commande.%0A%0A*Panier:*%0A${cartItems.map(item => `- ${item.quantity}x ${item.title}`).join('%0A')}%0A%0A*Zone de livraison:* ${ZONES.find(z => z.price === selectedZone)?.name || ''}%0A*Total:* ${total} FCFA`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                width: '100%', padding: '16px', borderRadius: '12px', background: '#25D366', color: 'white',
                                textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                fontSize: '15px', fontWeight: '600', transition: 'var(--transition-fast)',
                                boxShadow: '0 4px 15px rgba(37, 211, 102, 0.2)'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                            Commander via WhatsApp
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
