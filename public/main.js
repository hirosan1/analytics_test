const analytics = firebase.analytics();

console.log(typeof analytics);
console.log(analytics);

function analyze(eventName, attributeMap) {
  if (attributeMap == null) {
    attributeMap.warningMsg = "Attributes map has no value when passed.";
  }

  if (firebase.auth().currentUser != null) {
    var user = firebase.auth().currentUser;

    console.log(`Hi there ${user.displayName || "Anon"}!`);
    attributeMap.userId = user.uid;
    attributeMap.userName = user.displayName;
  }

  analytics.logEvent(eventName, attributeMap);
}

function anonymousSignIn() {
  firebase
    .auth()
    .signInAnonymously()
    .then((user) => {
      if (user != null) {
        // console.log("Credential: ", user.credential.signInMethod);
        console.log("User: ", user);

        analyze("sign_up", { method: "anonymous" });
      }
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.error(`code: ${errorCode} message: ${errorMessage}`);
    });
}

function googleSignIn() {
  var provider = new firebase.auth.GoogleAuthProvider();

  firebase
    .auth()
    .signInWithPopup(provider)
    .then((result) => {
      /** @type {firebase.auth.OAuthCredential} */
      var credential = result.credential;

      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = credential.accessToken;
      console.log("Token: ", token);

      // The signed-in user info.
      var user = result.user;
      console.info("Google User: ", user);

      analyze("sign_up", { method: "Google" });
    })
    .catch((error) => {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;

      console.error(`[${errorCode}]: ${errorMessage}`);
      console.log(`<${email}> ${credential}`);
    });
}

function signOut() {
  firebase
    .auth()
    .signOut()
    .then(() => {
      console.log("Sign-out successful!");
    })
    .catch((error) => {
      // An error happened.
      console.error("Signout error: ", error);
    });
}

// async function signIn() {
//   var user = null;
//   var method = null;

//   try {
//     user = await auth.signInAnonymously();
//     method = user.credential.signInMethod;
//     console.log("User is: ", await user);
//   } catch (error) {
//     // Handle Errors here.
//     var errorCode = error.code;
//     var errorMessage = error.message;

//     if (errorCode === "auth/operation-not-allowed") {
//       alert("You must enable Anonymous auth in the Firebase Console.");
//     } else {
//       console.error(error);
//     }
//   }

//   analytics.logEvent("login", { method });

//   console.log("User: ", user);
// }

var anonymousSignInButton = document.getElementById("anonymousSignInButton");
var googleSignInButton = document.getElementById("googleSignInButton");

var signOutButton = document.getElementById("signOutButton");

anonymousSignInButton.addEventListener(
  "click",
  () => {
    console.info("Signing in...");
    anonymousSignIn();
  },
  false,
);
googleSignInButton.addEventListener(
  "click",
  () => {
    console.info("Signing in...");
    googleSignIn();
  },
  false,
);
signOutButton.addEventListener("click", () => {
  signOut();
});

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    var uid = user.uid;
    console.log("UserId: ", uid);
  } else {
    console.log("Noone is currently logged in...");
  }
});
