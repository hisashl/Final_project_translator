import React, { useState, useEffect, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
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
import { useNavigation } from '@react-navigation/native'; 
import {BadWords} from '../BadWord';
import {firebase} from '../config';
import { Audio } from 'expo-av';
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
  
  const [corrector, setCorrector] = useState(false);
  const styles = useCustomStyles();
  const navigation = useNavigation();
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
  const [modalerrors, setModalerrors] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const MAX_SIZE = 30 * 1024 * 1024; 
  const [censorOption, setCensorOption] = useState('none');
  const [censorWords, setCensorWords] = useState([]); // Inicia con las palabras predeterminadas
  const [dontShowAgainmanchas, setDontShowAgainmanchas] = useState(false);
  const [alertShownmanchas, setAlertShownmanchas] = useState(false);
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
        
        return null;
      }
    } catch (error) {
       
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
        //console.error('Error al subir la imagen:', error);
        Alert.alert('Error', 'Error al subir la imagen: ' + error.message);
        animateText(ErrorMessage);
      },
      async () => {
        // Obtener URL de la imagen subida
        const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
        console.log('File available at', downloadURL);
       // await AsyncStorage.setItem('showAdvertenciamanchas', 'false');
        if( alertShownmanchas){
          showAlertmanchas(); 
        }
        
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
            //console.error('Error:', visionResponse.status, await visionResponse.text());
          }
        } catch (error) {
          //console.error('Error:', error);
        }
      }
    );


  };
  //setTextToTranslate
  const handleTranslation = async () => {
    setSearchWord("")
    setSearcht("");
    setCorrections({});
    setCorrector(false); 
    if (!sourceLanguage || !targetLanguage) {
      Alert.alert('Error', 'Por favor, selecciona los idiomas de origen y destino.');
      return;
    }
    if(!textToTranslate)
    {
      Alert.alert('Error', 'No hay texto que traducir');
      return;
    }
    loadCensorWords();
  
    setIsTranslating(true);
    
    let newtext = await fixfulltext();
     

  //     for (const [incorrectWord, suggestions] of Object.entries(corrections)) {
  //       // Simple if statement to skip certain corrections
  //       if (incorrectWord === ".") {
  //         continue; // Skip this correction
  //       }

        
  //       const [bestSuggestion] = suggestions.reduce((prev, current) => (current[1] > prev[1] ? current : prev));
  //       console.log(`- Replacing '${incorrectWord}' with '${bestSuggestion}'`);

  //       handleReplaceWord(incorrectWord, bestSuggestion);
  //     }
      
  //     const translatedText = await translateText(textToTranslate, targetLanguage);
  //     if (translatedText) {
  //       console.log("texto original antes de trad: " + textToTranslate);
  //       console.log('Translated text:', translatedText);
  //       animatetranslated(translatedText); 
  //     }
  //  // setTextToTranslate("Prueba rapida");
  //   }
  //   else{
    
      console.log(" AAAAAAAAAAAAAAAntes de trad bien bien: " + newtext);
      let translatedText = await translateText(newtext, targetLanguage); // Usar el idioma de destino seleccionado por el usuario

      if (translatedText) {
        console.log('Translated text:', translatedText);

        // if(targetLanguage === 'es') {
        //   translatedText = censorWordsForDisplay(translatedText);
        // }
        console.log("texto original antes de trad: " + textToTranslate);
        animatetranslated(translatedText); 
        
    }
    
  
   // Activa el estado de carga
   setIsTranslating(true);
  
  };
  const loadcorrection = async () => {
    if (corrector && sourceLanguage === 'en') {
       
      checktext();
      let correctedText = textToTranslate;
      for (const [incorrectWord, suggestions] of Object.entries(corrections)) {
      const [bestSuggestion] = suggestions[0];
      if (incorrectWord === ".") {
        continue; // Skip this correction
      }
      correctedText = correctedText.replace(new RegExp(`\\b${incorrectWord}\\b`, 'gi'), bestSuggestion);
      }
       
      return correctedText;
    }
  };
 
  const fetchCensorOption = async () => {
    const option = await getCensorOption();
    setCensorOption(option);
    console.log('Censor option:', option);
  };

  const showAlertmanchas = () => {
    Alert.alert(
      'Advertencia',
      'Si la imagen cuenta con manchas o marcas de agua sobrepuestas en el texto, se puede afectar a la detección de este.',
      [{ text: 'no volver a mostrar', onPress: handleAlertClosemanchas },
      { text: 'Entendido'}]
    );
  };

  const handleAlertClosemanchas = async () => {
    setAlertShownmanchas(false);
    await AsyncStorage.setItem('showAdvertenciamanchas', dontShowAgain ? 'false' : 'true');
  };

  const toggleDontShowAgainmanchas = (value) => {
    setDontShowAgainmanchas(value);
  };
   

  
  useFocusEffect(
    React.useCallback(() => {
      fetchCensorOption();
      console.log(censorOption);
      loadCensorWords();
      // La función que quieres ejecutar
      
       
    }, [])
  );
  useEffect(() => {
    const checkAlertSetting = async () => {
      const value = await AsyncStorage.getItem('showAdvertenciamanchas');
      if (value === null || value === 'true') {
        setAlertShownmanchas(true);
      }
    };

    checkAlertSetting();
    loadCorrector();
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
        //console.error('Failed to fetch words from the cloud:', data.message);
        return BadWords;  // Retorna solo las palabras predeterminadas si la petición falla
      }
    } catch (error) {
      //console.error('Error loading censor words:', error);
      return BadWords;  // Retorna solo las palabras predeterminadas si ocurre un error
    }
  }

