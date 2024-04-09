import { StyleSheet, Text, KeyboardAvoidingView, View, ScrollView, SafeAreaView,Platform } from 'react-native'
import React from 'react'
import { useStyle } from './StyleContext'
const TextScreen = () => {
  
  const { styler, updateStyles, theme, toggleTheme } = useStyle();

  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme === 'light' ? '#fff' : '#2E2E2E',
    },
    container: {
      flex: 1,
      backgroundColor: theme === 'light' ? '#fff' : '#2E2E2E',
    },
    scrollViewContent: {
      flexGrow: 1,
      justifyContent: 'center',
      paddingVertical: 20,
    },
  }) 

  return (
    <SafeAreaView style={styles.safeArea}>
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text> Hola bro </Text>
        </ScrollView>
        </KeyboardAvoidingView>
        </SafeAreaView>

  )
}

export default TextScreen
