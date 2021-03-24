const Screens = {
  login: "loginScreen",
  home: "homeScreen",
};

// Returns true if a user is signed-in.
function isUserSignedIn() {
  return !!firebase.auth().currentUser;
}

function init() {
  toggleScreens();

  showScreen(Screens.login);
}

function showScreen(screen) {
  toggleScreens();

  switch (screen) {
    case Screens.home:
      console.log("showing home screen!");
      updateVisibility(Screens.home, "visible");
      break;

    case Screens.login:
      console.log("showing login screen!");
      updateVisibility(Screens.login, "visible");
      break;

    default:
      console.log("Something must be wrong...");
      break;
  }
}

function toggleScreens() {
  console.log("Toggling screens...");

  for (const screen of Object.values(Screens)) {
    updateVisibility(screen, "hidden");
  }
}

function updateVisibility(elementId, visibility) {
  if (elementId) {
    document.getElementById(elementId).style.visibility = visibility;
  }
}

const anonymousButton = document.getElementById("anonymousSignInButton");
const googleButton = document.getElementById("googleSignInButton");
const signOutButton = document.getElementById("signOutButton");

const event1Button = document.getElementById("event1");
const event2Button = document.getElementById("event2");
const event3Button = document.getElementById("event3");
const event4Button = document.getElementById("event4");
const event5Button = document.getElementById("event5");
event1Button.addEventListener(
  "click",
  function () {
    analyze("event1", { testData: "test-data", a: 1, b: 42, c: 100 });
  },
  false,
);
event2Button.addEventListener(
  "click",
  function () {
    analyze("event2", { testData: "test-data", a: 2, b: 42, c: 100 });
  },
  false,
);
event3Button.addEventListener(
  "click",
  function () {
    analyze("event3", { testData: "test-data", b: 22, c: 32 });
  },
  false,
);
event4Button.addEventListener(
  "click",
  function () {
    analyze("event4", { testData: "test-data", c: 100 });
  },
  false,
);
event5Button.addEventListener(
  "click",
  function () {
    analyze("event5", { testData: "test-data", a: 0, b: 0, c: 1 });
  },
  false,
);

anonymousButton.addEventListener(
  "click",
  () => {
    console.log("Logging in anonymously!");
    anonymousSignIn();
  },
  false,
);

googleButton.addEventListener(
  "click",
  () => {
    console.log("Logging in with Google!");
    googleSignIn();
  },
  false,
);

signOutButton.addEventListener(
  "click",
  () => {
    console.log("Logging out...");
    signOut();
  },
  false,
);

window.addEventListener(
  "DOMContentLoaded",
  () => {
    init();
  },
  false,
);

//  /'___\ __             /\ \
// /\ \__//\_\  _ __    __\ \ \____     __      ____     __
// \ \ ,__\/\ \/\`'__\/'__`\ \ '__`\  /'__`\   /',__\  /'__`\
//  \ \ \_/\ \ \ \ \//\  __/\ \ \L\ \/\ \L\.\_/\__, `\/\  __/
//   \ \_\  \ \_\ \_\\ \____\\ \_,__/\ \__/.\_\/\____/\ \____\
//    \/_/   \/_/\/_/ \/____/ \/___/  \/__/\/_/\/___/  \/____/
const analytics = firebase.analytics();
const auth = firebase.auth();

auth.onAuthStateChanged((user) => {
  if (user) {
    var uid = user.uid;
    console.log("UserId: ", uid);
    showScreen(Screens.home);
  } else {
    showScreen(Screens.login);
    console.log("Noone is currently logged in...");
  }
});

function analyze(eventName, attributeMap) {
  if (attributeMap == null) {
    console.log("Warning: Attributes Maps is null");
  }

  if (isUserSignedIn()) {
    var user = firebase.auth().currentUser;

    console.log(`Hi there ${user.displayName || "Anon"}!`);
    attributeMap.userId = user.uid;
    attributeMap.userName = user.displayName;
  }

  analytics.logEvent(eventName, attributeMap);
  console.log(`Event: ${eventName} sent!`);
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
      console.error(`[${errorCode}]: ${errorMessage}`);
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
  auth
    .signOut()
    .then(() => {
      console.log("Signing out successful!");
    })
    .catch((error) => {
      console.error("Signing out error: ", error);
    });
}
