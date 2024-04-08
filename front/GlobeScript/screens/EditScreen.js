import React, { useState, useEffect }
from 'react';
import {
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
  StyleSheet,
  View,
  Alert,
  Button,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
} from 'react-native'; 
import { useStyle  } from './StyleContext';
import { Ionicons, FontAwesome5  } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import Slider from '@react-native-community/slider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Font from 'expo-font';
import { useFonts } from 'expo-font';
import axios from 'axios';
import ColorPicker, { Panel3, Preview, BrightnessSlider, OpacitySlider } from 'reanimated-color-picker';

export default function EditScreen() {
  const [isEditing, setIsEditing] = useState(false); // Nuevo estado para controlar si se está editando
  const [fontSize, setFontSize] = useState(14);
  const [selectedFont, setSelectedFont] = useState('Verdana');
  const [textColor, setTextColor] = useState('#000000'); // Estado para el color del texto
  const [inputColor, setInputColor] = useState('#000000'); // Estado para el color del texto ingresado manualmente
  const [isEditingBackground, setIsEditingBackground] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [inputBackgroundColor, setInputBackgroundColor] = useState('#FFFFFF');
  const { updateStyles } = useStyle();

 

  const [profiles, setProfiles] = useState([]); // Estado para almacenar todos los perfiles
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0); // Índice del perfil actualmente seleccionado




  const [profileName, setProfileName] = useState('');



 

  useEffect(() => {
    loadProfiles();
    loadCurrentProfile();


 
  }, []);

   
  

  const changeProfile = async (index) => {
    if (profiles && index < profiles.length) {
      setCurrentProfileIndex(index);
      const selectedProfile = profiles[index];
      if (selectedProfile) {
        setProfileName(selectedProfile.name);
        setTextColor(selectedProfile.textColor);
        setBackgroundColor(selectedProfile.backgroundColor);
        setSelectedFont(selectedProfile.fontFamily);
        setFontSize(parseInt(selectedProfile.fontSize, 10));
        // Guardar el perfil actual en AsyncStorage
        try {
          const profileData = {
            index: index.toString(),
            name: selectedProfile.name,
            textColor: selectedProfile.textColor,
            backgroundColor: selectedProfile.backgroundColor,
            fontFamily: selectedProfile.fontFamily,
            fontSize: selectedProfile.fontSize
          };
          await AsyncStorage.setItem('currentProfile', JSON.stringify(profileData));
        } catch (error) {
          console.error('Error saving current profile:', error);
        }
      }
    }
  };
  const loadCurrentProfile = async () => {
    try {
      const profileData = await AsyncStorage.getItem('currentProfile');
      if (profileData !== null) {
        const profile = JSON.parse(profileData);
        setCurrentProfileIndex(parseInt(profile.index, 10));
        setProfileName(profile.name);
        setTextColor(profile.textColor);
        setBackgroundColor(profile.backgroundColor);
        setSelectedFont(profile.fontFamily);
        setFontSize(parseInt(profile.fontSize, 10));
      }
    } catch (error) {
      console.error('Error loading current profile:', error);
    }
  };
  
   
  const updateCurrentProfile = async () => {
    try {
      const user_id = await AsyncStorage.getItem('username');
      if (!user_id) {
        Alert.alert('Error', 'User ID not found.');
        return;
      }
  
      const response = await axios.post('https://us-central1-lingua-80a59.cloudfunctions.net/list_styles', {
        user_id: user_id,
      });
  
      const result = response.data;
  
      if (result.status === 'success') {
        setProfiles(result.profiles);
        // Actualiza el perfil actual sin cambiarlo
        const updatedProfile = result.profiles[currentProfileIndex];
        if (updatedProfile) {
          setProfileName(updatedProfile.name);
          setTextColor(updatedProfile.textColor);
          setBackgroundColor(updatedProfile.backgroundColor);
          setSelectedFont(updatedProfile.fontFamily);
          setFontSize(parseInt(updatedProfile.fontSize, 10));
        }
      } else {
        Alert.alert('Error', result.message || 'Failed to fetch profiles');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'An error occurred while fetching profiles');
    }
  };
