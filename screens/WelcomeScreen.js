// WelcomeScreen.js
import React, { useRef, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { StatusBar } from 'expo-status-bar';

export default function WelcomeScreen() {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial opacity value of 0

  // Animation to fade in the text
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000, // 2 seconds for the animation
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleGetStarted = () => {
    navigation.navigate('Home'); // Take user to HomeScreen when Get Started is pressed
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Background Image */}
      <Image
        source={require('../assets/background.png')} // Background image path
        style={styles.backgroundImage}
      />

      {/* Animated Text */}
      <Animated.View style={[styles.textContainer, { opacity: fadeAnim }]}>
        <Text style={styles.title}>Quick Recipe</Text>
        <Text style={styles.subtitle}>Your Own Recipe Finder</Text>
      </Animated.View>

      {/* Get Started Button */}
      <TouchableOpacity style={styles.getStartedButton} onPress={handleGetStarted}>
        <Text style={styles.getStartedText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f64e32',
    position: 'relative',
  },
  backgroundImage: {
    position: 'absolute',
    width: wp(100),
    height: hp(100),
    resizeMode: 'cover',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: hp(10), // Adjust based on preference
  },
  title: {
    fontSize: hp(6), // Bigger font size for the title
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: hp(3), // Smaller font size for subtitle
    fontWeight: '500',
    color: '#fff',
    textAlign: 'center',
    marginTop: hp(1),
  },
  getStartedButton: {
    backgroundColor: '#fff',
    paddingVertical: hp(1.5),
    paddingHorizontal: hp(5),
    borderRadius: hp(1.5),
    marginTop: hp(5), // Adjust the spacing
  },
  getStartedText: {
    color: '#f64e32',
    fontSize: hp(2.2),
    fontWeight: 'bold',
    textAlign: 'center',
  },
};
