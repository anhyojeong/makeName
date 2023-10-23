import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";

const firebaseConfig = {
    apiKey: "AIzaSyAwIcf7ygwXnZkkQgx3HiPtkVh_UjMtgdI",
    authDomain: "makename-14ca6.firebaseapp.com",
    databaseURL: "https://makename-14ca6-default-rtdb.firebaseio.com",
    projectId: "makename-14ca6",
    storageBucket: "makename-14ca6.appspot.com",
    messagingSenderId: "222662694911",
    appId: "1:222662694911:web:49618f27babe58762a39ca",
    measurementId: "G-6HCDS7GE5P"
};

firebase.initializeApp(firebaseConfig) 
const db = firebase.firestore();

export { db };