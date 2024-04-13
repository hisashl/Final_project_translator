import React, { useState, useEffect, useRef } from 'react';
import { Modal, View, ActivityIndicator, StyleSheet, TextInput, TouchableOpacity,TouchableWithoutFeedback, KeyboardAvoidingView, Platform, ScrollView, SafeAreaView, Button, Image,Text, Alert, Animated, Easing } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { Ionicons } from '@expo/vector-icons';
import { useStyle } from './StyleContext'
import languageOptions from '../lenguajes.json';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Camera, FlashMode } from 'expo-camera';
import { getCensorOption } from './parts/censorConfig';
import * as FileSystem from 'expo-file-system';
import {BadWords} from '../BadWord';
import {firebase} from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useCustomStyles from './parts/StyleP'; // Ajusta la ruta según necesidad './parts/StyleP';
const imgDir = FileSystem.documentDirectory + '/images/';
const ensureDirExist = async () => {
  const dirInfo = await FileSystem.getInfoAsync(imgDir);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(imgDir, { intermediates: true });
  }
}

const placeholder = {
  label: 'idioma',
  value: null,
  color: '#9EA0A4',
};


const PhotoScreen = ({ route  }) => {
  const styles = useCustomStyles();

  const [showWarning, setShowWarning] = useState(true);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [heartColor, setHeartColor] = useState('#D3D3D3');
  const [image, setImage] = useState(null);
  const [imageVisible, setImageVisible] = useState(false);
  const [sourceLanguage, setSourceLanguage] = useState();
  const [targetLanguage, setTargetLanguage] = useState();
  const [textToTranslate, setTextToTranslate] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [definition, setDefinition] = useState('');
  const [synonyms, setSynonyms] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const MAX_SIZE = 30 * 1024 * 1024; 
  const [censorOption, setCensorOption] = useState('none');
  const [censorWords, setCensorWords] = useState([]); // Inicia con las palabras predeterminadas

  const selectFileFromFiles = async () => {
    if (showWarning && !dontShowAgain) {
      showTranslationWarning();
      return;
    }
    const result = await DocumentPicker.getDocumentAsync({
      type: 'image/*', // Para seleccionar solo imágenes
      copyToCacheDirectory: true, // Copia el archivo seleccionado al directorio de caché de la aplicación
    });
    


    if  (result && !result.cancelled && result.assets && result.assets.length > 0)  {
      if (!result.cancelled && result.assets[0].size > MAX_SIZE) {
        Alert.alert('Error', 'La imagen excede el límite de 30MB.');
        return;
      }
      setImageVisible(true);
      saveImage(result.assets[0].uri);
      console.log('Image URI from files:', result.assets[0].uri);
      animateText("cargando texto...");
    }
  };

  const takePhotoWithCamera = async () => {
    if (showWarning && !dontShowAgain) {
      showTranslationWarning();
      return;
    }
    const cameraPermission = await Camera.requestCameraPermissionsAsync();
    const cameraRollPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
    if (cameraPermission.status === 'granted' && cameraRollPermission.status === 'granted') {
       result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      }); 
      
  

      if  (result && !result.cancelled && result.assets && result.assets.length > 0)  { 
        if (!result.cancelled && result.assets[0].size > MAX_SIZE) {
          Alert.alert('Error', 'La imagen excede el límite de 30MB.');
          return;
        }
        setImageVisible(true);
        saveImage(result.assets[0].uri);
        console.log('Image URI from camera:', result.assets[0].uri);
        animateText("cargando texto...");
      }
    } else {
      Alert.alert('Permissions required', 'Camera and media library permissions are required to take photos');
    }
  };
   
  

  
  const translateText = async (text, targetLanguage) => {

    
    try {
       
      const translateApiUrl = 'https://translation.googleapis.com/language/translate/v2';
      const translateApiKey = 'AIzaSyCKwODEaYC4H8aB8maNH537gEWHjmQftAY'; // Reemplaza con tu clave de API de Google Translate
  
      const translateRequestBody = JSON.stringify({
        q: text,
        target: targetLanguage,
      });
  
      const translateResponse = await fetch(`${translateApiUrl}?key=${translateApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: translateRequestBody,
      });
  
      if (translateResponse.ok) {
        const translateData = await translateResponse.json();
        const translatedText = translateData.data.translations[0].translatedText;
        console.log('Translated text:', translatedText);
        return translatedText;
      } else {
        console.error('Translation error:', translateResponse.status, await translateResponse.text());
        return null;
      }
    } catch (error) {
      console.error('Translation error:', error);
      return null;
    }
  };
  

  const pickImageFromGallery = async () => {
    if (showWarning && !dontShowAgain) {
      showTranslationWarning();
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

     
    if  (result && !result.cancelled && result.assets && result.assets.length > 0)  {
      if (!result.cancelled && result.assets[0].size > MAX_SIZE) {
        Alert.alert('Error', 'La imagen excede el límite de 30MB.');
        return;
      }
      setImageVisible(true);
      saveImage(result.assets[0].uri);
      console.log('Image URI from gallery:', result.assets[0].uri);
      animateText("cargando texto...");
    }
  };
  
  const saveImage = async (uri) => {
    // Asegurarse de que el directorio existe
    await ensureDirExist();
  
    // Crear un nombre de archivo único para la imagen
    const filename = new Date().getTime() + '.jpg';
    const dest = imgDir + filename;
  
    // Copiar la imagen al directorio local
    await FileSystem.copyAsync({ from: uri, to: dest });
    setImage(dest); // Actualizar el estado de la imagen
  
    // Subir imagen a Firebase Storage
    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = firebase.storage().ref().child(`images/${filename}`);
    const uploadTask = storageRef.put(blob);
  
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Opcional: mostrar progreso de la carga
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
      },
      (error) => {
        // Manejar errores de carga
        console.error('Error al subir la imagen:', error);
        Alert.alert('Error', 'Error al subir la imagen: ' + error.message);
        animateText(ErrorMessage);
      },
      async () => {
        // Obtener URL de la imagen subida
        const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
        console.log('File available at', downloadURL);
  
        // Detectar texto en la imagen usando la API de Google Cloud Vision
        try {
          const apiUrl = 'https://vision.googleapis.com/v1/images:annotate';
          const apiKey = 'AIzaSyCKwODEaYC4H8aB8maNH537gEWHjmQftAY'; // Reemplaza con tu clave de API
  
          const requestBody = JSON.stringify({
            requests: [
              {
                image: {
                  source: { imageUri: downloadURL }
                },
                features: [
                  { type: 'TEXT_DETECTION' }
                ],
              },
            ],
          });
  
          const visionResponse = await fetch(`${apiUrl}?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: requestBody,
          });
  
          if (visionResponse.ok) {
            const data = await visionResponse.json();
            const textAnnotations = data.responses[0].textAnnotations;
            if (textAnnotations && textAnnotations.length > 0) {
              const detectedText = textAnnotations[0].description;
              console.log('Detected text:', detectedText);
               
                // Animar el texto detectado
               animateText(detectedText);
              
            
              
            } else {
              console.log('No text found in image.');
              Alert.alert('Error', 'No se detecto texto');
              setTextToTranslate("    ")
               
            }
          } else {
            console.error('Error:', visionResponse.status, await visionResponse.text());
          }
        } catch (error) {
          console.error('Error:', error);
        }
      }
    );


  };
  //setTextToTranslate
  const handleTranslation = async () => {
    
    
    if (!sourceLanguage || !targetLanguage) {
      Alert.alert('Error', 'Por favor, selecciona los idiomas de origen y destino.');
      return;
    }
    loadCensorWords();
    setIsTranslating(true);
    const translatedText = await translateText(textToTranslate, targetLanguage); // Usar el idioma de destino seleccionado por el usuario
    if (translatedText) {
      console.log('Translated text:', translatedText);
      animatetranslated(translatedText);
    }
    
  
   // Activa el estado de carga
   setIsTranslating(true);
  
  };
  
 
  const fetchCensorOption = async () => {
    const option = await getCensorOption();
    setCensorOption(option);
  };

  useEffect(() => {
    // Carga de imágenes
    const loadImages = async () => {
      await ensureDirExist();
      const files = await FileSystem.readDirectoryAsync(imgDir);
      if (files.length > 0) {
        setImage(files.map(f => imgDir + f)[0]); // Solo muestra la primera imagen
      }
    };
    loadImages(); 
    if (route.params?.data) {
      animateText(route.params.data);
    }
  
    // Llama a callCloudFunction cuando selectedWord cambia
    if (selectedWord) {
      callCloudFunction(sourcesyn, selectedWord);
    }



    fetchCensorOption();
    console.log(censorOption);
    loadCensorWords();
  }, [route.params?.data, selectedWord]);
  

  const handleImagePress = () => {
    setImageVisible(false);
    
  };
  const showTranslationWarning = () => {
    if (showWarning && !dontShowAgain) {
      Alert.alert(
        'Advertencia',
        'Si la imagen no cumple con los requisitos de texto continuo, el resultado se puede ver afectado.',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'No volver a mostrar',
            onPress: () => {
              setShowWarning(false); // No mostrar la advertencia en futuras traducciones
             
            },
          },
        ],
        { cancelable: false }
      );
      return; // Detén la ejecución de la función aquí
    }
  };

  
  const animateText = (text) => {
    let animatedText = '';
    let index = 0;
  
    const intervalId = setInterval(() => {
      animatedText += text[index];
      setTextToTranslate(animatedText);
      index++;
  
      if (index === text.length) {
        clearInterval(intervalId);
        setIsTranslating(false); // Desactiva el estado de carga una vez que la animación haya terminado
      
      }
    }, 50); // Ajusta la velocidad de la animación según sea necesario
  };
  // const animatetranslated = (text) => {
  //   let animatedText = '';
  //   let index = 0;
  
  //   const intervalId = setInterval(() => {
  //     animatedText += text[index];
  //     setTranslatedText(animatedText);
  //     index++;
  
  //     if (index === text.length) {
  //       clearInterval(intervalId);
  //       setIsTranslating(false); // Desactiva el estado de carga una vez que la animación haya terminado
      
  //     }
  //   }, 50); // Ajusta la velocidad de la animación según sea necesario
  // };

  const animatetranslated = (text) => {
    let animatedText = '';
    let index = 0;
  
    const intervalId = setInterval(() => {
      animatedText += text[index];
      // Censurar el texto hasta el último espacio para completar la palabra
      const lastSpaceIndex = animatedText.lastIndexOf(" ") + 1;
      fetchCensorOption();
      if (censorOption === "remove"){
        const textToDisplay = removeBadWordsFromText(animatedText.substring(0, lastSpaceIndex)) + animatedText.substring(lastSpaceIndex);
        setTranslatedText(textToDisplay);
      }
      if (censorOption === "censor"){
        const textToDisplay = censorWordsForDisplay(animatedText.substring(0, lastSpaceIndex)) + animatedText.substring(lastSpaceIndex);
        setTranslatedText(textToDisplay);
      }
      else {
        setTranslatedText(animatedText);
      }
      
      index++;
  
      if (index === text.length) {
        clearInterval(intervalId);
        setIsTranslating(false); // Desactiva el estado de carga una vez que la animación haya terminado
      }
    }, 50); // Ajusta la velocidad de la animación según sea necesario
  };

  const [isEditing, setIsEditing] = useState(false);
  
  const [searchWord, setSearchWord] = useState('');

  const [search, setSearch] = useState('');

  const [searcht, setSearcht] = useState('');
 
  const handlePress = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
  };
  // const getHighlightedText = (text, highlights) => {
  //   const textWords = text.split(' ');
  //   const highlightWords = highlights.toLowerCase().split(' ');
  
  //   return (
  //     <View 
  //     style = {styles.translatedText} 
  //     > 
  //     <Text>
  //       {textWords.map((word, index) => (
  //         <TouchableOpacity key={index} onPress={() => handleWordPresstrad(word)}>
  //           <Text
  //             style={[
  //               styles.word,
  //               highlightWords.includes(word.toLowerCase()) ? styles.highlightedText : null,
  //             ]}
  //           >
  //             {word + (index < textWords.length - 1 ? ' ' : '')}
  //           </Text>
  //         </TouchableOpacity>
  //       ))}
  //     </Text>
  //     </View>
  //   );
  // };
  
  
  // // Función para reemplazar palabras altisonantes visualmente
  // const censorWordsForDisplay = (word) => {
  //   const regex = new RegExp(`\\b(${BadWords.join("|")})\\b`, "gi");
  //   return word.replace(regex, (match) =>
  //     match[0] + "*".repeat(match.length - 1)
  //   );
  // };
  // const removeBadWordsFromText = (text) => {
  //   const regex = new RegExp(`\\b(${BadWords.join("|")})\\b`, "gi");
  //   return text.replace(regex, "");
  // };
  // Función para reemplazar visualmente palabras altisonantes
  async function loadCombinedCensorWords(userID) {
    // Se asume que userID se obtiene de algún contexto o es pasado como parámetro
    try {
      const response = await fetch('https://us-central1-lingua-80a59.cloudfunctions.net/getbadwords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userID })
      });
  
      const data = await response.json();
      if (response.ok && data.words) {
        // Combina las palabras predeterminadas con las personalizadas del usuario, eliminando duplicados
        return [...new Set([...BadWords, ...data.words])];
      } else {
        console.error('Failed to fetch words from the cloud:', data.message);
        return BadWords;  // Retorna solo las palabras predeterminadas si la petición falla
      }
    } catch (error) {
      console.error('Error loading censor words:', error);
      return BadWords;  // Retorna solo las palabras predeterminadas si ocurre un error
    }
  }

