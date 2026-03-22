import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Image, TouchableOpacity, Dimensions } from 'react-native';
import { api } from '../api/config';
import { useCart } from '../context/CartContext';

const { width } = Dimensions.get('window');

export default function ShopScreen({ route, navigation }) {
    const { addToCart } = useCart();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Récupérer la catégorie passée en paramètre (depuis Home), "TOUS" par défaut
    const categoryFilter = route?.params?.category || 'TOUS';

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

    const filteredProducts = categoryFilter === 'TOUS'
        ? products
        : products.filter(p => p.category === categoryFilter);

    const renderProduct = ({ item }) => {
        const title = item.title || item.name;
        
        let displayImage = null;
        if (item.photos && item.photos.length > 0) {
            displayImage = `http://192.168.1.116:5000${item.photos[0]}`;
        } else if (item.images && item.images.length > 0) {
            displayImage = `http://192.168.1.116:5000${item.images[0]}`;
        } else if (item.category === 'GAZ') {
             displayImage = `http://192.168.1.116:5000/premium_gas_bottle_senegal_1772229211062.png`;
        }

        return (
            <TouchableOpacity 
                style={styles.card} 
                onPress={() => navigation.navigate('ProductDetail', { product: item })}
            >
                <View style={styles.imageContainer}>
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
                <View style={styles.infoContainer}>
                    <Text style={styles.name} numberOfLines={2}>{title}</Text>
                    
                    <View style={styles.priceRow}>
                        <Text style={styles.price}>{item.price} FCFA</Text>
                        {item.oldPrice && <Text style={styles.oldPrice}>{item.oldPrice} FCFA</Text>}
                    </View>

                    {/* Bouton Acheter qui mime le web (.buy-btn) */}
                    <TouchableOpacity style={styles.buyBtn} onPress={() => addToCart(item, 1)}>
                        <Text style={styles.buyText}>+ Ajouter</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        );
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#f7931e" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerFilter}>
                <Text style={styles.filterText}>RÉSULTATS : {categoryFilter} ({filteredProducts.length})</Text>
            </View>
            <FlatList
                data={filteredProducts}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderProduct}
                numColumns={2}
                contentContainerStyle={styles.list}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    headerFilter: {
        padding: 15,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },
    filterText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#64748b',
    },
    list: {
        padding: 10,
    },
    center: {
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    card: {
        flex: 1,
        backgroundColor: '#fff',
        margin: 8,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        overflow: 'hidden',
        maxWidth: (width / 2) - 20, // deux colonnes
    },
    imageContainer: {
        height: 140,
        backgroundColor: '#f1f5f9',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    noImage: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e0e0e0',
    },
    infoContainer: {
        padding: 15,
        justifyContent: 'space-between',
        flex: 1,
    },
    name: {
        fontSize: 14,
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: 5,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        flexWrap: 'wrap',
    },
    price: {
        fontSize: 16,
        color: '#f7931e', // primary color DIYAMGAZ
        fontWeight: 'bold',
        marginRight: 8,
    },
    oldPrice: {
        fontSize: 12,
        color: '#94a3b8',
        textDecorationLine: 'line-through',
    },
    buyBtn: {
        backgroundColor: '#0f172a',
        paddingVertical: 10,
        borderRadius: 100,
        alignItems: 'center',
        marginTop: 'auto',
    },
    buyText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '600',
    }
});
