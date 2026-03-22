import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Image, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default function SplashScreen({ navigation }) {
    // Valeurs initiales d'animation
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.5)).current;

    useEffect(() => {
        // Lancer les animations en parallèle
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1500, // 1.5 secondes (légèrement ralenti)
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 5,
                tension: 40,
                useNativeDriver: true,
            })
        ]).start();

        // Après 5 secondes, naviguer vers l'Accueil
        const timer = setTimeout(() => {
            navigation.replace('Accueil'); // "replace" empêche l'utilisateur de revenir sur ce splash screen
        }, 5000);

        return () => clearTimeout(timer); // Nettoyage en cas de démontage
    }, [navigation, fadeAnim, scaleAnim]);

    return (
        <View style={styles.container}>
            <Animated.View style={[
                styles.logoContainer, 
                { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }
            ]}>
                <Image 
                    source={require('../../assets/images/logo.png')} 
                    style={styles.logo} 
                    resizeMode="contain" 
                />
                <Text style={styles.title}>DIYAMGAZ</Text>
                <Text style={styles.subtitle}>L'Énergie à votre Porte</Text>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoContainer: {
        alignItems: 'center',
    },
    logo: {
        width: width * 0.6,
        height: 120,
        marginBottom: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        color: '#0f172a',
        letterSpacing: 2,
    },
    subtitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#f7931e', // Orange de DIYAMGAZ
        marginTop: 5,
        textTransform: 'uppercase',
        letterSpacing: 1,
    }
});
