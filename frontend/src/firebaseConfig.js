import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAKeXKrEIpcqId7pDaOnQrRmlKf9uoRkOs",
    authDomain: "supplychain-62e61.firebaseapp.com",
    databaseURL: "https://supplychain-62e61-default-rtdb.firebaseio.com",
    projectId: "supplychain-62e61",
    storageBucket: "supplychain-62e61.firebasestorage.app",
    messagingSenderId: "1035873399491",
    appId: "1:1035873399491:web:ad954710023d17b0366876"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
