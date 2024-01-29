import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';

export default function SignUp() {
  const navigation = useNavigation();

  const navigateToEmailSignUp = () => {
    navigation.navigate('EmailSignUp');
  };

  const navigateToPhoneSignUp = () => {
    navigation.navigate('PhoneSignUp');
  };

  const navigateToGoogleSignUp = () => {
    navigation.navigate('GoogleSignUp');
  };

  const goBack = () => {
    navigation.navigate('Bienvenida');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Metodos de registro</Text>
      <View style={styles.imageContainer}>
        <TouchableOpacity onPress={navigateToEmailSignUp}>
          <Image source={require('../../assets/mail.png')} style={styles.image} />
        </TouchableOpacity>

        <TouchableOpacity onPress={navigateToPhoneSignUp}>
          <Image source={require('../../assets/phone.png')} style={styles.image} />
        </TouchableOpacity>

        <TouchableOpacity onPress={navigateToGoogleSignUp}>
          <Image source={require('../../assets/google.png')} style={styles.image} />
        </TouchableOpacity>
      </View>
      <View>
      <TouchableOpacity style={styles.returnButton} onPress={goBack}>
        <Text style={styles.goBackText}>Return</Text>
      </TouchableOpacity>
    </View>
    </View>
   
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  imageContainer: {
    flexDirection: 'row', // Coloca las imágenes en una fila horizontal
    justifyContent: 'space-around', // Distribuye el espacio uniformemente entre las imágenes
    width: '100%', // Asegura que el contenedor ocupe el ancho completo
    paddingHorizontal: 20, // Espacio horizontal para evitar que las imágenes toquen los bordes
  },
  image: {
    width: 60, // Tamaño de las imágenes
    height: 60, // Tamaño de las imágenes
    margin: 10, // Espacio entre las imágenes
  }, 
  goBackText: {
    fontSize: 16,
    color: '#000',
    textDecorationLine: 'underline',
  },
  returnButton: {
    position: 'absolute',
    bottom: -300,
    alignSelf: 'center',
  },
});
