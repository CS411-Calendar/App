import React, { ReactNode, SyntheticEvent, useEffect } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { gapi } from "gapi-script";
import "tailwindcss/tailwind.css";

import apiGoogleconfig from "../../config/apiGoogleconfig.json";

function UserCredentials() {
  // const username_validation = /^(?=[a-zA-Z0-9._]{3,20}$)(?!.*[_.]{2})/
  // const password_validation = //
  useEffect(() => {
    handleClientLoad();
  });

  // Client ID and API key from the Developer Console
  var CLIENT_ID = apiGoogleconfig.clientId;
  var API_KEY = apiGoogleconfig.apiKey;

  // Array of API discovery doc URLs for APIs used by the quickstart
  var DISCOVERY_DOCS = [
    "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
  ];

  // Authorization scopes required by the API; multiple scopes can be
  // included, separated by spaces.
  var SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

  /* replace this */
  // var authorizeButton = document.getElementById("authorize_button");
  // var signoutButton = document.getElementById("signout_button");

  /**
   *  On load, called to load the auth2 library and API client library.
   */
  function handleClientLoad() {
    gapi.load("client:auth2", initClient);
  }

  /**
   *  Initializes the API client library and sets up sign-in state
   *  listeners.
   */
  function initClient() {
    gapi.client.init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES,
    });
  }

  /**
   *  Sign in the user upon button click.
   */
  function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
    console.log("Logging In");
    return;
  }

  /**
   *  Sign out the user upon button click.
   */
  function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
    console.log("Logging Out");
    return;
  }

  /**
   * Print the summary and start datetime/date of the next ten events in
   * the authorized user's calendar. If no events are found an
   * appropriate message is printed.
   */
  function listUpcomingEvents() {
    if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
      gapi.client.calendar.events
        .list({
          calendarId: "primary",
          timeMin: new Date().toISOString(),
          showDeleted: false,
          singleEvents: true,
          maxResults: 10,
          orderBy: "startTime",
        })
        .then(function (response) {
          var events = response.result.items;
          console.log("Upcoming events:");

          if (events.length > 0) {
            for (var i = 0; i < events.length; i++) {
              var event = events[i];
              var when = event.start.dateTime;
              if (!when) {
                when = event.start.date;
              }
              console.log(event.summary + " (" + when + ")");
            }
          } else {
            console.log("No upcoming events found.");
          }
        });
    } else {
      console.log("Not Logged In...");
    }
  }

  function checkLoginStatus() {
    if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
      console.log("Current Status: Logged In");
    } else {
      console.log("Current Status: Logged Out");
    }
  }

  return (
    <div className="grid grid-cols-4 gap-8">
      <button
        onClick={(e) => handleAuthClick(e)}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        sign-in
      </button>
      <button
        onClick={(e) => handleSignoutClick(e)}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        sign-out
      </button>
      <button
        onClick={(e) => listUpcomingEvents()}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        list
      </button>
      <button
        onClick={(e) => checkLoginStatus()}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        status
      </button>
    </div>
  );
}

export default UserCredentials;