// const censorWordsForDisplay = (word) => {
//   const regex = new RegExp(`\\b(${censorWords.join("|")})\\b`, "gi");
//   return word.replace(regex, (match) =>
//     match[0] + "*".repeat(match.length - 1)
//   );
// };
 

// // Función para eliminar palabras altisonantes del texto
// const removeBadWordsFromText = (text) => {
//   const regex = new RegExp(`\\b(${censorWords.join("|")})\\b`, "gi");
//   return text.replace(regex, "");
// };
 // Función para escapar caracteres especiales en regex
  // Función para escapar caracteres especiales en expresiones regulares
  const getHighlightedText = (text, highlights) => {
  


    const highlightWords = highlights ? highlights.toLowerCase().split(' ') : [];
    const censorWordsLower = censorWords.map(word => word.toLowerCase());
    
    // Function to censor the text
    const processText = (text) => {
      const textito = "yo odio los negros y eso es puto malo.";
      
      // const lowerText = text.toLowerCase();
    
      // Check if the word needs to be censored
      // if (censorWordsLower.includes(lowerText) && censorOption === 'censor') {
      //   if (text.length > 1) {
      //     // Leave the first letter and replace the rest with asterisks
      //     return text.charAt(0) + '*'.repeat(text.length - 1);
      //   }
      //   return '*';
      // }
      // if (censorWordsLower.includes(lowerText) && censorOption === 'remove') {
      //   if (text.length > 1) {
      //     // Leave the first letter and replace the rest with asterisks
      //     return ' ';
      //   }
      //   return ' ';
      // }
    
      return text;
    };
    let textToDisplay;
          
          if (censorOption === "remove") {
            textToDisplay = removeBadWordsFromText(text);
          } else if (censorOption === "censor") {
            textToDisplay = censorWordsForDisplay(text);
          }  else{
            textToDisplay = text;
          }
    // Split the text into segments and censor or highlight as needed
    const segments = textToDisplay.split(/(\s+)/).reduce((acc, segment, index) => {
      if (segment.trim()) {
        let processedSegment = processText(segment);
        const segmentLower = segment.toLowerCase();
        const isHighlighted = highlightWords.length > 0 && highlightWords.some(word => segmentLower.includes(word));
    
        acc.push(
          <TouchableOpacity key={index} onPress={() => handleWordPresstrad(segment)}>
            <Text
              style={[
                styles.word,
                isHighlighted ? styles.highlightedText : null,
              ]}
            >
              {processedSegment}
            </Text>
          </TouchableOpacity>
        );
      } else {
        acc.push(segment); // Keep spaces and line breaks as they are
      }
      return acc;
    }, []);
    
    return <View style={styles.translatedText}><Text>{segments}</Text></View>;
    };
    
  const animatetranslated = (text) => {
    let animatedText = '';
    let index = 0;
  
    const intervalId = setInterval(() => {
      animatedText += text[index]; // Incrementalmente añade texto
      const lastSpaceIndex = animatedText.lastIndexOf(" ") + 1; // Encuentra el último espacio completo
  
      let textToDisplay;
      
      if (censorOption === "remove") {
        textToDisplay = removeBadWordsFromText(animatedText.substring(0, lastSpaceIndex)) + animatedText.substring(lastSpaceIndex);
      } else if (censorOption === "censor") {
        textToDisplay = censorWordsForDisplay(animatedText.substring(0, lastSpaceIndex)) + animatedText.substring(lastSpaceIndex);
      } else {
        textToDisplay = animatedText;
      }
      
      setTranslatedText(textToDisplay);
      index++;
  
      if (index === text.length) {
        clearInterval(intervalId);
        setIsTranslating(false); // Finaliza la animación y el estado de carga
      }
    }, 50);
  };
  
  const escapeRegExp = (text) => text.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&');

  const censorWordsForDisplay = (text) => {
    if (!Array.isArray(censorWords) || censorWords.length === 0) {
      return text;
    }
  
    // Crear un patrón que coincida con cualquier palabra o frase exactamente como aparece en la lista
    const regexPattern = censorWords.map(word => 
      `\\b${word.split(" ").map(escapeRegExp).join("\\s+")}\\b`
    ).join("|");
  
    const regex = new RegExp(regexPattern, "gi");
  
    return text.replace(regex, (match) =>
      match[0] + "*".repeat(match.length - 1)
    );
  };

  const removeBadWordsFromText = (text) => {
    if (!Array.isArray(censorWords) || censorWords.length === 0) {
      return text;
    }
  
    const regexPattern = censorWords.map(word => 
      word.split(" ").map(part => escapeRegExp(part)).join("\\s+")
    ).join("|");
  
    const regex = new RegExp(`\\b(${regexPattern})\\b`, "gi");
  
    return text.replace(regex, "");
  };
    
  
 
