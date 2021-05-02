import { gapi } from "gapi-script"
import apiGoogleconfig from "../config/apiGoogleconfig.json"

// Initalizes Google OAuth client
//   Only used by isAuthorized, thus no need to export as there should be no direct use of this function
const initClient = () =>
  gapi.client.init({
    apiKey: apiGoogleconfig.apiKey,
    clientId: apiGoogleconfig.clientId,
    discoveryDocs: [
      "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
    ],
    scope: "https://www.googleapis.com/auth/calendar",
  })
// OAuth Setup code
//   Every page which references gapi object must run this function in useEffect
//   Optional callback function can be added as argument. The callback function will
//   asynchronously execute after the client initialization is fully complete
export const oauthSetup = (f: () => void = () => {}) => {
  gapi.load("client:auth2", async () => {
    await initClient()
    f()
  })
}
// Helper
//   Returns boolean value representing whether the user is authorized through OAuth
//   or not.
export const isAuthorized = () => {
  // Display authorization status in console for maintainance, if needed
  // console.log(
  //   gapi.auth2.getAuthInstance().isSignedIn.get()
  //     ? "Authorized"
  //     : "Not Authorized"
  // )
  return gapi.auth2.getAuthInstance().isSignedIn.get()
}
// OAuth sign-out function
export const logout = () => gapi.auth2.getAuthInstance().signOut()
// OAuth sign-in function
//   Automatically opens a new tab/page with OAuth consent screen
export const login = () => gapi.auth2.getAuthInstance().signIn()
// Helper
//   Returns the e-mail address of the user currently logged in through OAuth
export const getEmail = () => {
  if (isAuthorized()) {
    return gapi.auth2
      .getAuthInstance()
      .currentUser.get()
      .getBasicProfile()
      .getEmail()
  } else {
    // Potentially change based on what return value will be better
    return ""
  }
}