const censorWordsForDisplay = (word) => {
  const regex = new RegExp(`\\b(${censorWords.join("|")})\\b`, "gi");
  return word.replace(regex, (match) =>
    match[0] + "*".repeat(match.length - 1)
  );
};

// Función para eliminar palabras altisonantes del texto
const removeBadWordsFromText = (text) => {
  const regex = new RegExp(`\\b(${censorWords.join("|")})\\b`, "gi");
  return text.replace(regex, "");
};

  const getHighlightedText = (text, highlights) => {
    const textWords = text.split(' ');
    const highlightWords = highlights.toLowerCase().split(' ');
  
    return (
    <View style={styles.translatedText}>
      <Text>
        {textWords.map((word, index) => {
          let displayWord;

          switch (censorOption) {
            case 'censor':
              displayWord = censorWordsForDisplay(word);
              break;
            case 'remove':
              displayWord = removeBadWordsFromText(word);
              break;
            default:
              displayWord = word;
              break;
          }

          return displayWord ? (
            <TouchableOpacity key={index} onPress={() => handleWordPresstrad(word)}>
              <Text
                style={[
                  styles.word,
                  highlightWords.includes(word.toLowerCase()) ? styles.highlightedText : null,
                ]}
              >
                {displayWord + (index < textWords.length - 1 ? ' ' : '')}
              </Text>
            </TouchableOpacity>
          ) : null;
        })}
      </Text>
    </View>
  );
  };
  
