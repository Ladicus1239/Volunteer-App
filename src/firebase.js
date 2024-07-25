import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"
// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
    apiKey: "AIzaSyBGAE6ALhdXxF4WyuJJ44NuczqYEpURERA",
    authDomain: "volunteer-app-80a7d.firebaseapp.com",
    projectId: "volunteer-app-80a7d",
    storageBucket: "volunteer-app-80a7d.appspot.com",
    messagingSenderId: "444585380898",
    appId: "1:444585380898:web:0955019c63aceff4d24e7b",
    measurementId: "G-TC0N1FS5F9"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
export { app };
export default db