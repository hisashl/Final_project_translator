import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  Alert,
  ScrollView,
  StyleSheet,
  View,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import Modal from 'react-native-modal';

export default function Registro() {
  const [fullName, setFullName] = useState('');
  const [date, setDate] = useState(new Date());
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const emailRegex = /\S+@\S+\.\S+/;

  const handleSignUp = async () => {
    // Validaciones ...
    if (!fullName || !email || !username || !password) {
      Alert.alert('Error de Validación', 'Por favor, completa todos los campos.');
      return;
    }

    setIsLoading(true); // Iniciar la carga

    try {
      const response = await axios.post(
        'https://us-central1-lingua-80a59.cloudfunctions.net/add_username',
        {
          Name: fullName,
          email: email,
          username: username,
          password: password,
          birthdate: date.toISOString().split('T')[0],
        }
      );

      if (response.data.includes('Data added successfully.')) {
        // Llamar a la función send_registration_email
        await axios.post(
          'https://us-central1-lingua-80a59.cloudfunctions.net/registration_email',
          {
            email: email,
            full_name: fullName,
            username: username,
          }
        );
        navigation.navigate('Success');
      } else {
        if (response.data.includes('Email already exists'))
          Alert.alert('Error', 'El correo ya existe');
        else if (response.data.includes('Username already exists'))
          Alert.alert('Error', 'El nombre de usuario ya existe');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false); // Finalizar la carga
    }
  };

  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'android' ? false : true);
    setDate(currentDate);
  };

  const showDatepicker = () => {
    setShow(true);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.card}>
          <Image
            source={require('../assets/signup.png')}
            style={styles.profileImage}
          />
          <Text style={styles.title}>Registro</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre Completo"
            value={fullName}
            onChangeText={setFullName}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            keyboardType="email-address"
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Nombre de Usuario"
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            value={password}
            secureTextEntry
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={showDatepicker} style={styles.datePickerButton}>
            <Text>Fecha de Nacimiento: {date.toLocaleDateString()}</Text>
          </TouchableOpacity>
          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onChange}
            />
          )}
          <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Registrarse</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.goBack} onPress={() => navigation.goBack()}>
        <Image source={require('../assets/back.png')} style={styles.image} />
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  linkText: {
    fontSize: 16,
    color: '#0000ff',
  },
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  questionText: {
    fontSize: 16,
    color: '#717777',
    marginRight: 10,
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  card: {
    width: '90%',
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 20,
    elevation: 3,
  },
  profileImage: {
    width: 280,
    height: 200,
    borderRadius: 20,
    marginTop: -50,
    borderColor: '#FFF',
    borderWidth: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#1B7FA2',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    marginTop: 10,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  goBack: {
    position: 'absolute',
    top: 30,
    marginLeft: 30,
    alignSelf: 'left',
  },
  image: {
    width: 30,
    marginTop: 1,
    borderRadius: 30,
    height: 30,
  },
  datePickerButton: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
});