const loadCensorWords = async () => {
  const userID = await AsyncStorage.getItem('username');
  const combinedWords = await loadCombinedCensorWords(userID);
  setCensorWords(combinedWords); // Asegúrate de que combinedWords es siempre un arreglo
};
  
  
  const check = (text, highlight) => {
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    const hasHighlight = parts.some((part) => part.toLowerCase() === highlight.toLowerCase());
  
    console.log(`Checking if "${highlight}" is in "${text}": ${hasHighlight}`);
  
    return hasHighlight;
  };
  
  
  const searchprev = () => {
    if (!sourceLanguage  ) {
      Alert.alert('Error', 'Por favor, selecciona el idioma de origen');
      return false;
    }
    return true;
  }; 
  const searchpos = () => {
    if (!targetLanguage) {
      Alert.alert('Error', 'Por favor, selecciona el idioma de destino.');
      return false;
    }
    return true;
  }; 
  const handleSearchInput = async () => {
    const foundInOriginalText = check(textToTranslate, search);
    if (foundInOriginalText ===  false){
      Alert.alert('No se encontró ', `"${search}" no se encontró en el texto original.`);
      return;
    }
    setSearchWord(search);
    console.log(`Found in original text: ${foundInOriginalText}`);
  
    if (!sourceLanguage || !targetLanguage) {
      Alert.alert('Error', 'Por favor, selecciona los idiomas de origen y destino.');
      return;
    }
  
    const translatedTextres = await translateText(search, targetLanguage);
    console.log(`Translated text: ${translatedTextres}`);
  
    if (translatedTextres) {
      const foundInTranslatedText = check(translatedText, translatedTextres);
      console.log(`Found in translated text: ${foundInTranslatedText}`);
  
      if (!foundInTranslatedText) {
        Alert.alert('No se encontró ', `"${translatedTextres}" no se encontró en el texto traducido.`);
      } else {
        setSearcht(translatedTextres);
      }
    }
  };
  
  
  const handleSearchTrans = async () => {
    const foundInOriginalText = check(translatedText, search);
     
    if (foundInOriginalText ===  false){
      Alert.alert('No se encontró ', `"${search}" no se encontró en el texto original.`);
      return;
    }
    setSearcht(search);
    setSearchWord(searcht);
     
    
    if (!sourceLanguage || !targetLanguage) {
      Alert.alert('Error', 'Por favor, selecciona los idiomas de origen y destino.');
      return;
    }
  
    const translatedWord = await translateText(search, sourceLanguage); // Traduce la palabra del idioma de destino al idioma de origen
    console.log(`Translated word back to source language: ${translatedWord}`);
  
    if (translatedWord) {
      const foundInOriginalText = check(textToTranslate, translatedWord); // Verifica si la palabra traducida inversa se encuentra en el texto original
      console.log(`Found in original text: ${foundInOriginalText}`);
  
      if (!foundInOriginalText) {
        Alert.alert('No se encontró la palabra', `La palabra "${translatedWord}" no se encontró en el texto original.`);
      } else {
        setSearchWord(translatedWord); // Subraya la palabra en el texto original
      }
    }
  };
  












































  const [selectedWord, setSelectedWord] = useState();
  const [selectedWordtrad, setSelectedWordtrad] = useState('');
  const [sourcesyn, setSourcesyn] = useState();
  const handleWordPress = (word) => {
    if(searchprev() ===  false)
    return;

    console.log("Palabra Seleccionada: " + word);
    setSynonyms(''); // Limpia los sinónimos anteriores
    setDefinition(''); // Limpia la definición anterior
    setSelectedWord(word); // Guarda la palabra seleccionada
    setSourcesyn(sourceLanguage); // Establece el idioma para la traducción
    callCloudFunction(sourceLanguage, word);
  };
  
  const handleWordPresstrad = (word) => {
    if(searchpos() ===  false)
    return;
    console.log("Palabra Seleccionada: " + word);
    setSynonyms(''); // Limpia los sinónimos anteriores
    setDefinition(''); // Limpia la definición anterior
    setSelectedWord(word); // Guarda la palabra seleccionada
    setSourcesyn(targetLanguage); // Establece el idioma para la traducción
    callCloudFunction(targetLanguage, word);
  };
  
  
  const handleLanguageChange = async (newLanguage) => {
    
    setSourcesyn(newLanguage); // Actualiza el estado con el nuevo idioma seleccionado
    if (selectedWord) { // Si hay una palabra seleccionada, actualiza la información en el nuevo idioma
      callCloudFunction(sourcesyn, selectedWord);
    }
  };
  const renderTextWithClickableWords = (text, highlights) => {
    if (!text.trim()) {  // Verifica si el texto está vacío o solo contiene espacios en blanco
      return (
        <View style={styles.sourcee}>
          <Text style={styles.place}>Introduce algo...</Text>
        </View>
      );  // Muestra la leyenda
    }
  
    const words = text.split(' ');
    const highlightWords = highlights.toLowerCase().split(' ');
  
    return (
      <View style={styles.sourcee}>
        <Text style={styles.textInput}>
          {words.map((word, index) => (
            <TouchableOpacity key={index} onPress={() => handleWordPress(word)}>
              <Text
                style={[
                  styles.word,
                  highlightWords.includes(word.toLowerCase()) ? styles.highlightedText : null
                ]}
              >
                {word + ' '}
              </Text>
            </TouchableOpacity>
          ))}
        </Text>
      </View>
    );
  };
  
  

  const callCloudFunction = async (newLanguage, word) => {
    
    console.log('palabra con llamada: ' + word);
    const translatedWord = await translateText(word, 'en'); // Traduce la palabra al inglés
    try {
      const response = await fetch('https://us-central1-lingua-80a59.cloudfunctions.net/synonyms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word: translatedWord }),
      });
      const data = await response.json();
      console.log(selectedWord, 'response:', data);
  
      const synArray = data.sinonimos.split(', '); // Divide la cadena de sinónimos en un array
      const firstThreeSynonyms = synArray.slice(0, 3).join(', '); // Toma solo los primeros tres sinónimos
      const synString = `Synonyms: ${firstThreeSynonyms}`;
      const defString = `Definition: ${data.significados}`;
  
  
      // Traduce los valores al idioma seleccionado en el modal
      const translatedSyn = await translateText(synString, newLanguage);
      const translatedDef = await translateText(defString, newLanguage);
  
      // Actualiza los estados con los valores traducidos
      setSynonyms(translatedSyn);
      setDefinition(translatedDef);
    } catch (error) {
      console.error('Error calling cloud function:', error);
    }
  
    // Muestra el modal después de que se hayan completado todas las operaciones
    setModalVisible(true);
  };
  
  
   




















  const { styler, updateStyles, theme, toggleTheme } = useStyle();
 
