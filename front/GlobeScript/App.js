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
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import tabs from './screens/navigation/tabs';
import NewPw from './screens/forgot/NewPw';
import TextScreen from './screens/TextScreen';
import PhotoScreen from './screens/PhotoScreen';   
import { StyleProvider } from './screens/StyleContext';
import MicrophoneScreen from './screens/MicrophoneScreen';
import Synonyms from './screens/synonyms';
import EditScreen from './screens/EditScreen';
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
export default function App() {
  return (
        <NavigationContainer> 
             <StyleProvider>

          
      <Stack.Navigator>
        {/* <Stack.Screen   options={{ headerShown: false }}  name="Bienvenida" component={Bienvenida} />
        <Stack.Screen options = {{headerShown: false}} name="Login" component={LoginScreen} /> */}
        {/* <Stack.Screen name = "Synonyms" component={Synonyms} /> */}
        <Stack.Screen options = {{headerShown: false}}  name="Home" component={HomeScreen} />  
        
        <Stack.Screen options = {{headerShown: false}} name="Texts"  component = {TextScreen}/>
        <Stack.Screen options = {{headerShown: false}} name="Photo" component = {PhotoScreen}  />
        <Stack.Screen options = {{headerShown: false}} name="Microphone" component = {MicrophoneScreen} /> 
        <Stack.Screen options = {{headerShown: false}} name="Edit" component = {EditScreen} />
        
        <Stack.Screen options = {{headerShown: false}} name="Registro" component={Registro} />
        <Stack.Screen options = {{headerShown: false}} name="Mail" component={Mail} />
        <Stack.Screen options = {{headerShown: false}} name="Verification" component={Verification} />
        <Stack.Screen options = {{headerShown: false}} name="Success" component={Success} />
        <Stack.Screen options = {{headerShown: false}} name="NewPw" component={NewPw} /> 
       
        </Stack.Navigator>
        </StyleProvider>
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
 
