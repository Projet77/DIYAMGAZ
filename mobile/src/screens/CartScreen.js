import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Image, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';

const ZONES = [
    { id: 'zone1', name: 'Zone 1 (Rufisque, Kounoune...)', price: 500 },
    { id: 'zone2', name: 'Zone 2 (Zac Mbao, Diakhaye...)', price: 1000 },
    { id: 'zone3', name: 'Zone 3 (Keur Ndiaye lo, Bambilor...)', price: 1500 }
];

export default function CartScreen({ navigation }) {
    const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
    const [selectedZone, setSelectedZone] = useState(ZONES[0].price);

    const cartSubtotal = getCartTotal();
    const total = cartSubtotal + selectedZone;

    const handleWhatsAppOrder = () => {
        const zoneName = ZONES.find(z => z.price === selectedZone)?.name || '';
        const itemsList = cartItems.map(item => `- ${item.quantity}x ${item.title || item.name}`).join('%0A');
        
        const message = `Bonjour, je souhaite finaliser ma commande.%0A%0A*Panier:*%0A${itemsList}%0A%0A*Zone de livraison:* ${zoneName}%0A*Total:* ${total} FCFA`;
        const url = `whatsapp://send?phone=221711425492&text=${message}`;
        
        Linking.openURL(url).catch(() => {
            alert("Veuillez installer WhatsApp pour utiliser cette fonctionnalité.");
        });
    };

    const renderCartItem = (item) => {
        const title = item.title || item.name;
        let displayImage = null;
        if (item.photos && item.photos.length > 0) {
            displayImage = encodeURI(`https://diyamgaz.onrender.com${item.photos[0]}`);
        } else if (item.images && item.images.length > 0) {
            displayImage = encodeURI(`https://diyamgaz.onrender.com${item.images[0]}`);
        } else if (item.category === 'GAZ') {
             displayImage = encodeURI(`https://diyamgaz.onrender.com/images/premium_gas_bottle_senegal_1772229211062.png`);
        }

        const itemId = item._id || item.id || Math.random().toString();
        
        return (
            <View key={itemId.toString()} style={styles.cartItem}>
                <View style={styles.itemImageContainer}>
                    {displayImage ? (
                        <Image source={{ uri: displayImage }} style={styles.itemImage} resizeMode="contain" />
                    ) : (
                        <Ionicons name="image-outline" size={30} color="#cbd5e1" />
                    )}
                </View>
                
                <View style={styles.itemDetails}>
                    <Text style={styles.itemTitle} numberOfLines={2}>{title}</Text>
                    <Text style={styles.itemPrice}>{item.price} FCFA</Text>
                    
                    <View style={styles.quantityRow}>
                        <TouchableOpacity 
                            style={styles.qtyBtn} 
                            onPress={() => updateQuantity(itemId, item.quantity - 1)}
                        >
                            <Text style={styles.qtyBtnText}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.qtyText}>{item.quantity}</Text>
                        <TouchableOpacity 
                            style={styles.qtyBtn} 
                            onPress={() => updateQuantity(itemId, item.quantity + 1)}
                        >
                            <Text style={styles.qtyBtnText}>+</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                
                <TouchableOpacity 
                    style={styles.removeBtn} 
                    onPress={() => removeFromCart(itemId)}
                >
                    <Ionicons name="trash-outline" size={20} color="#ef4444" />
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Text style={styles.backText}>← Retour</Text>
                </TouchableOpacity>
                <Image 
                    source={require('../../assets/images/logo.png')} 
                    style={styles.logo} 
                    resizeMode="contain" 
                />
                <View style={{ width: 60 }} />
            </View>

            <ScrollView contentContainerStyle={styles.container}>
                {cartItems.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="cart-outline" size={80} color="#cbd5e1" />
                        <Text style={styles.emptyText}>Votre panier est vide</Text>
                        <Text style={styles.emptySubtext}>Vous n'avez pas encore ajouté de produits. Explorez notre boutique !</Text>
                        
                        <TouchableOpacity 
                            style={styles.shopBtn}
                            onPress={() => navigation.navigate('AccueilTab')}
                        >
                            <Text style={styles.shopBtnText}>Continuer mes achats</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.cartContent}>
                        <View style={styles.itemsList}>
                            {cartItems.map(renderCartItem)}
                        </View>
                        
                        <View style={styles.deliveryZones}>
                            <Text style={styles.zonesTitle}>Zone de Livraison</Text>
                            <Text style={styles.zonesInfo}>Choisissez votre zone pour calculer les frais :</Text>
                            
                            {ZONES.map(zone => (
                                <TouchableOpacity 
                                    key={zone.id} 
                                    style={[styles.zoneCard, selectedZone === zone.price && styles.zoneCardSelected]}
                                    onPress={() => setSelectedZone(zone.price)}
                                >
                                    <View style={styles.radioContainer}>
                                        <View style={[styles.radioButton, selectedZone === zone.price && styles.radioButtonSelected]} />
                                    </View>
                                    <View style={styles.zoneDetails}>
                                        <Text style={[styles.zoneName, selectedZone === zone.price && styles.zoneTextSelected]}>{zone.name}</Text>
                                        <Text style={styles.zonePrice}>+{zone.price} FCFA</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                        
                        <View style={styles.summaryBox}>
                            <Text style={styles.summaryTitle}>Résumé de la commande</Text>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>Sous-total</Text>
                                <Text style={styles.summaryValue}>{cartSubtotal} FCFA</Text>
                            </View>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>Livraison</Text>
                                <Text style={styles.summaryValue}>{selectedZone} FCFA</Text>
                            </View>
                            <View style={[styles.summaryRow, styles.totalRow]}>
                                <Text style={styles.totalLabel}>Total à payer</Text>
                                <Text style={styles.totalValue}>{total} FCFA</Text>
                            </View>

                            <TouchableOpacity style={styles.checkoutBtn} onPress={() => alert("Confirmation intégrée API à venir.")}>
                                <Text style={styles.checkoutText}>Confirmer la commande</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.whatsappBtn} onPress={handleWhatsAppOrder}>
                                <Ionicons name="logo-whatsapp" size={20} color="#ffffff" style={{ marginRight: 8 }} />
                                <Text style={styles.whatsappText}>Commander via WhatsApp</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                
                <Footer />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#f8fafc' },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingTop: 25, paddingBottom: 10, paddingHorizontal: 20, backgroundColor: '#f8fafc',
        borderBottomWidth: 1, borderBottomColor: '#e2e8f0',
    },
    logo: { height: 40, width: 100 },
    backBtn: { paddingVertical: 5 },
    backText: { fontSize: 16, color: '#64748b', fontWeight: '500' },
    container: { flexGrow: 1 },
    
    // Empty state
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40, minHeight: 400 },
    emptyText: { fontSize: 22, fontWeight: 'bold', color: '#0f172a', marginTop: 20, marginBottom: 10 },
    emptySubtext: { fontSize: 14, color: '#64748b', textAlign: 'center', lineHeight: 22, marginBottom: 30 },
    shopBtn: { backgroundColor: '#0f172a', paddingVertical: 14, paddingHorizontal: 30, borderRadius: 12 },
    shopBtnText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },

    // Cart Content
    cartContent: { padding: 20 },
    itemsList: { marginBottom: 20 },
    cartItem: {
        flexDirection: 'row', backgroundColor: '#ffffff', borderRadius: 16, padding: 15, marginBottom: 15,
        borderWidth: 1, borderColor: '#e2e8f0', elevation: 2, shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4
    },
    itemImageContainer: {
        width: 80, height: 80, backgroundColor: '#f1f5f9', borderRadius: 12,
        justifyContent: 'center', alignItems: 'center', marginRight: 15
    },
    itemImage: { width: '80%', height: '80%' },
    itemDetails: { flex: 1, justifyContent: 'center' },
    itemTitle: { fontSize: 15, fontWeight: 'bold', color: '#0f172a', marginBottom: 5 },
    itemPrice: { fontSize: 15, fontWeight: '600', color: '#f7931e', marginBottom: 10 },
    quantityRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8fafc', alignSelf: 'flex-start', borderRadius: 8, padding: 2 },
    qtyBtn: { width: 28, height: 28, backgroundColor: '#ffffff', borderRadius: 6, justifyContent: 'center', alignItems: 'center', elevation: 1 },
    qtyBtnText: { fontSize: 16, fontWeight: 'bold', color: '#0f172a' },
    qtyText: { width: 30, textAlign: 'center', fontSize: 14, fontWeight: 'bold', color: '#0f172a' },
    removeBtn: { padding: 5 },

    // Delivery zones
    deliveryZones: { marginBottom: 20 },
    zonesTitle: { fontSize: 18, fontWeight: 'bold', color: '#0f172a', marginBottom: 5 },
    zonesInfo: { fontSize: 13, color: '#64748b', marginBottom: 15 },
    zoneCard: { 
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff',
        borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12, padding: 15, marginBottom: 10
    },
    zoneCardSelected: { borderColor: '#f7931e', backgroundColor: '#fff9f0' },
    radioContainer: { marginRight: 15 },
    radioButton: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#cbd5e1', alignItems: 'center', justifyContent: 'center' },
    radioButtonSelected: { borderColor: '#f7931e', backgroundColor: '#f7931e', borderWidth: 6 },
    zoneDetails: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    zoneName: { fontSize: 14, color: '#475569', flex: 1, marginRight: 10 },
    zoneTextSelected: { color: '#0f172a', fontWeight: 'bold' },
    zonePrice: { fontSize: 14, fontWeight: 'bold', color: '#f7931e' },

    // Summary box
    summaryBox: {
        backgroundColor: '#ffffff', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#e2e8f0',
        elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4
    },
    summaryTitle: { fontSize: 18, fontWeight: 'bold', color: '#0f172a', marginBottom: 15 },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    summaryLabel: { fontSize: 14, color: '#64748b' },
    summaryValue: { fontSize: 14, fontWeight: '600', color: '#0f172a' },
    summaryValueBadge: { fontSize: 12, fontWeight: 'bold', color: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
    totalRow: { borderTopWidth: 1, borderTopColor: '#e2e8f0', paddingTop: 15, marginTop: 5, marginBottom: 20 },
    totalLabel: { fontSize: 16, fontWeight: 'bold', color: '#0f172a' },
    totalValue: { fontSize: 20, fontWeight: 'bold', color: '#f7931e' },
    checkoutBtn: { backgroundColor: '#0f172a', paddingVertical: 15, borderRadius: 12, alignItems: 'center', marginBottom: 10 },
    checkoutText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
    whatsappBtn: { flexDirection: 'row', backgroundColor: '#25D366', paddingVertical: 15, borderRadius: 12, alignItems: 'center', justifyContent: 'center', elevation: 2, shadowColor: '#25D366', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4 },
    whatsappText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' }
});