const pickerSelectStyles = {
  
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 2,
    borderColor: '#61a5ff',
    borderRadius: 10,
    color:  theme === 'light' ? 'black' : 'white',
    paddingRight: 30,
    backgroundColor: theme === 'light' ? '#fff' : '#2E2E2E',
    width: 130, 
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'gray',
    borderRadius: 8,
    color:  theme === 'light' ? 'black' : 'white',
    paddingRight: 30,
    backgroundColor: theme === 'light' ? '#fff' : '#2E2E2E',
    width: 130, // Adjust the width as needed
  },
  iconContainer: {
    top: 5,
    right: 15,
  },
};




const pickerSelectStylescustom = {
  
  inputIOS: {
    marginLeft: 72.5,
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: 'gray',
    borderRadius: 10,
    color:  theme === 'light' ? 'black' : 'white',
    paddingRight: 30,
    backgroundColor: theme === 'light' ? '#fff' : '#2E2E2E',
    width: 130, 
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'gray',
    borderRadius: 8,
    color:  theme === 'light' ? 'black' : 'white',
    paddingRight: 30,
    backgroundColor: theme === 'light' ? '#fff' : '#2E2E2E',
    width: 130, // Adjust the width as needed
  },
  iconContainer: {
    top: 5,
    right: 15,
  },
};



  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.navBar}>
            <Text style={styles.navTitle}>Traducir</Text>
           
            <Ionicons name="search-outline" size={24} color="gray" onPress={() => setShowSearch(!showSearch)} />
          </View>
        
          <View style={styles.footerMenu}>
            <Ionicons name="images-outline" size={24} color="gray" onPress={pickImageFromGallery}/>
            <Ionicons name="camera" size={24} color="gray"  onPress={takePhotoWithCamera} />
            <Ionicons name="folder-outline" size={24} color="gray" onPress={selectFileFromFiles} />
            <Ionicons
              name="heart"
              size={24}
              color={heartColor}
              onPress={() => setHeartColor(heartColor === '#D3D3D3' ? '#FF0000' : '#D3D3D3')}
            />
          </View>
          
          {/* {showSearch && (
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.textsearch}
                onChangeText={setSearch}
                value={search}
                placeholder="Buscar palabra"
              />
             <Text style={styles.searchButton} onPress={handleSearchInput}>
              Buscar input
            </Text>
            <Text style={styles.searchButton} onPress={handleSearchTrans}>
              Buscar trans
            </Text>
            </View>
          )} */}
          {showSearch && (
  <View style={styles.searchContainer}>
    <TextInput
      style={styles.textsearch}
      onChangeText={setSearch}
      value={search}
      multiline={true}
      placeholder="Buscar palabra"
    />
    <TouchableOpacity style={styles.searchButton} onPress={handleSearchInput}>
      <Text style={styles.searchButtonText}>Buscar input</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.searchButton} onPress={handleSearchTrans}>
      <Text style={styles.searchButtonText}>Buscar trans</Text>
    </TouchableOpacity>
  </View>
)}


  
          <View style={styles.mainContainer}>
            {image && imageVisible && (
              <TouchableOpacity onPress={handleImagePress}>
                <Image source={{ uri: image }} style={styles.image} />
              </TouchableOpacity>
            )} 
            
            <View style={styles.languageSelectorsContainer}>
            <RNPickerSelect
                placeholder={placeholder}
                items={languageOptions.map(lang => ({ label: lang.name, value: lang.code }))}
                onValueChange={(value) => setSourceLanguage(value)}
                style={pickerSelectStyles}
                value={sourceLanguage}
                useNativeAndroidPickerStyle={false}
              />
              <View style={styles.arrowIconContainer}>
                <Ionicons name="arrow-forward" size={24} color="#61a5ff" />
              </View>
              <RNPickerSelect
                placeholder={placeholder}
                items={languageOptions.map(lang => ({ label: lang.name, value: lang.code }))}
                onValueChange={(value) => setTargetLanguage(value)}
                style={pickerSelectStyles}
                value={targetLanguage}
                useNativeAndroidPickerStyle={false}
              />
            </View>
            
 
          <View>




        {isEditing ? (
         <View style={styles.sourcee}>
          <TextInput
            style={styles.textInput}
            placeholder="Escribe algo aquí..."
            onChangeText={setTextToTranslate}
            value={textToTranslate}
            multiline
            autoFocus
            onBlur={handleSave}
          />
          </View>
        ) : (
          <TouchableWithoutFeedback onPress={handlePress}>
            <View>{renderTextWithClickableWords(textToTranslate, searchWord)}</View>
          </TouchableWithoutFeedback>
        )}





      </View>

  
            <TouchableOpacity style={styles.translateButton} onPress={handleTranslation} disabled={isTranslating}>
              {isTranslating ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons name="language" size={24} color="white" />
              )}
            </TouchableOpacity>
  
            <Text>
            {getHighlightedText(translatedText, searcht)}
            </Text>
  






            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                setModalVisible(!modalVisible);
              }}
            >
              
              <View style={styles.centeredView}>
                




                <View style={styles.modalView}>
                  
                   <RNPickerSelect
                placeholder={placeholder}
                items={languageOptions.map(lang => ({ label: lang.name, value: lang.code }))}
                onValueChange={(value) => handleLanguageChange(value)}
                style={pickerSelectStylescustom}
                value={sourcesyn}
                useNativeAndroidPickerStyle={false}
              />

                  <Text style={styles.wording}> {selectedWord} </Text>



                  <Text style={styles.modalText}> {synonyms} </Text>
                  <Text style={styles.modalText}> {definition} </Text>
                  <Ionicons name="exit" size={24} color="#259CF6"    onPress={() => setModalVisible(!modalVisible)}/>
                  
                </View>
              </View>
            </Modal>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
  
}; 























export default PhotoScreen;   
  



















// import React, { useState } from 'react';
// import { SafeAreaView, Text, TouchableOpacity, StyleSheet } from 'react-native';

// const PhotoScreen = () => {
//   const [selectedWord, setSelectedWord] = useState('');

//   const text = 'Este es un ejemplo de texto con varias palabras.';
//   const words = text.split(' ');

//   const handlePressWord = (word) => {
//     setSelectedWord(word);
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       {words.map((word, index) => (
//         <TouchableOpacity key={index} onPress={() => handlePressWord(word)}>
//           <Text style={styles.word}>{word} </Text>
//         </TouchableOpacity>
//       ))}
//       <Text style={styles.selectedWord}>Palabra seleccionada: {selectedWord}</Text>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   word: {
//     fontSize: 18,
//   },
//   selectedWord: {
//     marginTop: 20,
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
// });

// export default PhotoScreen;
