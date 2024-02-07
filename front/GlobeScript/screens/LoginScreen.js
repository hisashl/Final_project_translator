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

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const source = axios.CancelToken.source();

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

    axios
      .post('https://us-central1-lingua-80a59.cloudfunctions.net/login', {
        username: username,
        password: password,
      })
      .then(response => {
        if (response.data.includes('True')) {
          Alert.alert('Success', 'Inicio de sesión exitoso');
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
    navigation.navigate('Registro');
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
            placeholder="Username"
            style={styles.input}
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            placeholder="Password"
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
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>
          <View style={styles.footer}>
            <Text onPress={() => navigation.navigate('Mail')} style={styles.footerText}>
              Forgot Password?
            </Text>
            <Text onPress={signup} style={styles.footerText}>
              Sign Up
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
