// Firebase Config
var firebaseConfig = {
  apiKey: 'AIzaSyDM88Ua2wlKygYJ_IQQiy3DVafCk3YYwqw',
  authDomain: 'ehealth-7aafb.firebaseapp.com',
  databaseURL: 'https://ehealth-7aafb.firebaseio.com',
  projectId: 'ehealth-7aafb',
  storageBucket: 'ehealth-7aafb.appspot.com',
  messagingSenderId: '387488726758',
  appId: '1:387488726758:web:a52a3f97cba324bf478527',
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

/**
 * Checkes if the user is signed in,
 * then gets its assigned ID token.
 * Otherwise, redirects the user to '/login.html' page.
 * @param  {Object} user current user-info from firebase
 */
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    // User is signed in.
    console.log(user);
    var displayName = user.displayName;
    var email = user.email;
    var emailVerified = user.emailVerified;
    var photoURL = user.photoURL;
    var isAnonymous = user.isAnonymous;
    var uid = user.uid;
    var providerData = user.providerData;
    try {
      document.getElementById('profilePhoto').src = photoURL;
    } catch (e) {
      console.log(e);
    }
    //gets current user's token and save it in localstorage
    firebase
      .auth()
      .currentUser.getIdTokenResult()
      .then(function(idTokenResult) {
        console.log(idTokenResult.token);
        localStorage.setItem('token', idTokenResult.token);
        getProfile();
      })
      .catch(function(error) {
        console.log(error);
      });
  } else {
    // User is signed out and not already
    // in the '/login.html' page.
    if (window.location.pathname !== '/login.html')
      window.location = '/login.html';
  }
});

/**
 * logs users out, then redirect them to '/login.html' page
 */
const logout = () => {
  firebase
    .auth()
    .signOut()
    .then(function() {
      window.location = '/login.html';
    })
    .catch(function(error) {
      throwError(error);
    });
};
