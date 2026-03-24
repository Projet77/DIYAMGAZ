import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, SafeAreaView, Dimensions, ActivityIndicator, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ImageCarousel from '../components/ImageCarousel';
import Footer from '../components/Footer';
import { api } from '../api/config';
import { useCart } from '../context/CartContext';

const CATEGORIES = ['TOUS', 'GAZ', 'EAU', 'CHARBON', 'ACCESSOIRES'];
const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
    const [activeTab, setActiveTab] = useState('TOUS');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    
    const { addToCart, getCartCount } = useCart();
    const cartCount = getCartCount();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await api.get('/products');
            setProducts(response.data.data || []);
            setLoading(false);
        } catch (error) {
            console.error("Erreur de récupération des produits :", error);
            setLoading(false);
        }
    };

    const filteredProducts = products.filter(p => {
        const matchCategory = activeTab === 'TOUS' || p.category === activeTab;
        const searchTarget = p.title || p.name || '';
        const matchSearch = searchTarget.toLowerCase().includes(searchQuery.toLowerCase());
        return matchCategory && matchSearch;
    });

    const renderProduct = (item) => {
        const title = item.title || item.name;
        
        let displayImage = null;
        if (item.photos && item.photos.length > 0) {
            displayImage = encodeURI(`https://diyamgaz.onrender.com${item.photos[0]}`);
        } else if (item.images && item.images.length > 0) {
            displayImage = encodeURI(`https://diyamgaz.onrender.com${item.images[0]}`);
        } else if (item.category === 'GAZ') {
             displayImage = encodeURI(`https://diyamgaz.onrender.com/images/premium_gas_bottle_senegal_1772229211062.png`);
        }

        return (
            <TouchableOpacity 
                key={item.id.toString()} 
                style={styles.card} 
                onPress={() => navigation.navigate('ProductDetail', { product: item })}
            >
                <View style={styles.imageContainer}>
                    {displayImage ? (
                        <Image 
                            source={{ uri: displayImage }} 
                            style={styles.cardImage} 
                            resizeMode="contain"
                        />
                    ) : (
                        <View style={styles.noImage}>
                            <Text style={styles.noImageText}>DIYAMGAZ</Text>
                        </View>
                    )}
                </View>
                <View style={styles.infoContainer}>
                    <Text style={styles.name} numberOfLines={2}>{title}</Text>
                    
                    <View style={styles.priceRow}>
                        <Text style={styles.price}>{item.price} FCFA</Text>
                        {item.oldPrice && <Text style={styles.oldPrice}>{item.oldPrice}</Text>}
                    </View>

                    <TouchableOpacity style={styles.buyBtn} onPress={() => addToCart(item, 1)}>
                        <Text style={styles.buyText}>+ Ajouter</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Header with Search */}
            <View style={styles.header}>
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
                    {cartCount > 0 && (
                        <View style={styles.badgeContainer}>
                            <Text style={styles.badgeText}>{cartCount}</Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <TextInput 
                    style={styles.searchInput}
                    placeholder="Chercher un produit... (ex: Gaz)"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

                {/* Hero Section */}
                <View style={styles.heroMain}>
                    <Text style={styles.heroTitle}>Le gaz, l'eau et le charbon,{"\n"}livrés avec élégance.</Text>
                    <Text style={styles.hook}>Une expérience premium, directement chez vous.</Text>
                    <Text style={styles.heroDesc}>
                        Fini les tracas des bouteilles vides. DIYAMGAZ redéfinit la livraison à domicile avec un service rapide, fiable et moderne. Quelques clics suffisent.
                    </Text>
                </View>

                {/* Carousel Visual */}
                <View style={styles.carouselWrapper}>
                    <ImageCarousel interval={4000} />
                </View>

                {/* Categories Tabs */}
                <View style={styles.categoriesSection}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsContainer}>
                        {CATEGORIES.map(cat => (
                            <TouchableOpacity
                                key={cat}
                                style={[styles.tabBtn, activeTab === cat && styles.activeTab]}
                                onPress={() => setActiveTab(cat)}
                            >
                                <Text style={[styles.tabText, activeTab === cat && styles.activeTabText]}>
                                    {cat}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Products Grid */}
                <View style={styles.productsSection}>
                    {loading ? (
                        <ActivityIndicator style={{marginTop: 20}} size="large" color="#f7931e" />
                    ) : filteredProducts.length === 0 ? (
                        <Text style={{textAlign: 'center', marginTop: 20, color: '#64748b'}}>Aucun produit trouvé.</Text>
                    ) : (
                        <View style={styles.productsGridContainer}>
                            {filteredProducts.map(product => renderProduct(product))}
                        </View>
                    )}
                </View>

                {/* Bento Partners Section */}
                <View style={styles.partnersWrapper}>
                    <Text style={styles.sectionHeading}>Nos Partenaires de Confiance</Text>
                    <View style={styles.partnersGrid}>
                        <View style={[styles.partnerBadge, { borderColor: '#f7931e', backgroundColor: '#fff7ed' }]}>
                            <Ionicons name="flame" size={24} color="#f7931e" style={{ marginBottom: 5 }} />
                            <Text style={styles.partnerCatTitle}>GAZ</Text>
                            <Text style={styles.partnerList}>TOTAL, Lobbou, Oryx</Text>
                        </View>
                        <View style={[styles.partnerBadge, { borderColor: '#3b82f6', backgroundColor: '#eff6ff' }]}>
                            <Ionicons name="water" size={24} color="#3b82f6" style={{ marginBottom: 5 }} />
                            <Text style={styles.partnerCatTitle}>EAU</Text>
                            <Text style={styles.partnerList}>Kirène, Séo, Miya</Text>
                        </View>
                    </View>
                </View>

                <Footer />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#f8fafc' },
    container: { flex: 1, paddingHorizontal: 20 },
    // Header & Search
    header: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingVertical: 10, paddingHorizontal: 20, backgroundColor: '#f8fafc'
    },
    logo: { height: 40, width: 120 },
    cartButton: { 
        backgroundColor: '#ffffff', paddingVertical: 8, paddingHorizontal: 16, 
        borderRadius: 20, borderWidth: 1, borderColor: '#e2e8f0',
        flexDirection: 'row', alignItems: 'center'
    },
    cartText: { color: '#0f172a', fontWeight: 'bold' },
    badgeContainer: {
        backgroundColor: '#f7931e',
        borderRadius: 10,
        paddingHorizontal: 6,
        paddingVertical: 2,
        marginLeft: 6,
        minWidth: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
    searchContainer: { paddingHorizontal: 20, marginBottom: 15 },
    searchInput: { 
        backgroundColor: '#fff', borderRadius: 25, paddingVertical: 12, paddingHorizontal: 20,
        borderWidth: 1, borderColor: '#e2e8f0', fontSize: 14, color: '#0f172a',
        elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2
    },
    
    // Welcome / Hero
    heroMain: {
        backgroundColor: '#ffffff', borderRadius: 24, padding: 24, marginBottom: 20, borderWidth: 1, borderColor: '#e2e8f0',
        elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4,
    },
    heroTitle: { fontSize: 26, fontWeight: '800', color: '#0f172a', marginBottom: 12, letterSpacing: -0.5 },
    hook: { fontSize: 15, color: '#f7931e', fontWeight: '600', marginBottom: 10 },
    heroDesc: { fontSize: 13, color: '#64748b', lineHeight: 20 },
    carouselWrapper: { elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },
    
    // Categories
    categoriesSection: { marginVertical: 20 },
    tabsContainer: { backgroundColor: '#ffffff', padding: 5, borderRadius: 30, borderWidth: 1, borderColor: '#e2e8f0' },
    tabBtn: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 25, marginRight: 5 },
    activeTab: { backgroundColor: '#ffffff', elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, borderWidth: 1, borderColor: '#e2e8f0' },
    tabText: { color: '#64748b', fontWeight: '500' },
    activeTabText: { color: '#0f172a', fontWeight: '700' },
    
    // Products Grid
    productsSection: { marginBottom: 30 },
    productsGridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    card: {
        width: '48%', backgroundColor: '#fff', marginBottom: 15, borderRadius: 16, borderWidth: 1,
        borderColor: '#e2e8f0', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05, shadowRadius: 4, overflow: 'hidden',
    },
    imageContainer: { height: 130, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center', padding: 10 },
    cardImage: { width: '100%', height: '100%' },
    noImage: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: '#e2e8f0', borderRadius: 8 },
    noImageText: { color: '#94a3b8', fontWeight: 'bold', fontSize: 12 },
    infoContainer: { padding: 12, justifyContent: 'space-between', flex: 1 },
    name: { fontSize: 13, fontWeight: '700', color: '#0f172a', marginBottom: 5 },
    priceRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, flexWrap: 'wrap' },
    price: { fontSize: 14, color: '#f7931e', fontWeight: 'bold', marginRight: 8 },
    oldPrice: { fontSize: 11, color: '#94a3b8', textDecorationLine: 'line-through' },
    buyBtn: { backgroundColor: '#0f172a', paddingVertical: 8, borderRadius: 100, alignItems: 'center', marginTop: 'auto' },
    buyText: { color: '#fff', fontSize: 12, fontWeight: '600' },

    // Partners
    partnersWrapper: { marginTop: 10, marginBottom: 30 },
    sectionHeading: { fontSize: 18, fontWeight: '800', color: '#0f172a', marginBottom: 15, paddingHorizontal: 5 },
    partnersGrid: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
    partnerBadge: { 
        flex: 1, padding: 15, borderRadius: 16, borderWidth: 1, 
        alignItems: 'center', justifyContent: 'center',
        elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2
    },
    partnerCatTitle: { fontSize: 13, fontWeight: 'bold', color: '#0f172a', marginBottom: 4 },
    partnerList: { fontSize: 11, color: '#64748b', textAlign: 'center', lineHeight: 16 }
});
