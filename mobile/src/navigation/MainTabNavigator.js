import React from 'react';
import { View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import ShopScreen from '../screens/ShopScreen';
import CartScreen from '../screens/CartScreen';
import AboutScreen from '../screens/AboutScreen';
import { useCart } from '../context/CartContext';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
    const { getCartCount } = useCart();
    const cartCount = getCartCount();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'AccueilTab') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'BoutiqueTab') {
                        iconName = focused ? 'file-tray-stacked' : 'file-tray-stacked-outline';
                    } else if (route.name === 'PanierTab') {
                        iconName = focused ? 'cart' : 'cart-outline';
                    } else if (route.name === 'AproposTab') {
                        iconName = focused ? 'information-circle' : 'information-circle-outline';
                    }

                    return (
                        <View>
                            <Ionicons name={iconName} size={size} color={color} />
                            {/* Badge du compteur d'articles pour l'onglet Panier */}
                            {route.name === 'PanierTab' && cartCount > 0 && (
                                <View style={{
                                    position: 'absolute', right: -6, top: -3,
                                    backgroundColor: '#080808ff', borderRadius: 10,
                                    width: 18, height: 18, justifyContent: 'center', alignItems: 'center',
                                    borderWidth: 1, borderColor: '#fff'
                                }}>
                                    <Text style={{ color: '#fff', fontSize: 10, fontWeight: 'bold' }}>
                                        {cartCount > 9 ? '9+' : cartCount}
                                    </Text>
                                </View>
                            )}
                        </View>
                    );
                },
                tabBarActiveTintColor: '#080808ff', // Orange DIYAMGAZ
                tabBarInactiveTintColor: '#94a3b8',
                tabBarStyle: {
                    backgroundColor: '#ffffff',
                    borderTopWidth: 1,
                    borderTopColor: '#e2e8f0',
                    elevation: 10,
                    shadowColor: '#0f172a',
                    shadowOffset: { width: 0, height: -2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 5,
                    height: 87, // Plus haut
                    paddingBottom: 15, // Espace supplémentaire sous les icônes
                    paddingTop: 8,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                },
                headerShown: false // Par défaut on cache les headers car chaque écran a le sien
            })}
        >
            <Tab.Screen 
                name="AccueilTab" 
                component={HomeScreen} 
                options={{ title: 'Accueil' }} 
            />
            <Tab.Screen 
                name="BoutiqueTab" 
                component={ShopScreen} 
                options={({ route }) => ({ 
                    title: 'Boutique',
                    headerShown: true, // On affiche le header classique pour cette vue
                    headerTitle: route.params?.category || 'Nos Produits',
                    headerTitleAlign: 'center',
                    headerTintColor: '#0f172a',
                    headerStyle: { backgroundColor: '#f8fafc', elevation: 0, shadowOpacity: 0, borderBottomWidth: 1, borderBottomColor: '#e2e8f0' }
                })} 
            />
            <Tab.Screen 
                name="PanierTab" 
                component={CartScreen} 
                options={{ title: 'Panier' }} 
            />
            <Tab.Screen 
                name="AproposTab" 
                component={AboutScreen} 
                options={{ title: 'À propos' }} 
            />
        </Tab.Navigator>
    );
}
