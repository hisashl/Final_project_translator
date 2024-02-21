import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
  Alert
} from 'react-native';

import CryptoJS from 'react-native-crypto-js';
 
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

export default function NewPw({ route }) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const { email } = route.params;

  
  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
        Alert.alert('Error', 'Espacios en blanco.');
        return;
      }
      
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Las contrasenas no concuerdan.');
      return;
    }
     //    Validación de la contraseña
   const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
   if (!passwordRegex.test(newPassword)) {
     Alert.alert('Error de Validación', 'La contraseña debe tener al menos 8 caracteres, una mayúscula y un número.');
     return;
   }

    setIsLoading(true);

    try {
      const key = CryptoJS.enc.Utf8.parse('1234567890123456'); // Clave de 128 bits (16 caracteres)
      let iv = CryptoJS.enc.Utf8.parse('1234567890123456'); // Vecto
      let  encryptedPassword = CryptoJS.AES.encrypt(newPassword, key, { iv: iv }).toString();
      // Recorta el encryptedUser a 25 caracteres
      encryptedPassword = encryptedPassword.slice(0, 30);
      const response = await axios.post(
        'https://us-central1-lingua-80a59.cloudfunctions.net/update_password',
        { email: email, new_password: encryptedPassword }
      );

      if (response.data === 'Password updated successfully.') {
        Alert.alert('Success', 'Your password has been reset.');
        navigation.navigate('Login'); // Navigate to login screen after password reset
      } else {
        Alert.alert('Error', 'Hubo un problema al actualizar tu contraseña.');
      }
    } catch (error) {
      Alert.alert('Error', 'Error: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <KeyboardAvoidingView style={styles.container}>
        <LinearGradient colors={['#F1F1F1', '#E1ECE2']} style={styles.background} />
        <View style={styles.card}>
          <Text style={styles.linkText}>Reset Password</Text>
          <TextInput
            placeholder="New Password"  
            secureTextEntry
            style={styles.input}
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TextInput
            placeholder="Confirm Password"
            secureTextEntry
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity onPress={handleResetPassword} style={styles.button}>
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Submit</Text>
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
