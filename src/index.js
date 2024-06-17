import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyARwSV9jBijJs9F8eaKXai7L3yVy20Mf3g',
  authDomain: 'fir-9-dojo-c6c84.firebaseapp.com',
  projectId: 'fir-9-dojo-c6c84',
  storageBucket: 'fir-9-dojo-c6c84.appspot.com',
  messagingSenderId: '529211332696',
  appId: '1:529211332696:web:277bb0aaf21bfd2c63522d',
};

// init firebase app
initializeApp(firebaseConfig);

// init services
const db = getFirestore();

// collection ref
const colRef = collection(db, 'books');

// get collection data
getDocs(colRef)
  .then((snapshot) => {
    let books = [];
    snapshot.docs.forEach((doc) => {
      books.push({ ...doc.data(), id: doc.id });
    });
    console.log(books);
  })
  .catch((err) => console.log(err.message));