const loadProfiles = async () => {
  try {
    
    const user_id = await AsyncStorage.getItem('username');
    if (!user_id) {
      Alert.alert('Error', 'User ID not found.');
      return;
    }

    const response = await axios.post('https://us-central1-lingua-80a59.cloudfunctions.net/list_styles', {
      user_id: user_id,
    });

    const result = response.data;

    if (result.status === 'success') {
      setProfiles(result.profiles);
      // Si quieres seleccionar automáticamente el primer perfil como activo:
      if (result.profiles.length > 0) {
        changeProfile(0); // Asume que tienes una función llamada changeProfile
      }
    } else {
      Alert.alert('Error', result.message || 'Failed to fetch profiles');
    }
  } catch (error) {
    Alert.alert('Error', error.message || 'An error occurred while fetching profiles');
  }  
};

  

  const handleCompleteColorPicker = ({ hex }) => {
    setTextColor(hex);
    setInputColor(hex);
    setIsEditing(false);
    setIsEditing(false); // Desactivar modo edición cuando se selecciona un color
  };
  const toggleEdit = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      // Actualizar el color del panel y de los otros componentes cuando se termine de editar
      handleCompleteColorPicker({ hex: inputColor });
    }
  };
  const savechanges = async () => {
    const user_id = await AsyncStorage.getItem('username');
    if (!user_id) {
      Alert.alert('Error', 'User ID not found.');
      return;
    }
     
    const profileData = {
      // user_id: user_id,
      // profile: currentProfileIndex, // Asumiendo que los perfiles están numerados a partir del 1
      // name: profiles[currentProfileIndex].name, // Asume que cada perfil tiene un nombre
      // textColor: textColor,
      // fontSize: fontSize, // Convierte el número a una cadena
      // fontFamily: selectedFont,
      // backgroundColor: backgroundColor
      user_id: user_id,
      profile: currentProfileIndex + 1, // Asumiendo que los perfiles están numerados a partir del 1
      name: profileName, // Asume que cada perfil tiene un nombre
      textColor: textColor,
      fontSize: fontSize.toString(), // Convierte el número a una cadena
      fontFamily: selectedFont,
      backgroundColor: backgroundColor
    };
  
    try {
      const response = await axios.post('https://us-central1-lingua-80a59.cloudfunctions.net/styles', profileData);
      const result = response.data;
  
      if (result.includes('successfully')) {
        Alert.alert('Success', 'Profile updated successfully.');
         await updateCurrentProfile(); // Actualiza el perfil actual sin cambiarlo
        // Actualiza la lista de perfiles si es necesario
      } else {
        Alert.alert('Error', 'Failed to update profile.');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'An error occurred while updating the profile.');
    }

 
  };
  
    
