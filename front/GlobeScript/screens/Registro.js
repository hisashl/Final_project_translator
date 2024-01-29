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
  Button
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function Registro() {
  const [fullName, setFullName] = useState('');
  const [date, setDate] = useState(new Date());
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const navigation = useNavigation();

  const handleSignUp = () => {
    // Validación del nombre completo
    if (/\d/.test(fullName)) {
        Alert.alert('Error de Validación', 'El nombre no debe contener números.');
        return;
      }
  
      // Validación del email
      const emailRegex = /\S+@\S+\.\S+/;
      if (!emailRegex.test(email)) {
        Alert.alert('Error de Validación', 'Por favor, introduce un correo electrónico válido.');
        return;
      }
  
      // Validación de la fecha de nacimiento
      if (date > new Date()) {
        Alert.alert('Error de Validación', 'La fecha de nacimiento no puede ser en el futuro.');
        return;
      }
  }; 

 
  const [show, setShow] = useState(false); // Agrega esto

  // ... funciones y navegación

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'android' ? false : true); // Android debe ocultar el picker
    setDate(currentDate);
  };

  const showDatepicker = () => {
    setShow(true);
  };
  


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.card}>
            
          <Image
            source={require('../assets/signup.png')} // Asegúrate de que la ruta de la imagen es correcta
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
            <Text >
              Fecha de Nacimiento: {date.toLocaleDateString()}
            </Text>
          </TouchableOpacity>
          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode='date'
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onChange}
            />
          )}
          <TouchableOpacity style={styles.button} onPress={handleSignUp}>
            <Text style={styles.buttonText}>Registrarse</Text>
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
      backgroundColor: '#FFF',
    },
    linkText: {
        fontSize: 16,
        color: '#0000ff',
        // fontWeight: 'underlined',
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
      backgroundColor: '#f9f9f9',
      alignItems: 'center',
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    profileImage: {
      width: 280,
      height: 200,
      borderRadius: 20,
      marginTop: -50, // Ajusta este valor según sea necesario
      borderColor: '#FFF', // Color de fondo de la tarjeta para que parezca circular
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
    marginTop  : 10,
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
