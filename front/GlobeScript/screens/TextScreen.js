import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  TextInput,
  Text,
  View,
  SafeAreaView,
  ActivityIndicator,
  FlatList,
  Button,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TextScreen = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  useEffect(() => {
    const fetchDocuments = async () => {
      const userId = await AsyncStorage.getItem('username');
      if (userId) {
        try {
          const response = await fetch(
            'https://us-central1-lingua-80a59.cloudfunctions.net/list_documents',            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ user_id: userId }),
            }
          );

          const result = await response.json();
          if (!response.ok) {
            throw new Error(result.error);
          }

          setDocuments(result);
        } catch (error) {
          console.error('Error retrieving documents:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchDocuments();
  }, []);
  const handleSearch = () => {
    // Solo realiza la búsqueda si hay un término de búsqueda ingresado
    if (searchText.trim()) {
      const filtered = documents.filter((doc) =>
        doc.title && doc.title.toLowerCase().includes(searchText.toLowerCase())
      );
      setDocuments(filtered);
    } else {
      // Si no hay texto de búsqueda, muestra todos los documentos
      setDocuments(documents);
    }
  };
  

  const renderDocument = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.text}>{item.text.substring(0, 20)}...</Text>
      <Text style={styles.date}>{item.last_modification}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
            <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by title..."
          value={searchText}
          onChangeText={setSearchText}
        />
        <Button title="Search" onPress={handleSearch} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={documents}
          renderItem={renderDocument}
          keyExtractor={(item, index) => index.toString()}
        />
        

      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  card: {
    margin: 10,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: 'grey',
  },
  text: {
    fontSize: 12,
  },
  date: {
    fontSize: 12,
    color: 'blue',
  },
});

export default TextScreen;
