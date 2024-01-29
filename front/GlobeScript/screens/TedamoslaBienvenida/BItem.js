import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, View, Text, Image, useWindowDimensions, TouchableOpacity } from 'react-native';

export default function BItem({ item, isLastItem }) {
  const { width } = useWindowDimensions();
  const navigation = useNavigation();

  const onPressCreateAccount = () => {
    navigation.navigate('Registro');
  };
  const onPressLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={[styles.container, { width }]}>
      {isLastItem && (
        <View style={[styles.fullWidthContainer, { width }]}>
          <Image source={item.image} style={[styles.image, { width, resizeMode: 'contain' }]} />
          <TouchableOpacity style={styles.secondaryButton} onPress={onPressCreateAccount}>
            <Text style={styles.buttonText}>Crear Cuenta</Text>
          </TouchableOpacity>
          <View style={styles.loginContainer}>
            <Text style={styles.questionText}>¿Ya cuentas con un perfil?
              <Text style={styles.linkText} onPress={onPressLogin}> Login</Text>
              </Text>
          </View>
        </View>
      )}
      {!isLastItem && (
        <View style={[styles.fullWidthContainer, { width }]}>
          <Image source={item.image} style={[styles.image, { width, resizeMode: 'contain' }]} />
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.descripcion}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  fullWidthContainer: {
    width: '100%',
    alignItems: 'center',
  },
  image: {
    width: 350,
    height: 300,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  secondaryButton: {
    backgroundColor: '#7593c1',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 40,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    textAlign: 'center',
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
  loginButtonText: {
    color: '#000000',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#636DCE',
    textAlign: 'center',
    marginTop: 20,
  },
  description: {
    fontWeight: '300',
    color: '#717777',
    paddingHorizontal: 64,
    textAlign: 'center',
    marginTop: 10,
  },
});
