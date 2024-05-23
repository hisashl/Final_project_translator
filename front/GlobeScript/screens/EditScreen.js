import React, { useCallback, useState, useEffect }
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
  Switch,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
} from 'react-native'; 
import { useStyle  } from './StyleContext';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons, FontAwesome5  } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import Slider from '@react-native-community/slider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Font from 'expo-font';
import { useFonts } from 'expo-font';
import { useNavigation } from '@react-navigation/native'; 
import axios from 'axios';
import BadWords from '../BadWord';
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
  const navigation = useNavigation();
  const [profiles, setProfiles] = useState([]); // Estado para almacenar todos los perfiles
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0); // Índice del perfil actualmente seleccionado


  

  const [newWord, setNewWord] = useState('');
  const [censorWords, setCensorWords] = useState([]); // Inicia con las palabras predeterminadas
  const [censorOption, setCensorOption] = useState('none'); // Opciones: 'none', 'censor', 'remove'


  const [profileName, setProfileName] = useState('');
 
  const { styler, updateStyles, theme, toggleTheme } = useStyle();



  const [isEnabled, setIsEnabled] = useState(false);
  
  const toggleSwitch = () => {
    const newValue = !isEnabled;
    setIsEnabled(newValue);
    AsyncStorage.setItem('corrector', JSON.stringify(newValue)); // Guarda el valor como una cadena
  };
  
  const loadcorrector = async () => {
    try {
      const option = await AsyncStorage.getItem('corrector');
      if (option !== null) {
        setIsEnabled(JSON.parse(option)); // Convierte de cadena a booleano
      } else {
        setIsEnabled(false);
      }
    } catch (error) {
      //console.error('Error retrieving option:', error);
      setIsEnabled(false); // Valor predeterminado en caso de error
    }
  };
  
  
  const loadCensorOption = async () => {
    try {
      const savedCensorOption = await AsyncStorage.getItem('censorOption');
      if (savedCensorOption !== null) {
        setCensorOption(savedCensorOption);
      }
      loadCensorWords();
    } catch (error) {
     // console.error('Failed to load censor option', error);
    }
  };
  
