import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking } from 'react-native';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const Footer = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.footerContainer}>
            {/* Logo et Description */}
            <View style={styles.section}>
                <View style={styles.logoRow}>
                    <Image 
                        source={require('../../assets/images/logo.png')} 
                        style={styles.logo} 
                        resizeMode="contain" 
                    />
                    <Text style={styles.brandName}>DIYAMGAZ</Text>
                </View>
                <Text style={styles.description}>
                    Votre solution numéro un pour la livraison rapide et sécurisée de gaz, d'eau et de charbon directement chez vous.
                </Text>
            </View>

            {/* Contact */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Contact</Text>
                <View style={styles.contactItem}>
                    <Feather name="phone" size={16} color="#3b82f6" />
                    <Text style={styles.contactText}>+221 71 142 54 92</Text>
                </View>
                <View style={styles.contactItem}>
                    <Feather name="mail" size={16} color="#3b82f6" />
                    <Text style={styles.contactText}>contact@diyamgaz.sn</Text>
                </View>
                <View style={styles.contactItem}>
                    <Feather name="map-pin" size={16} color="#3b82f6" />
                    <Text style={styles.contactText}>Dakar, Sénégal</Text>
                </View>
            </View>

            {/* Liens Rapides */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Liens Utiles</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.linkItem}>
                    <Text style={styles.linkText}>Boutique & Produits</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Panier')} style={styles.linkItem}>
                    <Text style={styles.linkText}>Votre Panier</Text>
                </TouchableOpacity>
            </View>

            {/* Réseaux Sociaux */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Suivez-nous</Text>
                <View style={styles.socialRow}>
                    <TouchableOpacity style={[styles.socialIcon, { backgroundColor: 'rgba(59, 130, 246, 0.1)' }]}>
                        <FontAwesome name="facebook" size={18} color="#3b82f6" />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.socialIcon, { backgroundColor: 'rgba(236, 72, 153, 0.1)' }]}>
                        <FontAwesome name="instagram" size={18} color="#ec4899" />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.socialIcon, { backgroundColor: 'rgba(29, 161, 242, 0.1)' }]}>
                        <FontAwesome name="twitter" size={18} color="#1da1f2" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Copyright */}
            <View style={styles.bottomBar}>
                <Text style={styles.copyright}>&copy; {new Date().getFullYear()} DIYAMGAZ. Tous droits réservés.</Text>
                <View style={styles.policyRow}>
                    <Text style={styles.policyText}>Politique de confidentialité</Text>
                    <Text style={styles.policyText}>Conditions d'utilisation</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    footerContainer: {
        backgroundColor: '#f8fafc',
        paddingHorizontal: 20,
        paddingTop: 40,
        paddingBottom: 20,
        borderTopWidth: 1,
        borderColor: '#e2e8f0',
        marginTop: 20
    },
    section: {
        marginBottom: 30
    },
    logoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15
    },
    logo: {
        width: 80,
        height: 35,
        marginRight: 10
    },
    brandName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#0f172a',
        letterSpacing: -0.5
    },
    description: {
        fontSize: 14,
        color: '#64748b',
        lineHeight: 22
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0f172a',
        marginBottom: 15
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12
    },
    contactText: {
        fontSize: 14,
        color: '#64748b',
        marginLeft: 10
    },
    linkItem: {
        marginBottom: 12
    },
    linkText: {
        fontSize: 14,
        color: '#64748b'
    },
    socialRow: {
        flexDirection: 'row',
        gap: 15
    },
    socialIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    bottomBar: {
        borderTopWidth: 1,
        borderColor: '#e2e8f0',
        paddingTop: 20,
        marginTop: 10,
        alignItems: 'center'
    },
    copyright: {
        fontSize: 12,
        color: '#94a3b8',
        marginBottom: 10,
        textAlign: 'center'
    },
    policyRow: {
        flexDirection: 'row',
        gap: 15,
        justifyContent: 'center'
    },
    policyText: {
        fontSize: 12,
        color: '#94a3b8'
    }
});

export default Footer;
