import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, SafeAreaView, Linking } from 'react-native';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';

export default function ProductDetailScreen({ route, navigation }) {
    const { product } = route.params;
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);

    const increment = () => setQuantity(prev => prev + 1);
    const decrement = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

    const handleBuy = () => {
        addToCart(product, quantity);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    const handleWhatsApp = () => {
        const title = product.title || product.name;
        const message = `Bonjour, je souhaite commander ${quantity} x ${title}`;
        const url = `whatsapp://send?phone=221711425492&text=${encodeURIComponent(message)}`;
        Linking.openURL(url).catch(() => {
            alert("Veuillez installer WhatsApp pour utiliser cette fonctionnalité.");
        });
    };

    const title = product.title || product.name;
    let displayImage = null;
    if (product.photos && product.photos.length > 0) {
        displayImage = `http://192.168.1.116:5000${product.photos[0]}`;
    } else if (product.images && product.images.length > 0) {
        displayImage = `http://192.168.1.116:5000${product.images[0]}`;
    } else if (product.category === 'GAZ') {
         displayImage = `http://192.168.1.116:5000/premium_gas_bottle_senegal_1772229211062.png`;
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backText}>← Retour</Text>
                </TouchableOpacity>
                <Image 
                    source={require('../../assets/images/logo.png')} 
                    style={styles.logo} 
                    resizeMode="contain" 
                />
                <TouchableOpacity 
                    style={styles.cartButton}
                    onPress={() => navigation.navigate('PanierTab')}
                >
                    <Text style={styles.cartText}>Panier</Text>
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
                {/* Section Visuelle */}
                <View style={styles.imageSection}>
                    {displayImage ? (
                        <Image 
                            source={{ uri: displayImage }} 
                            style={styles.image} 
                            resizeMode="contain"
                        />
                    ) : (
                        <View style={styles.noImage}>
                            <Text style={styles.noImageText}>DIYAMGAZ</Text>
                        </View>
                    )}
                </View>

                {/* Section Contenu */}
                <View style={styles.contentSection}>
                    <View style={styles.categoryBadge}>
                        <Text style={styles.categoryText}>{product.category}</Text>
                    </View>

                    <Text style={styles.title}>{title}</Text>
                    
                    <View style={styles.priceContainer}>
                        <Text style={styles.price}>{product.price}</Text>
                        <Text style={styles.currency}>FCFA</Text>
                    </View>

                    <Text style={styles.description}>
                        {product.description || "Aucune description fournie pour ce produit."}{"\n\n"}
                        Ce produit est livré avec le plus grand soin par les équipes de DIYAMGAZ directement à votre domicile. Profitez d'une qualité premium.
                    </Text>

                    {/* Bloc Action (Quantité + Boutons) */}
                    <View style={styles.actionBlock}>
                        <View style={styles.quantityRow}>
                            <Text style={styles.quantityLabel}>Quantité</Text>
                            <View style={styles.quantityControls}>
                                <TouchableOpacity onPress={decrement} style={styles.qtyBtn}>
                                    <Text style={styles.qtyBtnText}>-</Text>
                                </TouchableOpacity>
                                <Text style={styles.qtyValue}>{quantity}</Text>
                                <TouchableOpacity onPress={increment} style={styles.qtyBtn}>
                                    <Text style={styles.qtyBtnText}>+</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.buttonsRow}>
                            <TouchableOpacity 
                                style={[styles.addToCartBtn, added && styles.addedBtn]} 
                                onPress={handleBuy}
                            >
                                <Text style={styles.addToCartText}>
                                    {added ? '✓ Ajouté' : `Ajouter - ${(product.price * quantity)} FCFA`}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.whatsappBtn} onPress={handleWhatsApp}>
                                <Text style={styles.whatsappText}>WhatsApp</Text>
                            </TouchableOpacity>
                        </View>
                        
                        <View style={styles.stockInfo}>
                            <View style={styles.dot} />
                            <Text style={styles.stockText}>En stock et prêt à être expédié</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#f8fafc' },
    container: { flex: 1 },
    header: { 
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingTop: 25, paddingBottom: 10, paddingHorizontal: 20, backgroundColor: '#f8fafc' 
    },
    logo: { height: 40, width: 100 },
    cartButton: { backgroundColor: '#ffffff', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, borderWidth: 1, borderColor: '#e2e8f0' },
    cartText: { color: '#0f172a', fontWeight: 'bold' },
    backButton: { paddingVertical: 5 },
    backText: { fontSize: 16, color: '#64748b', fontWeight: '500' },
    
    imageSection: {
        backgroundColor: '#f1f5f9',
        height: 350,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    image: { width: '100%', height: '100%' },
    noImage: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: '#e2e8f0', borderRadius: 16 },
    noImageText: { color: '#94a3b8', fontWeight: 'bold' },

    contentSection: {
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 25,
        marginTop: -30,
        minHeight: 400
    },
    categoryBadge: {
        backgroundColor: '#0f172a',
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginBottom: 15
    },
    categoryText: { color: '#ffffff', fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase' },
    title: { fontSize: 26, fontWeight: '800', color: '#0f172a', marginBottom: 10, letterSpacing: -0.5 },
    priceContainer: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 20 },
    price: { fontSize: 28, fontWeight: 'bold', color: '#f7931e' },
    currency: { fontSize: 16, color: '#64748b', fontWeight: '600', marginLeft: 5 },
    description: { fontSize: 14, color: '#64748b', lineHeight: 22, marginBottom: 30 },

    actionBlock: {
        backgroundColor: '#ffffff',
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        elevation: 2,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4
    },
    quantityRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    quantityLabel: { fontWeight: '600', color: '#0f172a', fontSize: 15 },
    quantityControls: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8fafc', borderRadius: 12, padding: 4 },
    qtyBtn: { width: 36, height: 36, backgroundColor: '#ffffff', borderRadius: 8, justifyContent: 'center', alignItems: 'center', elevation: 1 },
    qtyBtnText: { fontSize: 20, color: '#0f172a', fontWeight: 'bold' },
    qtyValue: { width: 40, textAlign: 'center', fontSize: 16, fontWeight: 'bold', color: '#0f172a' },

    buttonsRow: { flexDirection: 'row', gap: 10, marginBottom: 15 },
    addToCartBtn: {
        flex: 2,
        backgroundColor: '#0f172a',
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center'
    },
    addedBtn: { backgroundColor: '#10b981' },
    addToCartText: { color: '#ffffff', fontSize: 14, fontWeight: 'bold' },
    whatsappBtn: {
        flex: 1,
        backgroundColor: '#25D366',
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center'
    },
    whatsappText: { color: '#ffffff', fontSize: 14, fontWeight: 'bold' },

});