const loadCensorWords = async () => {
   
  const userID = await AsyncStorage.getItem('username');
  console.log(userID);
   
  try {
    // Obtener palabras desde AsyncStorage primero
    const storedWords = await AsyncStorage.getItem('censorWords');
    let words = storedWords ? JSON.parse(storedWords) : [];

    // Si no hay palabras en AsyncStorage o deseas actualizarlas desde el servidor
   
      const response = await fetch('https://us-central1-lingua-80a59.cloudfunctions.net/getbadwords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userID })
      });
      const data = await response.json();
      console.log(data);
      if (response.ok && data.words) {
        words = data.words;
        // Guardar las palabras actualizadas en AsyncStorage
        // await AsyncStorage.setItem('censorWords', JSON.stringify(words));
        setCensorWords(words);
      } else {
        //console.error('Failed to fetch words from the cloud:', data.message);
      }
    

    // Establecer las palabras en el estado o hacer cualquier otra cosa necesaria con las palabras
    setCensorWords(words);
  } catch (error) {
   // console.error('Failed to load words:', error);
  }
};
  
 useEffect(() => {
  loadcorrector();
  loadProfiles();
  loadCurrentProfile();
  loadCensorOption();
  loadCensorWords();
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
          //console.error('Error saving current profile:', error);
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
     // console.error('Error loading current profile:', error);
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
        Alert.alert('Exito', 'Perfil actualizado correctamente.');
         await updateCurrentProfile(); // Actualiza el perfil actual sin cambiarlo
        // Actualiza la lista de perfiles si es necesario
      } else {
        Alert.alert('Error', 'Fallo el actualizar el perfil.');
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
  savechanges();
};

 

  const fonts = {
    'Arial': require ('../assets/fonts/Arial.ttf'),
    'Roboto': require('../assets/fonts/Roboto-Regular.ttf'),
    'Colibri': require('../assets/fonts/calibri.ttf'),
    'TimesNewRoman': require('../assets/fonts/Times_new.ttf'),
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
      Alert.alert('Error', 'User ID no encontrado.');
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
  




































const handleCensorOptionChange = async (itemValue) => {
  printCensorWords();
  loadCensorWords();
  try {
    await AsyncStorage.setItem('censorOption', itemValue);
    setCensorOption(itemValue);
    console.log(itemValue);
    
  } catch (error) {
    //console.error('Failed to save censor option', error);
  }
};
 

const printCensorWords = async () => {
  try {
    const censorWords = await AsyncStorage.getItem('censorWords');
    if (censorWords !== null) {
      console.log('Censor Words:', JSON.parse(censorWords));
    } else {
      console.log('No censor words stored.');
    }
  } catch (error) {
    //console.error('Failed to fetch censor words from AsyncStorage:', error);
  }
};

// const handleRemoveWord = async (wordToRemove) => {
//   const updatedWords = censorWords.filter(word => word !== wordToRemove);
//   setCensorWords(updatedWords);

//   try {
//     await AsyncStorage.setItem('censorWords', JSON.stringify(updatedWords));
//     Alert.alert('Success', `${wordToRemove} has been removed.`);
//   } catch (error) {
//     Alert.alert('Error', 'Failed to remove the word.');
//   }
// };
const handleAddWord = async () => {

  if (newWord && !censorWords.includes(newWord.toLowerCase())) {
    const userID = await AsyncStorage.getItem('username');
    const updatedWords = [...censorWords, newWord.toLowerCase()];
    
    try {
      // Guarda la nueva lista en AsyncStorage
      await AsyncStorage.setItem('censorWords', JSON.stringify(updatedWords));
      
      // Actualiza el estado local con la nueva lista de palabras
      setCensorWords(updatedWords);

      // Llamada a la función en la nube para actualizar la base de datos
      const response = await fetch('https://us-central1-lingua-80a59.cloudfunctions.net/badwords-funct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userID, words: updatedWords })
      });

      const result = await response.text(); // Asumimos que la respuesta es texto plano

      if (response.ok && result.includes('successfully')) {
        Alert.alert('Exito', `Palabra agregada exitosamente y lista en la nube actualizada: ${result}`);
      } else {
        throw new Error(result || 'Failed to update the cloud.');
      }

      // Limpia el campo de nueva palabra
      setNewWord('');
    } catch (error) {
      Alert.alert('Error', error.message || 'No se pudo agregar la  palabra');
    }
  } else {
    Alert.alert('Duplicado o vacio', 'La palabra ya existe o esta vacia');
  }
};

const handleRemoveWord = async (wordToRemove) => {
  const updatedWords = censorWords.filter(word => word !== wordToRemove);
  setCensorWords(updatedWords);
  const userID = await AsyncStorage.getItem('username');
  try {
    await AsyncStorage.setItem('censorWords', JSON.stringify(updatedWords));

    // Aquí hacemos la llamada a la función en la nube para actualizar la base de datos
    const response = await fetch('https://us-central1-lingua-80a59.cloudfunctions.net/badwords-funct', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userID, words: updatedWords })
    });

    const result = await response.text(); // Asumimos que la respuesta es texto plano

    if (response.ok && result.includes('successfully')) {
      Alert.alert('Exito', `${wordToRemove} fue removida exitosamente y la lista en la nube fue actualizada`);
    } else {
      throw new Error(result || 'Failed to update the cloud.');
    }
  } catch (error) {
    Alert.alert('Error', 'No se pudo remover la palabra.');
  }
};



const clearCredentials = async () => {
  try {
    await AsyncStorage.removeItem('username');
    await AsyncStorage.removeItem('password');
    console.log('Username and password have been removed');
  } catch (error) {
    console.error('Failed to clear the async storage:', error);
  }
  // try {
  //   await AsyncStorage.clear();
  //   console.log('AsyncStorage has been cleared!');
  // } catch (error) {
  //   console.error('Error clearing AsyncStorage:', error);
  // }
};


  const handleLogout = () => {
    clearCredentials();
    navigation.replace('Login');
  };

