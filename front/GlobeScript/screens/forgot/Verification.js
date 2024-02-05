import React, { useState, useRef } from 'react';
import { Alert, Image, View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function Verification() {
  const [code, setCode] = useState(Array(6).fill(''));
  const inputRefs = useRef([]); 
  const handleVerify = () => {
    // Aquí iría la lógica para manejar la verificación del código
    Alert.alert('Verification', 'Código verificado con éxito.');
   
  };

  const handleChange = (text, index) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // Move to next input if the text is not empty
    if (text && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <LinearGradient  colors={['#F1F1F1', '#E1ECE2']}style={styles.background} />
        <View style={styles.card}>
        <View style={styles.imageContainer}>
            <Image source={require('../../assets/ver.png')} style={styles.image} />
          </View>
        <Text style = {styles.linkText}>
            Ingresa el codigo que se le envio por correo
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
            <Text style={styles.buttonText}>Verificar</Text>
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
