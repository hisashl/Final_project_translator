import firebase from "firebase/compat/app";
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import  'firebase/compat/storage'
const firebaseConfig = {
    apiKey: "AIzaSyDZeSf5A0wvXSmwjRZu0-i22vey4Q20K0U",
    authDomain: "lingua-80a59.firebaseapp.com",
    databaseURL: "https://lingua-80a59-default-rtdb.firebaseio.com",
    projectId: "lingua-80a59",
    storageBucket: "lingua-80a59.appspot.com",
    messagingSenderId: "30523922494",
    appId: "1:30523922494:web:7c6576ada75ab116a8596f",
    measurementId: "G-1DR9DYT1N8"
  };
if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
}  
export {firebase};