import { KeyboardAvoidingView, ScrollView, StyleSheet, Text, View,  Image, TouchableOpacity} from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
{/* <Image source={require('../assets/images/logo.png')} style={styles.logo} /> */}

export default function Success() {
  
  const navigation = useNavigation();
  function Log(){
    navigation.navigate('Login')
  }
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <View style={styles.imageContainer}>
        <Image source={require('../../assets/success.png')} style={styles.image} /> 
        </View>
        <Text style={styles.title}>
        Bienvenid@ a LinguaSync
          </Text>
        <Text style={styles.description}>
         ¡Tu cuenta ha sido creada con éxito!
        </Text>
        <TouchableOpacity  onPress={Log} style={styles.button}>
          <Text style={styles.buttonText}>Log in</Text>
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
     backgroundColor: '#fff',
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
    maxWidth: 500,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
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
    color: '#607B73',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#839E8A',
    marginBottom: 24,
    paddingHorizontal: 64,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#607B73',
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
    backgroundColor: '#839E8A',
  },
});