const [corrections, setCorrections] = useState({});



const loadCorrector = async () => {
  const option  = await AsyncStorage.getItem('corrector');
  setCorrector(option);
  console.log(corrector);
} 
const fixfulltext = async () => {
  

  try {
    const response = await fetch('https://us-central1-lingua-80a59.cloudfunctions.net/correction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: textToTranslate }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Print the received JSON in the console
    console.log('JSON received:', data);

    // Initialize the corrected text
    let correctedText = data.corrected_text;

    // Iterate over the corrections and replace incorrect words
    const corrections = data.corrections;
    for (const [incorrectWord, suggestions] of Object.entries(corrections)) {
      console.log(`Incorrect word: ${incorrectWord}`);

      if (incorrectWord === ".") {
        continue; // Skip this correction
      }
      // Find the suggestion with the highest confidence
      const [bestSuggestion] = suggestions.reduce((prev, current) => (current[1] > prev[1] ? current : prev));
      console.log(`- Replacing '${incorrectWord}' with '${bestSuggestion}'`);

      // Replace incorrect word with the suggestion having the highest confidence
      correctedText = correctedText.replace(new RegExp(`\\b${incorrectWord}\\b`, 'gi'), bestSuggestion);
      
    }
    console.log(`Corrected text: ${correctedText}`);
    // Update the state with the corrected text
    //setTextToTranslate(correctedText);
    
    animateText(correctedText);
    return correctedText;
    
  } catch (error) {
    console.error('Error checking text:', error);
  }
};

const checktext = async () => {
  if (!corrector && sourceLanguage !== 'en') {
    Alert.alert("Only valid with english settings");
    return;
  }

  try {
    const response = await fetch('https://us-central1-lingua-80a59.cloudfunctions.net/correction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: textToTranslate }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Imprimir el JSON completo en la consola
    console.log('JSON recibido:', data);
 // Filtrar correcciones
 const corrections = data.corrections;
 const filteredCorrections = Object.fromEntries(
   Object.entries(corrections).filter(([incorrectWord, suggestions]) => incorrectWord !== "." )
 );
     // Imprimir las correcciones filtradas
     console.log('Correcciones filtradas:');
     for (const [incorrectWord, suggestions] of Object.entries(filteredCorrections)) {
       console.log(`Palabra incorrecta: ${incorrectWord}`);
       for (const [suggestion, confidence] of suggestions) {
         console.log(`- Sugerencia: ${suggestion}, Confianza: ${confidence}`);
       }
     }
 
     setTextToTranslate(data.corrected_text);
     setCorrections(filteredCorrections);
 
  } catch (error) {
    //console.error('Error checking text:', error);
  }
};


  //const corrector  = await AsyncStorage.getItem('corrector');
   
  // Verificar si highlights contiene algo, de lo contrario se establece como un array vacío
//   const highlightWords = highlights ? highlights.toLowerCase().split(' ') : [];
//   const censorWordsLower = censorWords.map(word => word.toLowerCase());

//   // Función para revisar si todos los segmentos de una frase están en censorWordsLower
//   const checkCensorMatch = (textSegment, censorPhrase) => {
//       const textWords = textSegment.toLowerCase().split(' ');
//       const censorWords = censorPhrase.split(' ');
//       return censorWords.every(censorWord => textWords.includes(censorWord));
//   };

//   // Procesar el texto para censura o remoción basado en censorOption
//   const processText = (text) => {
//       for (const censor of censorWordsLower) {
//           if (checkCensorMatch(text, censor)) {
//               if (censorOption === 'censor') {
//                   return '*'.repeat(text.length);
//               } else if (censorOption === 'remove') {
//                   return '';
//               }
//           }
//       }
//       return text;
//   };

//   // Dividir el texto en partes más grandes para evaluar contra frases en censorWords
//   const segments = text.split(/(\s+)/).reduce((acc, segment, index, array) => {
//       if (segment.trim()) {
//           let processedSegment = processText(segment);
//           const segmentLower = segment.toLowerCase();
//           const isHighlighted = highlightWords.length > 0 && highlightWords.some(word => segmentLower.includes(word));
//           const isCensored = censorWordsLower.includes(segmentLower) && censorOption === 'censor';

//           if (isCensored && isHighlighted) {
//               processedSegment = '*'.repeat(segment.length); // Reemplazar con asteriscos y resaltar
//           }

//           acc.push(
//               <TouchableOpacity key={index} onPress={() => handleWordPresstrad(segment)}>
//                   <Text
//                       style={[
//                           styles.word,
//                           (isHighlighted || isCensored) ? styles.highlightedText : null,
//                       ]}
//                   >
//                       {processedSegment}
//                   </Text>
//               </TouchableOpacity>
//           );
//       } else {
//           acc.push(segment); // Mantener los espacios y saltos de línea tal como están
//       }
//       return acc;
//   }, []);

//   return <View style={styles.translatedText}><Text>{segments}</Text></View>;
// };

 
  
  
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
        const similarWords = await findSimilarWords(search);
      const translatedSimilarWords = await Promise.all(similarWords.map(word => translateText(word.word, targetLanguage)));
      const foundSimilarWord = translatedSimilarWords.find(translatedWord => check(translatedText, translatedWord));
      
      if (foundSimilarWord) {
        setSearcht(foundSimilarWord);
      } else {
        Alert.alert('No se encontró una palabra que textualmente represente lo mismo dentro de la traduccion', `"${search}" se intento con ${translatedSimilarWords}`);
        setSearcht("");
      }
      } else {
        setSearcht(translatedTextres);
      }
    }
   };
  
   const findSimilarWords = async (word) => {
    try {
      const datamuseUrl = `https://api.datamuse.com/words?ml=${word}&max=5`;
      const response = await fetch(datamuseUrl);
      if (response.ok) {
        const similarWords = await response.json();
        console.log(`Similar words found: ${JSON.stringify(similarWords)}`);
        return similarWords;
      } else {
       // console.log('No similar words found');
        return [];
      }
    } catch (error) {
     // console.error('Error fetching similar words:', error);
      return [];
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
      
        
      const similarWords = await findSimilarWords(search);
      const translatedSimilarWords = await Promise.all(similarWords.map(word => translateText(word.word, sourceLanguage)));
      const foundSimilarWord = translatedSimilarWords.find(translatedWord => check(textToTranslate, translatedWord));
      
      if (foundSimilarWord) {
        setSearchWord(foundSimilarWord);
      } else {
        Alert.alert('No se encontró una palabra que textualmente represente lo mismo dentro de la traduccion', `"${search}" se intento con ${translatedSimilarWords}`);
         
      }
      } else {
        setSearchWord(translatedWord);
      }

    }
 
    
  };
  












































  const [selectedWord, setSelectedWord] = useState();
  const [selectedWordtrad, setSelectedWordtrad] = useState('');
  const [sourcesyn, setSourcesyn] = useState();
  const [sound, setSound] = useState(null);
  const [debounceTimer, setDebounceTimer] = useState(null);

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
  
  
  const playSound = async (audioUrl) => {
  
    const { sound } = await Audio.Sound.createAsync(
      { uri: audioUrl },
      { shouldPlay: true }
    );
    setSound(sound);

    await sound.playAsync();
    sound.setOnPlaybackStatusUpdate(async (playbackStatus) => {
      if (playbackStatus.didJustFinish) {
        await sound.unloadAsync();
      }
    });
  };

  const fetchPronunciation = () => {
    fetch('https://us-central1-lingua-80a59.cloudfunctions.net/text-speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ word: selectedWord, lang: sourcesyn })
    })
    .then(response => {
      if (!response.ok) {  // Verifica si la respuesta fue exitosa
        throw new Error('Failed to fetch pronunciation. The language might not be supported.');
      }
      return response.blob();
    })
    .then(blob => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        playSound(reader.result);
      };
    })
    .catch(error => {
     
      Alert.alert('Pronunciation Error', error.toString());
    });
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
  
  
  // const handleLanguageChange = async (newLanguage) => {
  //   if (newLanguage){
  //     setSourcesyn(newLanguage); // Actualiza el estado con el nuevo idioma seleccionado
  //     if (selectedWord) { // Si hay una palabra seleccionada, actualiza la información en el nuevo idioma
  //       callCloudFunction(sourcesyn, selectedWord);
  //     }
  //   }
   
  // };
  
