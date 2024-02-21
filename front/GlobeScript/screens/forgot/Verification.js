import React, { useState, useRef } from 'react';
import { Alert, Image, View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useNavigation } from '@react-navigation/native'; 
import axios from 'axios';

export default function Verification({ route }) {
  const [code, setCode] = useState(Array(6).fill(''));
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation();
  const inputRefs = useRef([]); 
  const { email } = route.params; // Obtener el correo electrónico del parámetro de ruta

  const handleVerify = async () => {
    // Verifica si el código está ingresado correctamente
    if (!code.join('').trim()) {
      Alert.alert('Error de Validación', 'Por favor, introduce un código de verificación.');
      return;
    }

    setIsLoading(true);

    // Aquí se realizaría la solicitud para verificar el código de verificación

    // Muestra el correo electrónico para verificar que se haya pasado correctamente
    

    try {
      const response = await axios.post(
        'https://us-central1-lingua-80a59.cloudfunctions.net/code',
        JSON.stringify({
          email: email,
          verification_code: code.join(''), // Enviar el código de verificación ingresado por el usuario
        }),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.status === 'success') {
        Alert.alert('Verification', 'Código verificado con éxito.');
        navigation.navigate('NewPw', { email: email });
      } else {
        Alert.alert('Error', response.data.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Error al realizar la solicitud: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (text, index) => {
    const newCode = [...code];  
    newCode[index] = text;
    setCode(newCode);

    if (text && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };
  const resendCode = async () => {
    try {
      const response = await axios.post(
        'https://us-central1-lingua-80a59.cloudfunctions.net/verification',
        JSON.stringify({
          email: email,
        }),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
  
      if (response.data.status === 'success') {
        Alert.alert('Verification', 'Código de verificación reenviado con éxito.');
      } else {
        Alert.alert('Error', response.data.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Error al reenviar el código de verificación: ' + error.message);
    }
  };
  

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <LinearGradient  colors={['#F1F1F1', '#E1ECE2']} style={styles.background} />
        <View style={styles.card}>
          <View style={styles.imageContainer}>
            <Image source={require('../../assets/ver.png')} style={styles.image} />
          </View>
          <Text style={styles.linkText}>
            Ingresa el código que se le envió por correo
          </Text>
          <View style={styles.inputsContainer}>
            {code.map((digit, index) => (
              <TextInput
                key={index}
                style={styles.input}
                value={digit}
                onChangeText={(text) => handleChange(text, index)}
                keyboardType="number-pad"
                maxLength={1}
                ref={(el) => (inputRefs.current[index] = el)}
              />
            ))}
          </View>
          <TouchableOpacity onPress={handleVerify} style={styles.button}>
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Verificar</Text>
            )}
          </TouchableOpacity>
          <View style={styles.resendButtonContainer}>
            <Text onPress={resendCode} style={styles.resendButtonText}>Volver a enviar código</Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );

}

const styles = StyleSheet.create({
 
  resendButtonContainer: {
    paddingTop: 20, // Agrega un padding superior a la View contenedora
  },
  resendButtonText: {
    color: '#607B73',
    fontWeight: 'bold',
    textAlign: 'center', // Centra el texto
  },
  
  scrollViewContainer: {
    flexGrow: 1,
  },
  imageContainer: {
    marginBottom: 0,
  },
  image: {
    width: 352,
    height: 300,
    borderRadius: 30,
  },
  linkText: {
    fontSize: 20,
    color: '#607B73',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
  },
  card: {
    width: '90%',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    elevation: 10,
  },
  inputsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  input: {
    width: 40,
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginHorizontal: 5,
    textAlign: 'center',
    fontSize: 22,
    padding: 10,
  },
  button: {
    width: '100%',
    padding: 15,
    backgroundColor: '#607B73',
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    
    color: 'white',
    fontWeight: 'bold',
  },
});
