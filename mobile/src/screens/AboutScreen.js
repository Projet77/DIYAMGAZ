import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
import Footer from '../components/Footer';

export default function AboutScreen({ navigation }) {
    const { getCartCount } = useCart();
    const cartCount = getCartCount();

    const handleWhatsApp = () => {
        const url = `whatsapp://send?phone=221711425492`;
        Linking.openURL(url).catch(() => {
            alert("Veuillez installer WhatsApp pour utiliser cette fonctionnalité.");
        });
    };

    return (
        <SafeAreaView style={styles.safeArea}>
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

            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                
                {/* Intro Section */}
                <View style={styles.introSection}>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>Notre Histoire</Text>
                    </View>
                    <Text style={styles.title}>
                        À propos de <Text style={styles.titleHighlight}>DIYAMGAZ</Text>
                    </Text>
                    <Text style={styles.subtitle}>
                        Votre partenaire de confiance pour la livraison rapide et sécurisée de gaz butane et d'eau minérale au Sénégal.
                    </Text>
                </View>

                {/* Bento Cards (Mission, Vision, Valeurs) */}
                <View style={styles.bentoContainer}>
                    <View style={styles.bentoCard}>
                        <Text style={styles.bentoTitle}>Notre Mission</Text>
                        <Text style={styles.bentoText}>
                            Simplifier le quotidien des ménages sénégalais en leur offrant un service de livraison express, fiable et professionnel. Nous voulons que l'accès au gaz et à l'eau potable ne soit plus jamais une corvée, mais une expérience fluide.
                        </Text>
                    </View>

                    <View style={styles.bentoCard}>
                        <Text style={styles.bentoTitle}>Notre Vision</Text>
                        <Text style={styles.bentoText}>
                            Devenir le leader incontesté de la distribution de première nécessité à domicile en Afrique de l'Ouest, en innovant constamment avec les technologies numériques pour optimiser notre chaîne logistique.
                        </Text>
                    </View>

                    <View style={styles.bentoCard}>
                        <Text style={styles.bentoTitle}>Nos Valeurs</Text>
                        <Text style={styles.bentoText}>
                            <Text style={styles.bold}>Sécurité :</Text> Manipulation conforme aux normes.{"\n"}
                            <Text style={styles.bold}>Rapidité :</Text> Un réseau de livreurs optimisé.{"\n"}
                            <Text style={styles.bold}>Proximité :</Text> Un service client humain, directement sur WhatsApp ou par téléphone.
                        </Text>
                    </View>
                </View>

                {/* Images Grid */}
                <View style={styles.imagesGrid}>
                    <Image source={require('../../assets/images/propos.png')} style={styles.gridImage} />
                    <Image source={require('../../assets/images/propos2.png')} style={styles.gridImage} />
                    <Image source={require('../../assets/images/propos3.png')} style={styles.gridImage} />
                </View>

                {/* Call to action */}
                <View style={styles.ctaCard}>
                    <Text style={styles.ctaTitle}>Prêt à commander ?</Text>
                    <Text style={styles.ctaText}>
                        Rejoignez des milliers de clients satisfaits. Passez votre commande en quelques clics ou contactez-nous directement !
                    </Text>
                    
                    <View style={styles.btnRow}>
                        <TouchableOpacity 
                            style={styles.btnCatalog}
                            onPress={() => navigation.navigate('BoutiqueTab')}
                        >
                            <Text style={styles.btnCatalogText}>Voir le catalogue</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={styles.btnContact}
                            onPress={handleWhatsApp}
                        >
                            <Ionicons name="logo-whatsapp" size={18} color="#ffffff" style={{ marginRight: 8 }} />
                            <Text style={styles.btnContactText}>Nous contacter</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <Footer />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#f8fafc' },
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
    container: { flexGrow: 1, padding: 20 },
    
    introSection: { alignItems: 'center', marginBottom: 30, paddingTop: 10 },
    badge: {
        backgroundColor: '#0f172a',
        paddingHorizontal: 12, paddingVertical: 6,
        borderRadius: 20, marginBottom: 15
    },
    badgeText: { color: '#ffffff', fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 },
    title: { fontSize: 28, fontWeight: '800', color: '#0f172a', textAlign: 'center', marginBottom: 15 },
    titleHighlight: { color: '#3b82f6' }, // Bleu comme sur le web
    subtitle: { fontSize: 15, color: '#64748b', textAlign: 'center', lineHeight: 24, paddingHorizontal: 10 },

    bentoContainer: { marginBottom: 30, gap: 15 },
    bentoCard: {
        backgroundColor: '#ffffff', borderRadius: 16, padding: 20,
        borderWidth: 1, borderColor: '#e2e8f0',
        elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4
    },
    bentoTitle: { fontSize: 18, fontWeight: '700', color: '#0f172a', marginBottom: 10 },
    bentoText: { fontSize: 14, color: '#64748b', lineHeight: 22 },
    bold: { fontWeight: '700', color: '#334155' },

    imagesGrid: { gap: 15, marginBottom: 30 },
    gridImage: {
        width: '100%', height: 200, borderRadius: 16,
        backgroundColor: '#e2e8f0'
    },

    ctaCard: {
        backgroundColor: '#ffffff', borderRadius: 16, padding: 25, alignItems: 'center',
        borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 20,
        elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4
    },
    ctaTitle: { fontSize: 22, fontWeight: '700', color: '#0f172a', marginBottom: 15 },
    ctaText: { fontSize: 14, color: '#64748b', textAlign: 'center', lineHeight: 22, marginBottom: 25 },
    btnRow: { flexDirection: 'column', width: '100%', gap: 10 },
    btnCatalog: { backgroundColor: '#0f172a', paddingVertical: 14, borderRadius: 12, alignItems: 'center', width: '100%' },
    btnCatalogText: { color: '#ffffff', fontSize: 15, fontWeight: 'bold' },
    btnContact: { flexDirection: 'row', backgroundColor: '#25D366', paddingVertical: 14, borderRadius: 12, alignItems: 'center', justifyContent: 'center', width: '100%' },
    btnContactText: { color: '#ffffff', fontSize: 15, fontWeight: 'bold' }
});
