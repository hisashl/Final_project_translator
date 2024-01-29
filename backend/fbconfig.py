import pyrebase

firebaseConfig = {
  'apiKey' : "AIzaSyBMhw5HuOItTMNIAfaLwTVTC4P6C0BJpts",
  'authDomain' : "trad-406b0.firebaseapp.com",
  'databaseURL': "https://trad-406b0-default-rtdb.firebaseio.com",
  'projectId': "trad-406b0",
  'storageBucket': "trad-406b0.appspot.com",
  'messagingSenderId': "19183361369",
  'appId': "1:19183361369:web:29c55b91167f0dec49c048",
  'measurementId' : "G-6XVYXF2KRW"
}
firebase = pyrebase.initialize_app(firebaseConfig)

db = firebase.database()
auth = firebase.auth()
#storage = firebase.storage()
 
#login 
email = input("Enter your email: ")
password = input("Enter your password: ")
#auth.sign_in_with_email_and_password(email, password)
#auth.create_user_with_email_and_password(email, password)