import React, { useState, useEffect, useCallback } from 'react';
import {
  Alert,
  View,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import CryptoJS from 'react-native-crypto-js';
import { useStyle } from './StyleContext';

export default function LoginScreen() {
  const { updateStyles } = useStyle();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  
  const loadCurrentProfile = async () => {
    try {
      const profileData = await AsyncStorage.getItem('currentProfile');
      if (profileData !== null) {
        const profile = JSON.parse(profileData);
        updateStyles({
          textColor: profile.textColor,
          backgroundColor: profile.backgroundColor,
          fontFamily: profile.fontFamily,
          fontSize: parseInt(profile.fontSize, 10),
        });
      }
    } catch (error) {
      //console.error('Error loading current profile:', error);
    }
  };

  useEffect(() => {
    const source = axios.CancelToken.source();
    const checkAuthentication = async () => {
      try {
        const username = await AsyncStorage.getItem('username');
        const password = await AsyncStorage.getItem('password');
        
        if (username && password) {
          navigation.replace('Home');
        }
      } catch (error) {
        console.error('Error checking authentication', error);
      }
    };
  
    checkAuthentication();
  

    return () => {
      source.cancel('Componente desmontado');
    };
    
    
    
  }, []);

  const handleLogin = useCallback(() => {
    if (isLoading) {
      return;
    }

    if (!username || !password) { // Verifica si los campos de nombre de usuario y contraseña están vacíos
      Alert.alert('Error de Validación', 'Por favor, completa todos los campos.');
      return;
    }

    setIsLoading(true);
  
    const key = CryptoJS.enc.Utf8.parse('1234567890123456'); // Clave de 128 bits (16 caracteres)
    const iv = CryptoJS.enc.Utf8.parse('1234567890123456'); // Vector de inicialización de 128 bits (16 caracteres)
    const encryptedPassword = CryptoJS.AES.encrypt(password, key, { iv: iv }).toString();
    const encryptedUser = CryptoJS.AES.encrypt(username, key, { iv: iv }).toString();
    axios
      .post('https://us-central1-lingua-80a59.cloudfunctions.net/login', {
        username: encryptedUser,
        password: encryptedPassword,
      })
      .then(response => {
        if (response.data.includes('True')) {
          AsyncStorage.setItem('username', username); // Guarda el nombre de usuario
          AsyncStorage.setItem('password', password); // Guarda la contraseña

          Alert.alert('Success', 'Inicio de sesión exitoso');

          loadCurrentProfile();



          navigation.replace('Home');
        } else {
          Alert.alert('Error', 'Datos de inicio de sesión inválidos');
        }

      })
      
      .catch(error => {
        if (error.response) {
          Alert.alert(
            'Error',
            'Solicitud fallida: ' +
              error.response.status +
              ' ' +
              error.response.data
          );
        } else if (error.request) {
          Alert.alert('Error', 'No se recibió respuesta del servidor');
        } else {
          Alert.alert('Error', 'Error al realizar la solicitud: ' + error.message);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [isLoading, username, password]);

  const signup = () => {
    navigation.replace('Registro');
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.scrollViewContainer}
      resetScrollToCoords={{ x: 0, y: 0 }}
      scrollEnabled={true}
    >
      <LinearGradient
        colors={['#F1F1F1', '#E1ECE2']}
        style={styles.background}
      />
      <View style={styles.container}>
        <View style={styles.card}>
          <View style={styles.imageContainer}>
            <Image source={require('../assets/Enter.png')} style={styles.image} />
          </View>
          <TextInput
            placeholder="Usuario"
            style={styles.input}
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            placeholder="Contraseña"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            onPress={handleLogin}
            style={styles.button}
            disabled={isLoading}
          >
            

            {isLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" /> // Indicador de carga mientras se está procesando la solicitud
            ) : (
              <Text style={styles.buttonText}>Ingresar</Text>
            )}
          </TouchableOpacity>
          <View style={styles.footer}>
            <Text onPress={() => navigation.navigate('Mail')} style={styles.footerText}>
              Olvido su contraseña?
            </Text>
            <Text onPress={signup} style={styles.footerText}>
              Registro
            </Text>
          </View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
  },
  imageContainer: {
    marginBottom: 20,
  },
  image: {
    width: 350,
    height: 300,
    borderRadius: 50,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center', // Centrar vertical y horizontalmente
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
  footer: {
    marginTop: 15,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: {
    color: '#607B73',
    fontWeight: 'bold',
  },
});