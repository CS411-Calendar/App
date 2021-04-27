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
  var SCOPES = "https://www.googleapis.com/auth/calendar";

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

  // Create Event function

  // helper function to parse date and time
  function convertStringToDateTime(date, time, timeZone) {
    // expected input example:
    //     date = "2021-04-24"
    //     time = "09:50"
    var date_split = date.split("-");
    var time_split = time.split(":");
    var dateTime = new Date(
      new Date().toLocaleString("en-US", { timeZone: timeZone })
    );

    for (var i = 0; i < date_split.length; i++) {
      date_split[i] = parseInt(date_split[i]);
    }

    for (i = 0; i < time_split.length; i++) {
      time_split[i] = parseInt(time_split[i]);
    }
    dateTime.setFullYear(date_split[0]);
    dateTime.setDate(date_split[2]);
    // Somehow the months counts from 0
    dateTime.setMonth(date_split[1] - 1);
    dateTime.setHours(time_split[0]);
    dateTime.setMinutes(time_split[1]);

    return dateTime;
  }

  const createEvent = async (
    eventStartDate,
    eventStartTime,
    eventEndDate,
    eventEndTime,
    eventName,
    eventLocation
  ) => {
    if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
      var timezone;

      var targetCalendarId = "primary";
      // get time zone information associated to the user's calendar
      await gapi.client.calendar.calendarList
        .get({ calendarId: "primary" })
        .then(
          function (response) {
            timezone = response.result.timeZone;
          },
          function (reason) {
            timezone = "America/New_York";
            console.log("Failed to extract time zone");
            console.log(reason);
          }
        );

      var eventStartDateTime = convertStringToDateTime(
        eventStartDate,
        eventStartTime,
        timezone
      );
      var eventEndDateTime = convertStringToDateTime(
        eventEndDate,
        eventEndTime,
        timezone
      );

      console.log(`Start: ${eventStartDateTime}; End: ${eventEndDateTime}`);

      var event = {
        summary: eventName,
        location: eventLocation,
        start: {
          dateTime: eventStartDateTime.toISOString(),
        },
        end: {
          dateTime: eventEndDateTime.toISOString(),
        },
      };
      var request = gapi.client.calendar.events.insert({
        calendarId: "primary",
        resource: event,
      });

      request.execute(function (event) {
        console.log("Event created: " + event.htmlLink);
      });

      console.log("Completed Event Insertion");
    } else {
      console.log("Not Logged In...");
    }
  };

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
        onClick={(e) =>
          createEvent(
            // Edit this part so that it takes input from user input instead of hard-coded input
            "2021-04-30",
            "09:50",
            "2021-04-30",
            "15:52",
            "testEvent",
            "Boston, MA"
          )
        }
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Create Event
      </button>
    </div>
  );
}

export default UserCredentials;