const styles = StyleSheet.create({
  scrollView: {
    width: '100%',
    padding: 10,
  },
  wordContainer: {
    flexDirection: 'row', // Cambio clave: Usa flexDirection para alinear ítems en una fila
    alignItems: 'center', // Alinea verticalmente
    marginBottom: 5, // Espacio entre items
    backgroundColor: theme === 'light' ? '#fff' : '#2E2E2E',
    
    paddingHorizontal: 10, // Espaciado horizontal dentro de cada ítem
    paddingVertical: 8, // Espaciado vertical dentro de cada ítem
    borderRadius: 5, // Bordes redondeados
  },
  wordText: {
    color: theme === 'light' ? 'black' : 'white',
    flex: 1, // Toma todo el espacio disponible dejando sólo el necesario para el botón
    fontSize: 16, // Tamaño de fuente
  },
  removeButton: {
    marginLeft: 10, // Espacio entre el texto y el botón
  },
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
    color: theme === 'light' ? 'black' : 'white',
  },
  textInput: {
    borderRadius: 10,
    padding: 16,
    backgroundColor: 'transparent',
    fontSize: 18,
    marginVertical: 20, // Espacio vertical entre los componentes
    color: theme === 'light' ? 'black' : 'white',
  },
  colorPickerComponent: {
    marginVertical: 20, // Agrega un margen vertical entre los componentes del ColorPicker
  },
  safeArea: {
    flex: 1,
    backgroundColor: theme === 'light' ? '#fff' : '#2E2E2E',
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
    backgroundColor: theme === 'light' ? '#fff' : '#2E2E2E',
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
    color: theme === 'light' ? 'black' : 'white',
  },
  labelswitch: {
    //marginTop: 20, // Espacio antes de cada etiqueta
    fontSize: 16,
    color: theme === 'light' ? 'black' : 'white',
    marginRight: 150, // Espacio entre la etiqueta y el switch
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
  












  return (
  
  //, { backgroundColor: backgroundColor }
    <SafeAreaView style={[styles.safeArea]}>
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container]}>
        
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
          <View style={styles.navBar}>
            <Text style={styles.navTitle}>Configuracion</Text>
          </View>
          <View style={styles.footerMenu}>
          <Ionicons name="create" size={40} color="#000" onPress={handleLogout}/>
            </View>
             
      <TextInput
        placeholder="Add a word to censor"
        placeholderTextColor={theme === 'light' ? "#888" : 'gray'}
        value={newWord}
        onChangeText={setNewWord}
        style = {styles.textInput}
      />
      <Button title="Agregar palabra" onPress={handleAddWord} />
     
     <Text style = {styles.label}>Lista de palabras a censurar</Text>
     <ScrollView style={styles.scrollView}>
      {censorWords.map((word, index) => (
        <View key={index} style={styles.wordContainer}>
          <Text style={styles.wordText}>{word}</Text>
          <TouchableOpacity 
            style={styles.removeButton} 
            onPress={() => handleRemoveWord(word)}
          >
            <Ionicons name="close" size={24} color="red" />
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>

            <View>
              
  <Text style = {styles.label}>Modo de censura de palabras altisonantes:</Text>
  <Picker
    selectedValue={censorOption}
    onValueChange={handleCensorOptionChange}
    style={styler.picker}
  >
    <Picker.Item label="Ninguno" value="none" />
    <Picker.Item label="Censurar con asteriscos" value="censor" />
    <Picker.Item label="Eliminar palabras" value="remove" />
  </Picker>
</View> 

 
                  {/* Aquí es donde se agrega el Switch */}
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
           <Text style={styles.labelswitch}>Corrector ortografico:</Text>
           <Switch
             trackColor={{ false: "#d3d3d3", true: "#90ee90" }}
             thumbColor={isEnabled ? "#fff" : "#fff"}
             ios_backgroundColor="#3e3e3e"
             onValueChange={toggleSwitch}
             value={isEnabled}
           />
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


<Button title="Cambiar Tema" onPress={toggleTheme} />


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
  placeholderTextColor={theme === 'light' ? "#888" : 'gray'}
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
