import { KeyboardAvoidingView, ScrollView, StyleSheet, Text, View,  Image, TouchableOpacity} from 'react-native'
import React from 'react'
{/* <Image source={require('../assets/images/logo.png')} style={styles.logo} /> */}

export default function LoginScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <View style={styles.imageContainer}>
        <Image source={require('../assets/logo.png')} style={styles.image} /> 
        </View>
        <Text style={styles.title}>
        Te damos la bienvenida a LinguaSync
          </Text>
        <Text style={styles.description}>
          Un traductor y editor en la palma de tumano
        </Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
        <View style={styles.indicatorContainer}>
          <View style={[styles.indicator, styles.activeIndicator]} />
          <View style={styles.indicator} />
          <View style={styles.indicator} />
        </View>
      </View>
    </ScrollView>

  )
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 24,
    alignItems: 'center',
    width: '100%',
    maxWidth: 350,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  imageContainer: {
    marginBottom: 20,
    },
    image: {
      width: 350,
      height: 300,
      borderRadius: 50,
    },  
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1E3A8A',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#1E3A8A',
    marginBottom: 24,
    paddingHorizontal: 64,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#1E40AF',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  indicatorContainer: {
    flexDirection: 'row',
    marginTop: 16,
  },
  indicator: {
    height: 6,
    width: 6,
    backgroundColor: '#fff',
    borderRadius: 3,
    marginHorizontal: 2,
  },
  activeIndicator: {
    backgroundColor: '#1E40AF',
  },
});