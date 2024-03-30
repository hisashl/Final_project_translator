import { StyleSheet } from 'react-native';


const styles = StyleSheet.create({
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
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
    },
    modalView: {
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    modalText: {
      marginBottom: 15,
      textAlign: 'center',
    },
    buttonClose: {
      backgroundColor: '#F194FF',
    },
    textStyle: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    safeArea: {
      flex: 1,
      backgroundColor: '#fff',
    },
    languageSelectorsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 15,
    },
    arrowIconContainer: {
      paddingHorizontal: 10, // Adjust the padding as needed
    },
    scrollViewContent: {
      flexGrow: 1,
      justifyContent: 'center',
      paddingVertical: 20,
    },
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    image: {
      width: 350, // Ajusta el ancho según tus necesidades
      height: 200, // Ajusta la altura según tus necesidades
      marginBottom: 20,
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
    footerMenu: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 16,
      borderTopWidth: 1,
      borderColor: '#ddd',
    },
    mainContainer: {
      flex: 1,
      paddingHorizontal: 20,
      justifyContent: 'flex-start',
      paddingTop: 20,
    },
    
    textInput: {
      marginBottom: 15,
      borderRadius: 10,
      padding: 16,
      flex: 1,
      backgroundColor: 'transparent',
      fontSize: 18,
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
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'right',
      marginBottom: 15,
    },
    searchButton: {
      marginRight: 10,
      backgroundColor: '#61a5ff',
      padding: 10,
      borderRadius: 5,
    },
    
  });
  export default styles;