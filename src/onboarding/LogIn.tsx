import React, { useEffect } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { gapi } from "gapi-script";
import apiGoogleconfig from "../config/apiGoogleconfig.json";

function LogIn() {
  // required to use OAuth credentials */
  // START
  var CLIENT_ID = apiGoogleconfig.clientId;
  var API_KEY = apiGoogleconfig.apiKey;
  var DISCOVERY_DOCS = [
    "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
  ];
  var SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

  useEffect(() => {
    handleClientLoad();
  });

  function handleClientLoad() {
    gapi.load("client:auth2", initClient);
  }

  function initClient() {
    gapi.client.init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES,
    });
  }

  // END

  function checkAuthClick(event) {
    console.log(gapi.auth2.getAuthInstance().isSignedIn.get());
    return;
  }

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

  return (
    <div>
      <button
        onClick={(e) => checkAuthClick(e)}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Check Auth
      </button>

      <button
        onClick={(e) => listUpcomingEvents()}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        list
      </button>
    </div>
  );
}

export default LogIn;
