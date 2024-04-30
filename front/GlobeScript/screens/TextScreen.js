import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  TextInput,
  Text,
  View,
  SafeAreaView,
  ActivityIndicator,
  FlatList,
  Button,
  Alert,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useFocusEffect , useNavigation } from '@react-navigation/native';


const TextScreen = () => {
  const navigation = useNavigation();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  

  const handleFocus = useCallback(() => {
    console.log('Screen is focused');

    fetchDocuments();

    return () => {
     
      console.log('Screen is unfocused');
    };
  }, []);

  useFocusEffect(handleFocus);
  

  const fetchDocuments = async () => {
    const userId = await AsyncStorage.getItem('username');
    if (userId) {
      try {
        const response = await fetch(
          'https://us-central1-lingua-80a59.cloudfunctions.net/list_documents',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_id: userId }),
          }
        );
        const result = await response.json();
        console.log('Fetched documents:', result);
        if (!response.ok) {
          throw new Error(result.error || 'Failed to retrieve documents');
        }
        setDocuments(result);
      } catch (error) {
        console.error('Error retrieving documents:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteDocument = async (doc) => {
    
    const userId = await AsyncStorage.getItem('username');
   
    const response = await fetch(
      'https://us-central1-lingua-80a59.cloudfunctions.net/remove_document',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          document_id: doc.document_id,
          
        }),
      }
    );
    
    const result = await response.json();
 
    
    if (response.ok) {
      Alert.alert('Success', 'Document deleted successfully.');
      fetchDocuments(); // Refresh the list after deletion
    } else {
      Alert.alert('Error', result.error || 'Failed to delete the document.');
    }
    fetchDocuments();
  };
  const renderDocument = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ShowText', { document: item })}
    >
      <Text style={styles.title}>{item.title || 'No Title'}</Text>
      <Text style={styles.description}>{item.description || 'No Description'}</Text>
      <Text style={styles.text}>{item.text ? item.text.substring(0, 20) + '...' : 'No Text Available'}</Text>
      <Text style={styles.date}>{item.last_modification || 'No Date'}</Text>
      <Button title="Delete" onPress={() => handleDeleteDocument(item)} />
    </TouchableOpacity>
  );
  
  

  return (
    <SafeAreaView style={styles.safeArea}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by title..."
        value={searchText}
        onChangeText={setSearchText}
      />
     <Button title="Search" onPress={() => {
  const filtered = documents.filter((doc) =>
    doc.title && doc.title.toLowerCase().includes(searchText.toLowerCase())
  );
  setDocuments(filtered);
}} />

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
















