import React, { useState } from 'react';
import {
  Alert,
  View,
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native'; 

export default function Mail() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const emailRegex = /\S+@\S+\.\S+/;

  const handleRecovery = async () => {
    if (!email || !email.trim()) {
      Alert.alert('Error de Validación', 'Por favor, introduce un correo electrónico.');
      return;
    }
    if (!emailRegex.test(email)) {
      Alert.alert('Error de Validación', 'Por favor, introduce un correo electrónico válido.');
      return;
    }

    setIsLoading(true);
  
    try {
      const response = await axios.post('https://us-central1-lingua-80a59.cloudfunctions.net/verification', {
        email: email,
      });
  
      if (response.data.status === 'success') {
        // Navegar a Verification y pasar el correo electrónico como parámetro
        navigation.navigate('Verification', { email: email });  
      } else if (response.data.status === 'Error') {
        Alert.alert('Error', response.data.message);
      } else {
        Alert.alert('Error', 'Error al enviar el correo de recuperación.');
      }
    } catch (error) {
      Alert.alert('Error', 'Error al realizar la solicitud: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <KeyboardAvoidingView   
        style={styles.container}
      >
        <LinearGradient
          colors={['#F1F1F1', '#E1ECE2']}
          style={styles.background}
        />
        <View style={styles.card}>
          <Text style={styles.linkText}>
            Correo de la cuenta
          </Text>
          <TextInput
            placeholder="Correo de recuperación"
            keyboardType="email-address"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />
          <TouchableOpacity onPress={handleRecovery} style={styles.button}>
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Continuar</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
  },
  linkText: {
    fontSize: 20,
    color: '#607B73',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#C4DCCF',
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
  input: {
    width: '100%',
    marginBottom: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
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
