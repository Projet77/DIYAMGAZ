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
                    <button
                        className="confirm-btn pulse-anim"
                        onClick={async () => {
                            try {
                                const response = await fetch('http://localhost:5000/api/orders', {
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
                    >
                        Confirmer la commande
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
