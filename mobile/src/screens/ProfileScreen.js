import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen({ navigation }) {
    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Header */}
            <View style={styles.header}>
                <Image 
                    source={require('../../assets/images/logo.png')} 
                    style={styles.logo} 
                    resizeMode="contain" 
                />
            </View>

            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.authContainer}>
                    <Ionicons name="person-circle-outline" size={80} color="#cbd5e1" />
                    <Text style={styles.title}>Mon Compte</Text>
                    <Text style={styles.subtitle}>
                        Connectez-vous pour suivre vos commandes et gérer vos adresses de livraison.
                    </Text>

                    <TouchableOpacity style={styles.loginBtn} onPress={() => alert("Page de connexion à venir")}>
                        <Text style={styles.loginBtnText}>Se connecter / S'inscrire</Text>
                    </TouchableOpacity>
                </View>

                {/* Section Informations */}
                <View style={styles.menuSection}>
                    <Text style={styles.sectionTitle}>Paramètres</Text>
                    
                    <TouchableOpacity style={styles.menuItem} onPress={() => alert("À venir")}>
                        <Ionicons name="location-outline" size={24} color="#64748b" style={styles.menuIcon} />
                        <Text style={styles.menuText}>Mes adresses de livraison</Text>
                        <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.menuItem} onPress={() => alert("À venir")}>
                        <Ionicons name="cube-outline" size={24} color="#64748b" style={styles.menuIcon} />
                        <Text style={styles.menuText}>Mes commandes</Text>
                        <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem} onPress={() => alert("À venir")}>
                        <Ionicons name="call-outline" size={24} color="#64748b" style={styles.menuIcon} />
                        <Text style={styles.menuText}>Service Client (Support)</Text>
                        <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.menuItem} onPress={() => alert("À venir")}>
                        <Ionicons name="information-circle-outline" size={24} color="#64748b" style={styles.menuIcon} />
                        <Text style={styles.menuText}>À propos de DIYAMGAZ</Text>
                        <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#f8fafc' },
    header: {
        alignItems: 'center', justifyContent: 'center',
        paddingTop: 25, paddingBottom: 10, backgroundColor: '#f8fafc',
        borderBottomWidth: 1, borderBottomColor: '#e2e8f0',
    },
    logo: { height: 40, width: 100 },
    container: { flexGrow: 1, padding: 20 },
    
    authContainer: {
        backgroundColor: '#ffffff', borderRadius: 16, padding: 30,
        alignItems: 'center', marginBottom: 25,
        borderWidth: 1, borderColor: '#e2e8f0',
        elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4
    },
    title: { fontSize: 24, fontWeight: 'bold', color: '#0f172a', marginTop: 10, marginBottom: 8 },
    subtitle: { fontSize: 14, color: '#64748b', textAlign: 'center', lineHeight: 22, marginBottom: 25 },
    loginBtn: { backgroundColor: '#0f172a', paddingVertical: 14, paddingHorizontal: 30, borderRadius: 12, width: '100%', alignItems: 'center' },
    loginBtnText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },

    menuSection: {
        backgroundColor: '#ffffff', borderRadius: 16, padding: 10,
        borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 30,
        elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2
    },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#0f172a', paddingHorizontal: 15, paddingTop: 10, paddingBottom: 15 },
    menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 15, borderTopWidth: 1, borderTopColor: '#f1f5f9' },
    menuIcon: { marginRight: 15 },
    menuText: { flex: 1, fontSize: 15, color: '#334155', fontWeight: '500' }
});
