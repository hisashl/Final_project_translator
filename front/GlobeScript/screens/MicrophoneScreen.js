import React, { useState } from 'react';
import { StyleSheet, View, Button, Text } from 'react-native';
import { Audio } from 'expo-av';
import { firebase } from '../config'; // Make sure to import your Firebase configuration

const MicrophoneScreen = () => {
  const [recording, setRecording] = useState(null);
  const [sound, setSound] = useState(null);
  const [message, setMessage] = useState("");
  const [transcript, setTranscript] = useState("");

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
        setMessage('Grabando...');
      } else {
        setMessage('Se requieren permisos de grabación.');
      }
    } catch (err) {
      console.error('Error al iniciar la grabación', err);
      setMessage('Error al iniciar la grabación');
    }
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
    setMessage(`Grabación detenida. Archivo disponible en: ${uri}`);
    loadSound(uri);
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      playThroughEarpieceAndroid: false,
    });
    saveAudio(uri);
  }

  async function loadSound(uri) {
    const { sound } = await Audio.Sound.createAsync(
      { uri },
      { shouldPlay: false }
    );
    setSound(sound);
  }

  async function playSound() {
    setMessage('Reproduciendo grabación...');
    await sound?.playAsync();
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.didJustFinish) {
        setMessage('Reproducción finalizada.');
        sound.unloadAsync();
      }
    });
  }

  async function saveAudio(uri) {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const filename = `${new Date().getTime()}.wav`;
      const storageRef = firebase.storage().ref().child(`audios/${filename}`);
      const uploadTask = storageRef.put(blob);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
        },
        (error) => {
          console.error('Error al subir el audio:', error);
          Alert.alert('Error', 'Error al subir el audio: ' + error.message);
        },
        async () => {
          const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
          console.log('File available at', downloadURL);
          transcribeAudio(downloadURL);
        }
      );
    } catch (error) {
      console.error('Error al guardar el audio:', error);
    }
  }
//AIzaSyBgmTL8HS7kfL07oM8AD7EO29jXAyW3OEQ 
async function transcribeAudio(gcsUri) {
  try {
    const apiUrl = 'https://speech.googleapis.com/v1/speech:recognize';
    const apiKey = 'AIzaSyBgmTL8HS7kfL07oM8AD7EO29jXAyW3OEQ'; // Reemplaza con tu clave de API de Google Cloud

    const requestBody = JSON.stringify({
      audio: {
        uri: gcsUri, // Asegúrate de que sea la ruta GCS del archivo de audio
      },
      config: {
        encoding: 'LINEAR16',
        languageCode: 'es-ES', // Cambia al idioma de tu audio
        sampleRateHertz: 44100,
      },
    });

    const response = await fetch(`${apiUrl}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: requestBody,
    });

    if (response.ok) {
      const data = await response.json();
      const transcript = data.results
        .map(result => result.alternatives[0].transcript)
        .join('\n');
      console.log('Transcript:', transcript);
      setTranscript(transcript);
      setMessage('Transcripción completada.');
    } else {
      console.error('Transcription error:', response.status, await response.text());
      setMessage('Error en la transcripción.');
    }
  } catch (error) {
    console.error('Transcription error:', error);
    setMessage('Error en la transcripción.');
  }
}
  return (
    <View style={styles.container}>
      <Button
        title={recording ? 'Detener Grabación' : 'Iniciar Grabación'}
        onPress={recording ? stopRecording : startRecording}
      />
      <Button
        title="Reproducir Grabación"
        onPress={playSound}
        disabled={!sound}
      />
      <Text>{message}</Text>
      {transcript ? <Text>Transcripción: {transcript}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default MicrophoneScreen;
