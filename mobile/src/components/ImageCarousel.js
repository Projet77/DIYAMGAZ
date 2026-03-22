import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const heroImages = [
    require('../../assets/images/premium_gas_bottle_senegal_1772229211062.png'),
    require('../../assets/images/propos.png'),
    require('../../assets/images/propos2.png'),
    require('../../assets/images/propos3.png')
];

export default function ImageCarousel({ interval = 4000 }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % heroImages.length);
        }, interval);

        return () => clearInterval(timer);
    }, [interval]);

    return (
        <View style={styles.container}>
            <Image 
                source={heroImages[currentIndex]} 
                style={styles.image}
                resizeMode="cover"
            />
            <View style={styles.dotsContainer}>
                {heroImages.map((_, index) => (
                    <View 
                        key={index} 
                        style={[
                            styles.dot, 
                            currentIndex === index && styles.activeDot
                        ]} 
                    />
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 250,
        borderRadius: 16,
        overflow: 'hidden',
        position: 'relative',
        marginBottom: 20,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    dotsContainer: {
        position: 'absolute',
        bottom: 10,
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        marginHorizontal: 4,
    },
    activeDot: {
        backgroundColor: '#fff',
        width: 12,
    }
});
