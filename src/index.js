import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';

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

// get collection data - one time
// getDocs(colRef)
//   .then((snapshot) => {
//     let books = [];
//     snapshot.docs.forEach((doc) => {
//       books.push({ ...doc.data(), id: doc.id });
//     });
//     console.log(books);
//   })
//   .catch((err) => console.log(err.message));

// Firestore queries to get a particular doc from a collection
// const q = query(
//   colRef,
//   where('author', '==', 'Giffty'),
//   orderBy('createdAt')
// );

// Ordering data by timestamp
const q = query(colRef, orderBy('createdAt'));
// so instead of passing the colRef to the onSnapshot function to get the data when there is a changes, we pass in the query

// Real time collection data
// onSnapshot(colRef, (snapshot) => {
onSnapshot(q, (snapshot) => {
  let books = [];
  snapshot.docs.forEach((doc) => {
    books.push({ ...doc.data(), id: doc.id });
  });
  console.log(books);
});

// adding docs
const addBookForm = document.querySelector('.add');
addBookForm.addEventListener('submit', (e) => {
  e.preventDefault();

  addDoc(colRef, {
    title: addBookForm.title.value,
    author: addBookForm.author.value,
    createdAt: serverTimestamp(),
  }).then(() => {
    addBookForm.reset();
  });
});

// deleting docs
const deleteBookForm = document.querySelector('.delete');
deleteBookForm.addEventListener('submit', (e) => {
  e.preventDefault();

  //doc -is a firebase property that gets a reference to an individual document in the collection.
  const docRef = doc(db, 'books', deleteBookForm.id.value);

  deleteDoc(docRef).then(() => {
    deleteBookForm.reset();
  });
});
