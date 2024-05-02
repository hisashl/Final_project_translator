    import React, { useState, useEffect} from 'react';
    import { Keyboard , TouchableWithoutFeedback , ActivityIndicator, StyleSheet, View, Alert,  Button, Text, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
    import { Audio } from 'expo-av';
    import { firebase } from '../config'; // Make sure to import your Firebase configuration
    import { Ionicons, FontAwesome5  } from '@expo/vector-icons';
    import RNPickerSelect from 'react-native-picker-select';
    import languageOptions from '../lenguajes.json';
    
import { useStyle } from './StyleContext'
    import { useNavigation } from '@react-navigation/native'; 
    const placeholder = {
      label: 'idioma',
      value: null,
      color: '#9EA0A4',
    };
    
    const MicrophoneScreen = () => {
      
      const { styler, updateStyles, theme, toggleTheme } = useStyle();
      const [recording, setRecording] = useState(null);
      const [isRecording, setIsRecording] = useState(false);
      const [sound, setSound] = useState(null);
      const [message, setMessage] = useState("");
      const [transcript, setTranscript] = useState("");
      const [fileName, setFileName] = useState('');
      const [recordTime, setRecordTime] = useState(0);
      const [sourceLanguage, setSourceLanguage] = useState();
      const [isPlaying, setIsPlaying] = useState(false);
      const [audioUri, setAudioUri] = useState('');
      const [isLoading, setIsLoading] = useState(false);
      const [inputText, setInputText] = useState('');

      const navigation = useNavigation();
 
      useEffect(() => {
        let interval;
        if (isRecording) {
          interval = setInterval(() => {
            setRecordTime((prevRecordTime) => {
              if (prevRecordTime < 60000) {
                return prevRecordTime + 100; // Incrementa en 100 milisegundos
              } else {
                clearInterval(interval);
                stopRecording(); // Detiene la grabación después de 60 segundos
                return prevRecordTime;
              }
            });
          }, 100);
        } else {
          // setRecordTime(0);
        }
        return () => clearInterval(interval);
      }, [isRecording]);


      async function startRecording() {
        try {
          const permission = await Audio.requestPermissionsAsync();
          if (permission.status === 'granted') {
            await Audio.setAudioModeAsync({
              allowsRecordingIOS: true,
              playsInSilentModeIOS: true,
              playThroughEarpieceAndroid: false,
            });
            const { recording } = await Audio.Recording.createAsync(
              Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
            );
            setRecording(recording);
            setFileName('Grabando...');
            setMessage('Grabando...');
          } else {
            Alert.alert('Importante', 'El uso del micrófono es necesario para poder detectar la voz.');
            setMessage('Se requieren permisos de grabación.');
          }
        } catch (err) {
          //console.error('Error al iniciar la grabación', err);
          setMessage('Error al iniciar la grabación');
        }
        setIsRecording(true);
        setRecordTime(0);
      }

      async function stopRecording() {
        if (!recording) {
          setMessage('No hay grabación en curso.');
          return;
        }
        setMessage('Deteniendo grabación...');
        setRecording(null);
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        setAudioUri(uri);
        setFileName("Audio Grabado...");
        setMessage(`Grabación detenida. Archivo disponible en: ${uri}`);
        loadSound(uri);
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
          playThroughEarpieceAndroid: false,
        });
        setIsRecording(false);
         
    };

      const formatTime = ms => {
        
        const seconds = Math.floor((ms % 60000) / 1000);
        const miliseconds = ((ms % 60000) % 1000) / 100;
        return ` ${seconds < 10 ? '0' : ''}${seconds}:${Math.floor(miliseconds)}`;
      };
      
      async function loadSound(uri) {
        const { sound } = await Audio.Sound.createAsync(
          { uri },
          { shouldPlay: false }
        );
        setSound(sound);
      }
      async function playSound() {
        if (sound) {
          const status = await sound.getStatusAsync();
          if (status.isPlaying) {
            await sound.pauseAsync(); // This pauses the audio if it is playing
            setIsPlaying(false);
             setFileName("Audio listo para subir...")
          } else {
            setFileName("Reproduciendo...");
            setMessage('Reproduciendo grabación...');
            await sound.playAsync();
            setIsPlaying(true);
            sound.setOnPlaybackStatusUpdate((statusUpdate) => {
              if (statusUpdate.didJustFinish) {
                setMessage('Reproducción finalizada.');
                setFileName("Audio listo para subir...");
                setIsPlaying(false); // Reset to false when playback finishes
                sound.setPositionAsync(0); // Reset the audio to the beginning for the next play
              }
            });
           
          }
        }
       
      }
      
      
      async function cancelRecording() {
        setFileName("");
        if (!recording && !sound) {
          setMessage('No hay grabación o audio para cancelar.');
          return;
        }
        if (recording) {
          await recording.stopAndUnloadAsync();
        }
        if (sound) {
          await sound.unloadAsync();
        }
        setRecording(null);
        setSound(null);
        setIsRecording(false);
        setRecordTime(0);
        setFileName('');
        setAudioUri(''); // Reset the URI
        setMessage('');
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
          playThroughEarpieceAndroid: false,
        });
        
      }
      const send = async () => {
        if (!sourceLanguage || !audioUri) {
          Alert.alert('Error', 'Por favor, completa la grabación y selecciona los idiomas de origen y destino.');
          return;
        }
        setIsLoading(true);
        await saveAudio();
        setIsLoading(false);
      };
  // async function saveAudio() {
  //   if (!audioUri) {
  //     setMessage('No hay audio para guardar.');
  //     return;
  //   }
  //   setIsLoading(true); // Inicia el indicador de carga
  //   let sendinfo;
  //   try {
  //     const response = await fetch(audioUri);
  //     const blob = await response.blob();
  //     const formData = new FormData();
  //     formData.append('file', {
  //       uri: audioUri,
  //       type: 'audio/mp3',
  //       name: 'speech2text.mp3',
  //     });
  //     const postResponse = await fetch('https://us-central1-lingua-80a59.cloudfunctions.net/upload', {
  //       method: 'POST',
  //       body: formData,
  //     });
  //     const responseData = await postResponse.json(); // Modificación aquí para manejar la respuesta como texto
  //     sendinfo = "gs://lingua_bucket/"+responseData.filename;
  //     setFileName(responseData.filename);
  //     console.log('Response:', sendinfo);
  //     console.log('Lang:', sourceLanguage);
  //     if (postResponse.status === 200) {
  //       try {
  //         const info = JSON.stringify({
  //           gcs_uri: sendinfo, // Utilizar la URL del archivo subido como GCS URI
  //           language_code: sourceLanguage
  //         });
  //         const response = await fetch('https://us-central1-lingua-80a59.cloudfunctions.net/audio', {
  //           method: 'POST',
  //           headers: {
  //             'Content-Type': 'application/json'
  //           },
  //           body: info  
  //         });
  //         const data = await response.json();
  //         console.log('Transcription:', data.transcription);
  //         setInputText(prevText => prevText + (prevText ? ' ' : '') + data.transcription);
  //       } catch (error) {
  //         console.error('Error en trans:', error);
  //       }
  //     } else {
  //       console.error('Error:', postResponse.statusText);
  //       setMessage('Error al procesar el audio.');
  //     }
  //   } catch (error) {
  //     console.error('Error:', error);
  //     setMessage('Error al procesar el audio.');
  //   } finally {
  //     setIsLoading(false); // Finaliza el indicador de carga
  //   }
  // }


  async function saveAudio(retryCount = 0) {
    if (!audioUri) {
      setMessage('No hay audio para guardar.');
      return;
    }
    setIsLoading(true); // Inicia el indicador de carga
    let sendinfo;
    try {
      const response = await fetch(audioUri);
      const blob = await response.blob();
      const formData = new FormData();
      formData.append('file', {
        uri: audioUri,
        type: 'audio/mp3',
        name: 'speech2text.mp3',
      });
      const postResponse = await fetch('https://us-central1-lingua-80a59.cloudfunctions.net/upload', {
        method: 'POST',
        body: formData,
      });
      const responseData = await postResponse.json(); // Modificación aquí para manejar la respuesta como texto
      sendinfo = "gs://lingua_bucket/"+responseData.filename;
      setFileName(responseData.filename);
      console.log('Response:', sendinfo);
      console.log('Lang:', sourceLanguage);
      if (postResponse.status === 200) {
        // Procesa la transcripción y la guarda en el estado
        processTranscription(sendinfo, sourceLanguage);
      } else {
        throw new Error('Error al procesar el audio.');
      }
    } catch (error) {
     // console.error('Error:', error);
      // Reintentar si aún quedan intentos disponibles
      if (retryCount < 3) {
        console.log(`Reintentando... Intento ${retryCount + 1}`);
        saveAudio(retryCount + 1);
      } else {
        // Notificar al usuario después del último intento fallido
        setMessage('Error al procesar el audio. Por favor, inténtalo de nuevo más tarde.');
      }
    } finally {
      setIsLoading(false); // Finaliza el indicador de carga
    }
  }
  
  async function processTranscription(sendinfo, sourceLanguage) {
    setInputText("Procesando audio...");
    try {
      const info = JSON.stringify({
        gcs_uri: sendinfo,
        language_code: sourceLanguage
      });
      const response = await fetch('https://us-central1-lingua-80a59.cloudfunctions.net/audio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: info
      });
      const data = await response.json();
      console.log('Transcription:', data.transcription);
      setInputText("");
      setInputText(prevText => prevText + (prevText ? ' ' : '') + data.transcription);
    } catch (error) {
      //console.error('Error en trans:', error);
      setInputText(' ');
    }
  }

  const getButtonColor = (isEnabled, originalColor) => {
    if (isEnabled) {
      return originalColor;
    } else {
      return theme === 'light' ? 'gray' : '#2E2E2E';
    }
  };
  const getMicIconColor = (isRecording, isMicOff) => {
    if (isRecording) {
      return 'red';
    } else if (isMicOff) {
      return theme === 'light' ? 'black' : 'white';
    } else {
      return theme === 'light' ? '#43A2BE' : 'white';
    }
  };



  const handleLanguageIconPress = () => {
   
    navigation.navigate('Photo', { data: inputText });
  };
  const pickerSelectStyles = {

    inputIOS: {
      fontSize: 16,
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderWidth: 2,
      borderColor: '#61a5ff',
      borderRadius: 10,
      color: theme === 'light' ? 'black' : 'white',
      paddingRight: 30,
      backgroundColor: theme === 'light' ? '#fff' : '#2E2E2E',
      width: 350, 
      
    },
    inputAndroid: {
      fontSize: 16,
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderWidth: 0.5,
      borderColor: 'gray',
      borderRadius: 8,
      color: theme === 'light' ? 'black' : 'white',
      paddingRight: 30,
      backgroundColor: theme === 'light' ? '#fff' : '#2E2E2E',
      width: 150, // Adjust the width as needed
    },
    iconContainer: {
      top: 5,
      right: 15,
    },
  };
  
      const styles = StyleSheet.create({
        textInputContainer: {
          flexDirection: 'row',
          alignItems: 'center',
         
          backgroundColor: theme === 'light' ? styler.backgroundColor : '#2E2E2E',
           
          borderRadius: 10,
          paddingHorizontal: 10,
          paddingVertical: 5,
          marginVertical: 10,
          marginLeft: 10,
          marginRight: 10,
        },
        
        
   
        textInput: {
          minHeight: 100, // Establece una altura mínima
          maxHeight: 200, // Establece una altura máxima (opcional)
          marginBottom: 15,
          borderRadius: 10,
          padding: 16,
          flex: 1,
          backgroundColor: 'transparent',
          fontFamily: styler.fontFamily,
          fontSize: styler.fontSize || 18, // Usa el tamaño de fuente de styler o cae de nuevo a 18
          color:  theme === 'light' ? styler.textColor : 'white', // Usa el color de texto de styler o cae de nuevo a negro
          textAlignVertical: 'top', // Alinea el texto en la parte superior
        },
        
        languageButton: {
          marginRight: 20,
        },
        
        audioInfoContainer: {
          padding: 20,
          margin: 20,
          borderWidth: 1,
          borderColor: '#ddd',
          borderRadius: 10,
          // backgroundColor: '#f9f9f9',
          alignItems: 'center', // Alinea los elementos hijos verticalmente
          justifyContent: 'center', // Centra los elementos hijos horizontalmente
          shadowColor: '#000', // Sombra para iOS
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 4, // Sombra para Android
        },
        fileNameContainer: {
          paddingVertical: 5,
          paddingHorizontal: 10,
          marginVertical: 5,
          borderRadius: 5,
          // backgroundColor: '#e9e9e9', // Cambia este color como prefieras
        },
        fileNameText: {
          
          fontWeight: 'bold',
          
          color:  theme === 'light' ? 'black' : 'white', 
        },
        timerText: {
          fontSize: 24,
          fontWeight: 'bold',
          color: '#333',
          marginBottom: 8,
        },
        
        container: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#FFF',
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
        timerContainer: {
          alignItems: 'center',
          marginBottom: 20,
        },
        timerText: {
          fontSize: 36,
          fontWeight: 'bold',
          marginVertical: 10,
          color:  theme === 'light' ? 'black' : 'white', 
        },
        audioText: {
          color: 'grey',
        },
   
        reselectButton: {
          marginTop: 10,
        },
        reselectButtonText: {
          color: '#007AFF',
        },
        controlsContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingBottom: 30,
        },
        controlButton: {
          marginHorizontal: 20,
        },
        warningContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 10,
        },
        highlightedText: {
          backgroundColor: 'yellow',
        },
        
        checkbox: {
          marginRight: 10,
        },
        warningText: {
          fontSize: 14,
          color: 'red',
        },
        safeArea: {
          flex: 1,
          backgroundColor: theme === 'light' ? '#fff' : '#2E2E2E',
        },
        languageSelectorsContainer: {
          marginLeft: 20,
          flexDirection: 'row',
          // flexDirection: 'row',
          // justifyContent: 'space-between',
          // alignItems: 'center',
          // marginBottom: 15,
        },
        arrowIconContainer: {
          marginTop: 10,
          paddingHorizontal: 10, // Adjust the padding as needed
        },
        // scrollViewContent: {
        //   flexGrow: 1,
        //   justifyContent: 'center',
        //   paddingVertical: 20,
        // },
        container: {
          flex: 1,
          backgroundColor: theme === 'light' ? '#fff' : '#2E2E2E',
        },
        image: {
          width: 350, // Ajusta el ancho según tus necesidades
          height: 200, // Ajusta la altura según tus necesidades
          marginBottom: 20,
        },
      
        navTitle: {
          fontSize: 22,
          color:  theme === 'light' ? 'black' : 'white', 
          fontWeight: 'bold',
        },
        footerMenu: {
          flexDirection: 'row',
          justifyContent: 'space-around',
          padding: 16,
          borderTopWidth: 1,
          borderColor:  '#ddd',
        },
        mainContainer: {
          flex: 1,
          paddingHorizontal: 20,
          justifyContent: 'flex-start',
          paddingTop: 20,
        },
       
        translateButton: {
          backgroundColor: '#1E90FF',
          padding: 16,
          borderRadius: 10,
          alignItems: 'center',
          marginBottom: 15,
        },
        translateButtonText: {
          color: '#fff',
          fontWeight: 'bold',
          fontSize: 16,
        },
        translatedText: {
          fontSize: 18,
          padding: 16,
          borderWidth: 1,
          borderColor: '#ddd',
          borderRadius: 10,
          backgroundColor: '#f0f0f0',
        },
      });
      
  
      return (
        <SafeAreaView style={styles.safeArea}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
              <View style={styles.navBar}>
                <Text style={styles.navTitle}>Audio</Text>
                <TouchableOpacity
  style={styles.controlButton}
  onPress={send}
  disabled={ !sound || !sourceLanguage || !audioUri || isLoading}
>
  {isLoading ? (
    <ActivityIndicator size="small" color="#000" />
  ) : (
    <Ionicons name="send" size={24} color={getButtonColor(!isLoading && sound && sourceLanguage && audioUri, "#43A2BE")} />
  )}
</TouchableOpacity>

              </View>
            
              <View style={styles.footerMenu}>
                  {/* Cancel Button */}
        <TouchableOpacity style={styles.controlButton} onPress={cancelRecording}>
           <Ionicons name="close" size={40} color={theme === 'light' ? '#000' : 'white'} />
         </TouchableOpacity>
         
 {/* Recording/Pause Button */}
 <TouchableOpacity style={styles.controlButton} onPress={recording ? stopRecording : startRecording}>
 <Ionicons
  name={isRecording ? 'mic' : 'mic-off'}
  size={40}
  color={getMicIconColor(isRecording, !isRecording)}
/>

  </TouchableOpacity>
  
  
     {/* Play/Pause Button */}
     <TouchableOpacity style={styles.controlButton} onPress={playSound} disabled={!sound}>
     <Ionicons name={isPlaying ? "pause" : "play"} size={40} color={getButtonColor(sound, "#61a5ff")} />
        </TouchableOpacity>
            </View>
              <View style={styles.audioInfoContainer}>
              <Text style={styles.timerText}>
                {formatTime(recordTime)}
              </Text>
              <View style={styles.fileNameContainer}>
                <Text style={styles.fileNameText}>{fileName}</Text>
              </View>
            </View>
            <View style={styles.languageSelectorsContainer}>
              <RNPickerSelect
                placeholder={placeholder}
                items={languageOptions.map(lang => ({ label: lang.name, value: lang.code }))}
                onValueChange={(value) => setSourceLanguage(value)}
                style={pickerSelectStyles}
                value={sourceLanguage}
                useNativeAndroidPickerStyle={false}
              />
               
            
            </View>
            <View style={styles.textInputContainer}>
              
            <TextInput
  style={styles.textInput}
  placeholder="Escribe algo aquí..."
  placeholderTextColor={theme === 'light' ? "#888" : 'gray'}  
  value={inputText}
  onChangeText={setInputText}
  multiline={true} // Permite que el TextInput tenga múltiples líneas
  numberOfLines={4} // Establece un número mínimo de líneas
/>

  <TouchableOpacity style={styles.languageButton} onPress={handleLanguageIconPress}>
    <Ionicons name="language" size={24} color="#61a5ff" />
  </TouchableOpacity>
</View>

            
            </ScrollView>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </SafeAreaView>
      );
      
    };


 
    


    export default MicrophoneScreen;  
    
