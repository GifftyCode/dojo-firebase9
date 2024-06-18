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
  getDoc,
  updateDoc,
} from 'firebase/firestore';

import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from 'firebase/auth';

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
const auth = getAuth();

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
const unsubCol = onSnapshot(q, (snapshot) => {
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

// Getting a single document
const docRef = doc(db, 'books', 'IkyiHZlDusxLZgbgXyU7');

// getDoc(docRef).then((doc) => {
//   console.log(doc.data(), doc.id);
// });

// Subscribing to changes on a particular doc.
const unsubDoc = onSnapshot(docRef, (doc) => {
  console.log(doc.data(), doc.id);
});

// updating a document
const updateForm = document.querySelector('.update');
updateForm.addEventListener('submit', (e) => {
  e.preventDefault();

  let docRef = doc(db, 'books', updateForm.id.value);

  updateDoc(docRef, {
    title: 'updated title',
  }).then(() => {
    updateForm.reset();
  });
});

// signing users up
const signupForm = document.querySelector('.signup');
signupForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const email = signupForm.email.value;
  const password = signupForm.password.value;

  createUserWithEmailAndPassword(auth, email, password)
    // the createUser method gives a user credential object with access to the user

    .then((cred) => {
      // console.log('User Created: ', cred.user);
      signupForm.reset();
    })
    .catch((err) => console.log(err.message));
});

// logging in and out
const logoutButton = document.querySelector('.logout');
logoutButton.addEventListener('click', () => {
  signOut(auth)
    .then(() => {
      // console.log('User Signed out');
    })
    .catch((err) => console.log(err.message));
});

const loginForm = document.querySelector('.login');
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const email = loginForm.email.value;
  const password = loginForm.password.value;

  signInWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      // console.log('User logged in: ', cred.user);
    })
    .catch((err) => console.log(err.message));

  loginForm.reset();
});

// Subscribing to auth changes
const unsubAuth = onAuthStateChanged(auth, (user) => {
  console.log('User status changed: ', user);
});

// unsubscribing from changes (auth & db)
const unsubButton = document.querySelector('.unsub');
unsubButton.addEventListener('click', () => {
  // For every firebase changes, they return an unsuscribe function and to get that, we need to store each changes in an individual variable and use the variables  here

  console.log('Unsuscribing...');
  unsubCol();
  unsubDoc();
  unsubAuth();
});
