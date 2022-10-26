import { useState } from "react";
import { firebase_app } from "../firebase-config";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

const auth = getAuth(firebase_app);
const provider = new GoogleAuthProvider();

export default function Home() {
  const [phone, setPhone] = useState("");
  const makeRecaphtcha = async () => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
        callback: (response) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          onSignInSubmit();
        },
      },
      auth
    );
  };

  const formDataHandler = (e) => {
    e.preventDefault();
    console.log(phone);
    makeRecaphtcha();
    const appVerifier = window.recaptchaVerifier;
    signInWithPhoneNumber(auth, "+8801626627461", appVerifier)
      .then((confirmationResult) => {
        console.log(confirmationResult);
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        window.confirmationResult = confirmationResult;
        // ...
      })
      .catch((error) => {
        console.log("error", error);
        // Error; SMS not sent
        // ...
      });
  };

  const signInWithGoogleHandler = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log(result);
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        // ...
      })
      .catch((error) => {
        console.log(error);
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  };
  return (
    <div>
      <form action="" onSubmit={formDataHandler}>
        <h2>Phon Auth</h2>
        <input
          type="number"
          name=""
          id=""
          onChange={(e) => setPhone(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>

      <div id="recaptcha-container"></div>
      <button onClick={signInWithGoogleHandler}>Sign in with google</button>
    </div>
  );
}