//  const apply = ()=>{
//   updateStyles({ textColor: textColor, inputColor: textColor });
//   updateStyles({ backgroundColor: backgroundColor, inputBackgroundColor: backgroundColor });
//   updateStyles({ fontFamily: selectedFont });
//   updateStyles({ fontSize: fontSize });
//   savechanges();
//  }
const apply = () => {
  const newStyles = {
    textColor: textColor,
    backgroundColor: backgroundColor,
    fontFamily: selectedFont,
    fontSize: fontSize,
  };
  updateStyles(newStyles);
  saveChanges();
};

 

  const fonts = {
    'Roboto': require('../assets/fonts/Roboto-Regular.ttf'),
    'Calibri': require('../assets/fonts/calibri.ttf'),
    'TimesNewRoman': require('../assets/fonts/Times New Roman.ttf'),
    'Verdana': require('../assets/fonts/Verdana.ttf'),
  };

  const [fontsLoaded] = useFonts(fonts);
  // Manejador para el cambio de color desde el TextInput
  const  handleTextInputColor = (hex) => {
    setInputColor(hex);
    // Opcionalmente, valida y actualiza el color del texto solo si es un hex válido
    if (/^#([0-9A-F]{3}){1,2}$/i.test(hex)) {
      setTextColor(hex);
    }
  };
  const handleCompleteBackgroundPicker = ({ hex }) => {
    setBackgroundColor(hex);
    setInputBackgroundColor(hex);
    
    setIsEditingBackground(false);
  };

  const toggleEditBackground = () => {
    setIsEditingBackground(!isEditingBackground);
    if (!isEditingBackground) {
      // Solo actualiza el color de fondo cuando se inicia la edición
      setInputBackgroundColor(backgroundColor);
    }
  };

  const handleBackgroundInputChange = (color) => {
    setInputBackgroundColor(color); // Actualiza siempre el color ingresado
    if (/^#[0-9A-F]{6}$/i.test(color)) {
      setBackgroundColor(color); // Solo actualiza el color de fondo si es válido
     
    }
  };
  


  if (!fontsLoaded) {
    return <View style={styles.centered}><Text>Loading...</Text></View>;
  }
  const handleFontSizeChange = (value) => {
    setFontSize(value);
    // Aquí puedes agregar más acciones que quieras ejecutar cuando cambie el valor del Slider
    // AsyncStorage.getItem('username').then((username) => {
    //   console.log(username); // Usar el nombre de usuario
    // });
    
    // AsyncStorage.getItem('password').then((password) => {
    //   console.log(password); // Usar la contraseña
    // });
    
   
  };
  const handleSelectedFont = (itemValue) => {
    setSelectedFont(itemValue);
  
  };
  
  const createNewProfile = async () => {
    if (profiles.length >= 5) {
      Alert.alert('Límite alcanzado', 'No puedes crear más de 5 perfiles.');
      return;
    }
  
    const user_id = await AsyncStorage.getItem('username');
    if (!user_id) {
      Alert.alert('Error', 'User ID not found.');
      return;
    }
  
    const newProfile = {
      user_id: user_id,
      profile: profiles.length + 1, // Asignar el siguiente número de perfil
      name: 'Nuevo perfil',
      textColor: '#000000',
      fontSize: '14',
      fontFamily: 'Verdana',
      backgroundColor: '#FFFFFF',
    };
  
    try {
      const response = await axios.post('https://us-central1-lingua-80a59.cloudfunctions.net/styles', newProfile);
      const result = response.data;
  
      if (result.includes('successfully')) {
        Alert.alert('Éxito', 'Perfil creado exitosamente.');
        loadProfiles(); // Recargar los perfiles para incluir el nuevo
      } else {
        Alert.alert('Error', 'No se pudo crear el perfil.');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Ocurrió un error al crear el perfil.');
    }
  };
  

  return (
  
  //, { backgroundColor: backgroundColor }
    <SafeAreaView style={[styles.safeArea]}>
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container]}>
        
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
          <View style={styles.navBar}>
            <Text style={styles.navTitle}>Audio</Text>
          </View>
          <View style={styles.footerMenu}>
          <Ionicons name="create" size={40} color="#000" />
            </View>

{/* 
            <View style={styles.profilesContainer}>
  {profiles.map((profile, index) => (
    <TouchableOpacity
      key={index}
      style={[styles.profileButton, index === currentProfileIndex ? styles.selectedProfile : null]}
      onPress={() => changeProfile(index)}
    >
      <Text style={styles.profileButtonText}>{profile.name}</Text>
    </TouchableOpacity>
  ))}
</View>
 */}
 <ScrollView
  horizontal={true}
  showsHorizontalScrollIndicator={false}
  contentContainerStyle={styles.profilesContainer}
>
  {profiles.map((profile, index) => (
    <TouchableOpacity
      key={index}
      style={[styles.profileButton, index === currentProfileIndex ? styles.selectedProfile : null]}
      onPress={() => changeProfile(index)}
    >
      <Text style={styles.profileButtonText}>{profile.name}</Text>
    </TouchableOpacity>
  ))}
</ScrollView>


 

            <Button title="Guardar Cambios" onPress={savechanges} />
            <Button title="Aplicar" onPress={apply} />
            <Button
  title="Crear nuevo perfil"
  onPress={createNewProfile}
  disabled={profiles.length >= 5}
/>

            <TextInput
  style={styles.textInput}
  value={profileName}
  onChangeText={setProfileName}
  placeholder="Nombre del perfil"
