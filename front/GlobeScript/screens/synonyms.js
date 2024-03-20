import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';

const SynonymsView = () => {
  const [word, setWord] = useState('');
  const [synonyms, setSynonyms] = useState([]);
  const [error, setError] = useState('');

  const fetchSynonyms = async () => {
    try {
      const response = await axios.post('https://us-central1-lingua-80a59.cloudfunctions.net/synonyms', { word });
      setSynonyms(response.data);
      setError('');
    } catch (err) {
      setError('Error al obtener sinónimos');
      console.error(err);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Introduce una palabra"
        value={word}
        onChangeText={setWord}
      />
      <Button title="Obtener sinónimos" onPress={fetchSynonyms} />
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        synonyms.length > 0 && (
          <Text style={styles.synonymsText}>Sinónimos: {synonyms.join(', ')}</Text>
        )
      )}
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
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
  },
  synonymsText: {
    marginTop: 10,
  },
  errorText: {
    marginTop: 10,
    color: 'red',
  },
});

export default SynonymsView;
