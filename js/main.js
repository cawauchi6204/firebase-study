'use strict';

{

const firebaseConfig = {
  apiKey: "AIzaSyAi_tQxEng10CwfWf9btKmX8tEKCjve3fU",
  authDomain: "myfirebase-e79f0.firebaseapp.com",
  databaseURL: "https://myfirebase-e79f0.firebaseio.com",
  projectId: "myfirebase-e79f0",
  storageBucket: "myfirebase-e79f0.appspot.com",
  messagingSenderId: "238311602243",
  appId: "1:238311602243:web:cc4276fd65a955ca15bcf6",
  measurementId: "G-SVGZ2237DG"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

const db =firebase.firestore();
const collection = db.collection('messages');
const auth = firebase.auth();

const message = document.getElementById('message');
const form = document.querySelector('form');
const messages = document.getElementById('messages');
const login = document.getElementById('login');
const logout = document.getElementById('logout');


login.addEventListener('click' , () => {
  auth.signInAnonymously();
})

logout.addEventListener('click' , () => {
  auth.signOut();
})

auth.onAuthStateChanged(user => {
  if (user) {
    collection.orderBy('created').onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        if (change.type === "added") {
          const li = document.createElement('li');
          li.textContent = change.doc.data().message;
          messages.appendChild(li);
        }
      })
    });
    console.log(`Logged in as:${user.id}`);
    login.classList.add('hidden');
    [logout,form,messages].forEach(el => {
      el.classList.remove('hidden');
    });
    message.focus();
    return;
  }
  console.log('Nobody is logged in');
  login.classList.remove('hidden');
    [logout,form,messages].forEach(el => {
      el.classList.add('hidden');
    });
    message.focus();
})

form.addEventListener('submit' , e => {
  e.preventDefault();

  const val = message.value.trim();
  if (val === "") {
    return;
  }

    message.value = '';
    message.focus();

  collection.add({
    message:val,
    created:firebase.firestore.FieldValue.serverTimestamp()
    // オブジェクトで渡している
  })
  .then(doc => {
    // 成功した場合
    console.log(`${doc.id}added`);

  })
  .catch(error => {
    console.log(error);
  });
});

message.focus();

}