const handleLanguageChange = (newLanguage) => {

 
   
    
    // Limpiar el timer existente si el usuario sigue seleccionando un nuevo idioma
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Establecer un nuevo timer para llamar a la función después de que el usuario haya dejado de cambiar la selección
    const timer = setTimeout(() => {
     
      setSourcesyn(newLanguage); // Actualiza el estado con el nuevo idioma seleccionado
      if (selectedWord) { // Si hay una palabra seleccionada, actualiza la información en el nuevo idioma
        callCloudFunction(newLanguage, selectedWord);
      }
    
    }, 500); // Retraso de 500 milisegundos

    setDebounceTimer(timer);
  
  
};
  // const renderTextWithClickableWords = (text, highlights) => {
  //   loadCorrector();

  //   if (!text.trim()) {  // Verifica si el texto está vacío o solo contiene espacios en blanco
  //     return (
  //       <View style={styles.sourcee}>
            
  //         <Text style={styles.place}>Introduce algo...</Text>
  //       </View>
  //     );  // Muestra la leyenda
  //   }
 

 
  //   const words = text.split(' ');
  //   const highlightWords = highlights.toLowerCase().split(' ');
  
  //   return (
  //     <View style={styles.sourcee}>
  //        <View style={styles.corrector}>
  //         <Ionicons name="search" size={24} color="#61a5ff" onPress ={checktext} />
  //       </View>
  //       <Text style={styles.textInput}>
  //         {words.map((word, index) => (
  //           <TouchableOpacity key={index} onPress={() => handleWordPress(word)}>
  //             <Text
  //               style={[
  //                 styles.word,
  //                 highlightWords.includes(word.toLowerCase()) ? styles.highlightedText : null
  //               ]}
  //             >
  //               {word + ' '}
  //             </Text>
  //           </TouchableOpacity>
            
  //         ))}
  //       </Text>
       
       
  //     </View>
  //   );
  // };
  const showModalerrors = () => { 
    setModalerrors(!modalerrors);
  }
  
  
  const renderTextWithClickableWords = (text, highlights) => {
    if (!text.trim()) {
      return (
        <View style={styles.sourcee}>
          <Text style={styles.place}>Introduce algo...</Text>
        </View>
      );
    }
  
    // Dividir por espacios para mantener palabras completas y puntuación juntos
    const words = text.split(/(\s+)/); // Mantiene los espacios intactos
    const highlightWords = highlights.toLowerCase().split(' ');
  
    return (
      <View style={styles.sourcee}>
        <View style={styles.corrector}>
          <Ionicons name="search" size={20} style={styles.lupa} color="#61a5ff" onPress={checktext} />
          <Ionicons name="swap-horizontal" size={24} style={styles.replaceerrors} color="#61a5ff" onPress={showModalerrors} />
        </View>
        <Text style={styles.textInput}>
          {words.map((word, index) => {
            // Limpiar signos de puntuación solo para palabras, dejando espacios intactos
            const cleanedWord = word.toLowerCase().replace(/[^a-z]/g, '');
            const isHighlighted = highlightWords.includes(cleanedWord);
            const isIncorrect = corrections.hasOwnProperty(cleanedWord);
  
            // Solo aplicar estilos si la palabra tiene letras, evitar espacios y puntuación
            const shouldStyle = cleanedWord.length > 0;
  
            return (
              <TouchableOpacity key={index} onPress={() => handleWordPress(word)}>
                <Text
                  style={[
                    styles.word,
                    shouldStyle && isHighlighted ? styles.highlightedText : null,
                    shouldStyle && isIncorrect ? styles.incorrectText : null // Estilo para palabras incorrectas
                  ]}
                >
                  {word}
                </Text>
              </TouchableOpacity>
            );
          })}
        </Text>
      </View>
    );
  };
  // const renderTextWithClickableWords = (text, highlights) => {
  //   // loadCorrector();
  //   // if (!corrector && sourceLanguage !== 'en') {
  //   //   checktext(text);
  //   // }
  
  //   if (!text.trim()) {
  //     return (
  //       <View style={styles.sourcee}>
  //         <Text style={styles.place}>Introduce algo...</Text>
  //       </View>
  //     );
  //   }
  
  //   const words = text.split(' ');
  //   const highlightWords = highlights.toLowerCase().split(' ');
  
  //   return (
  //     <View style={styles.sourcee}>
  //       <View style={styles.corrector}>
  //         <Ionicons name="search" size={20} style = {styles.lupa} color="#61a5ff" onPress={checktext} />
  //         <Ionicons name="swap-horizontal" size={24} style = {styles.replaceerrors} color="#61a5ff" onPress={showModalerrors} />
  //       </View>
  //       <Text style={styles.textInput}>
  //         {words.map((word, index) => {
  //           const isHighlighted = highlightWords.includes(word.toLowerCase());
  //           const isIncorrect = corrections.hasOwnProperty(word);
  
  //           return (
  //             <TouchableOpacity key={index} onPress={() => handleWordPress(word)}>
  //               <Text
  //                 style={[
  //                   styles.word,
  //                   isHighlighted ? styles.highlightedText : null,
  //                   isIncorrect ? styles.incorrectText : null // Estilo para palabras incorrectas
  //                 ]}
  //               >
  //                 {word + ' '}
  //               </Text>
  //             </TouchableOpacity>
  //           );
  //         })}
  //       </Text>
  //     </View>
  //   );
  // };
  
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
      Alert.alert('Error calling cloud function:', error);
    }
  
    // Muestra el modal después de que se hayan completado todas las operaciones
    setModalVisible(true);
  };
  
  const heartfunct = async () => {
     
    const cando = await storedtext();
    if (cando){ 
      if (translatedText){
      navigation.navigate('Stored',  { text: translatedText });}
      else {
        Alert.alert('No hay texto para guardar');  
        return;
      } 
    }
     
  }
  const storedtext = async () => {

  
    const userId = await AsyncStorage.getItem('username');
  
  try {
      const response = await fetch('https://us-central1-lingua-80a59.cloudfunctions.net/list_documents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: userId })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch documents");

      if (data.length >= 10) {
          Alert.alert("Error", "Ya has alcanzado el límite de 10 documentos.");
          navigation.navigate('Texts');
      }
       
      else {
        return true;
      }
  } catch (error) {
      Alert.alert("Error", error.message || "An error occurred");
  }
};
   



  const handleReplaceWord = (incorrectWord, suggestion) => {
    setTextToTranslate((prevText) => prevText.replace(new RegExp(`\\b${incorrectWord}\\b`, 'gi'), suggestion));
  };


  const CorrectionsModal = ({ onReplaceWord }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const correctionKeys = Object.keys(corrections);
    const currentWord = correctionKeys[currentIndex];
    const currentSuggestions = corrections[currentWord] || [];
  
    const handleNext = () => {
      if (currentIndex < correctionKeys.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    };
  
    const handlePrevious = () => {
      if (currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
    };
  
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalerrors}
        onRequestClose={() => {
          setModalerrors(!modalerrors);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.ModalTitle}>Correcciones ortográficas</Text>
            <Text style={styles.incorrectWord}>{currentWord}</Text>
            {currentSuggestions.map(([suggestion], index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  onReplaceWord(currentWord, suggestion);
                  (false);
                }}
              >
                <Text style={styles.wordings}>{suggestion}</Text>
              </TouchableOpacity>
            ))}
            <View style={styles.navigationButtons}>
            <TouchableOpacity onPress={handlePrevious} disabled={currentIndex === 0}>
              <Ionicons
                name="chevron-back"
                size={34}
                style={[styles.navigationButton, currentIndex === 0 && styles.disabledButton]}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleNext} disabled={currentIndex === correctionKeys.length - 1}>
              <Ionicons
                name="chevron-forward"
                size={34}
                style={[styles.navigationButton, currentIndex === correctionKeys.length - 1 && styles.disabledButton]}
              />
            </TouchableOpacity>
          </View>
            <Ionicons
              name="close-circle"
              size={30}
              color="#259CF6"
              onPress={() => setModalerrors(false)}
              style={styles.closeIcon}
            />
          </View>
        </View>
      </Modal>
    );
  };


  // const CorrectionsModal = ({onReplaceWord }) => {
  //   return (
  //     <Modal
  //       animationType="slide"
  //       transparent={true}
  //       visible={modalerrors}
  //       onRequestClose={() => {
  //         setModalerrors(!modalerrors);
  //       }}
  //     >
  //       <View style={styles.centeredView}>
  //         <View style={styles.modalView}>
  //           <Text style={styles.title}>Correcciones ortográficas</Text>
  //           {Object.entries(corrections).map(([incorrectWord, suggestions]) => (
  //             <View key={incorrectWord} style={styles.correctionItem}>
  //               <Text style={styles.incorrectWord}>{incorrectWord}</Text>
  //               {suggestions.map(([suggestion], index) => (
  //                 <TouchableOpacity
  //                   key={index}
  //                   onPress={() => {
  //                     onReplaceWord(incorrectWord, suggestion);
  //                     setModalerrors(false);
  //                   }}
  //                 >
  //                   <Text style={styles.suggestion}>{suggestion}</Text>
  //                 </TouchableOpacity>
  //               ))}
  //             </View>
  //           ))}
  //           <Ionicons
  //             name="close-circle"
  //             size={24}
  //             color="#259CF6"
  //             onPress={() => setModalerrors(false)}
  //             style={styles.closeIcon}
  //           />
  //         </View>
  //       </View>
  //     </Modal>
  //   );
  // };












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
              onPress={heartfunct}
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
      placeholderTextColor={theme === 'light' ? "#888" : 'gray'}
    />
    <TouchableOpacity style={styles.searchButton} onPress={handleSearchInput}>
      <Text style={styles.searchButtonText}>Entrada</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.searchButton} onPress={handleSearchTrans}>
      <Text style={styles.searchButtonText}>Traduccion</Text>
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
            <View>
              {renderTextWithClickableWords(textToTranslate, searchWord)} 
               
              </View>
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
      <Ionicons name="volume-high" size={24} color="#259CF6" style={styles.speakerIcon} onPress={fetchPronunciation}/>
      <RNPickerSelect
        placeholder={placeholder}
        items={languageOptions.map(lang => ({ label: lang.name, value: lang.code }))}
        onValueChange={handleLanguageChange}
        style={pickerSelectStylescustom}
        value={sourcesyn}
        useNativeAndroidPickerStyle={false}
      />
      <Text style={styles.wording}>{selectedWord}</Text>
      <Text style={styles.modalText}>{synonyms}</Text>
      <Text style={styles.modalText}>{definition}</Text>
      <Ionicons name="exit" size={24} color="#259CF6" onPress={() => setModalVisible(!modalVisible)}/>
    </View>
  </View>

               
            </Modal>
            <CorrectionsModal
       onReplaceWord={handleReplaceWord}
      />
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