/>
 
      <ColorPicker
          style={{ width: '60%' }}
          value={textColor}
          onComplete={handleCompleteColorPicker}
          // onColorChange={({ hex }) => setTextColor(hex)} // Actualizar en tiempo real mientras se selecciona el color
          onColorChange={({ hex }) => updateStyles({ textColor: hex })}
        >
          {isEditing ? (
          <TextInput
          style={styles.colorInput}
          value={inputColor}
          onChangeText={handleTextInputColor}
          maxLength={7} // Longitud para el formato hexadecimal #RRGGBB
          autoCapitalize='characters' // Asegura que la entrada esté en mayúsculas
          placeholder='#RRGGBB'
        />
          ) : (
            <TouchableOpacity onPress={toggleEdit}>
              <Preview hideInitialColor={true} color={textColor} />
            </TouchableOpacity>
          )}
          
          <View style={styles.colorPickerComponent}>
            <Panel3 />
          </View>
          <View style={styles.colorPickerComponent}>
            <BrightnessSlider />
          </View>
          <OpacitySlider />
        </ColorPicker>
        <View style = {[styles.textInputContainer, { backgroundColor: backgroundColor }]}>

      
        <Text style={[styles.previewText, { fontFamily: selectedFont, fontSize, color: textColor }]}>
        LinguaSync: La Sincronía del Lenguaje
        </Text>
        </View>
        <Text style={styles.label}>Tamaño de Fuente:</Text>
        <Slider
          style={styles.slider}
          minimumValue={10}
          maximumValue={30}
          step={1}
          value={fontSize}
          onValueChange={handleFontSizeChange}
        />

        <Text style={styles.label}>Selecciona la Fuente:</Text>
        <Picker
          selectedValue={selectedFont}
          style={styles.picker}
          onValueChange={(itemValue) => handleSelectedFont(itemValue)}
        >
          {Object.keys(fonts).map((font) => (
            <Picker.Item key={font} label={font} value={font} />
          ))}
        </Picker>
              <Text style={styles.label}>Color de Fondo:</Text>
              <ColorPicker
          style={{ width: '60%' }}
          value={backgroundColor}
          onComplete={handleCompleteBackgroundPicker}
          onColorChange={({ hex }) => setBackgroundColor(hex)}
        >
      
          {isEditingBackground ? (
            <TextInput
            style={styles.colorInput}
            value={inputBackgroundColor}
            onChangeText={handleBackgroundInputChange}
            maxLength={7} // Longitud para el formato hexadecimal #RRGGBB
            autoCapitalize='characters' // Asegura que la entrada esté en mayúsculas
            placeholder='#RRGGBB'/>
          ) : (
            <TouchableOpacity onPress={toggleEditBackground}>
              <Preview hideInitialColor={true} color={backgroundColor} />
            </TouchableOpacity>
          )}
          <View style={styles.colorPickerComponent}>
            <Panel3 />
          </View>
          <View style={styles.colorPickerComponent}>
            <BrightnessSlider />
          </View>
          <OpacitySlider />
        </ColorPicker>
       


        

        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  </SafeAreaView>
  
  );
}

const styles = StyleSheet.create({
  colorInput: {
    height: 40,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 2,
    borderRadius: 10,
    marginLeft: 30,
    paddingHorizontal: 60,
    marginBottom: 20, // Espacio después del TextInput
    marginTop: 20, // Espacio antes del TextInput
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  navTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  textInput: {
    borderRadius: 10,
    padding: 16,
    backgroundColor: 'transparent',
    fontSize: 18,
    marginVertical: 20, // Espacio vertical entre los componentes
  },
  colorPickerComponent: {
    marginVertical: 20, // Agrega un margen vertical entre los componentes del ColorPicker
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  footerMenu: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF9F6',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginVertical: 10,
    marginLeft: 10,  // Margen izquierdo
    marginRight: 10, // Margen derecho
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20, // Espacio vertical para la vista centrada
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20, // Espacio vertical dentro del ScrollView
  },
  label: {
    marginTop: 20, // Espacio antes de cada etiqueta
    fontSize: 16,
  },
  slider: {
    width: '70%',
    marginVertical: 20, // Espacio vertical para el Slider
  },
  picker: {
    width: '70%',
    marginTop: 20, // Espacio antes del Picker
    marginBottom: 20, // Espacio después del Picker
  },
  profilesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  profileButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
  },
  selectedProfile: {
    backgroundColor: '#c0c0c0',
  },
  profileButtonText: {
    fontSize: 16,
  },
  previewText: {
    textAlign: 'center',
    marginVertical: 20, // Espacio vertical para el texto de previsualización
  },
}); 
  