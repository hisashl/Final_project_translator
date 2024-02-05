import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import Bienvenida from './screens/TedamoslaBienvenida/Bienvenida';
import Registro from './screens/Registro';
import Mail from './screens/forgot/Mail';
import Verification from './screens/forgot/Verification';
import Success from './screens/TedamoslaBienvenida/Success';
const Stack = createNativeStackNavigator();
export default function App() {
  return (
        <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen   options={{ headerShown: false }}  name="Bienvenida" component={Bienvenida} />
        <Stack.Screen options = {{headerShown: false}} name="Login" component={LoginScreen} />
        <Stack.Screen options = {{headerShown: false}} name="Home" component={HomeScreen} /> 
        <Stack.Screen options = {{headerShown: false}} name="Registro" component={Registro} />
        <Stack.Screen options = {{headerShown: false}} name="Mail" component={Mail} />
        <Stack.Screen options = {{headerShown: false}} name="Verification" component={Verification} />
        <Stack.Screen options = {{headerShown: false}} name="Success" component={Success} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
 
