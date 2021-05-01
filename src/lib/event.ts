import { gapi } from "gapi-script"
import apiGoogleconfig from "../config/apiGoogleconfig.json"
import { isAuthorized } from "../lib/auth"

export const initClient = () =>
  gapi.client.init({
    apiKey: apiGoogleconfig.apiKey,
    clientId: apiGoogleconfig.clientId,
    discoveryDocs:
      "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
    scope: "https://www.googleapis.com/auth/calendar",
  })

// List all events occuring over the next 14 days from now
export const list14daysEvents = () => {
  // Type definition for event response
  type EventResp = {
    created: Date
    summary: string
    start: Date
    end: Date
    id: string
    creator: {
      email: string
      self?: boolean
    }
  }

  if (isAuthorized()) {
    // Get the events information
    gapi.client.calendar.events
      .list({
        calendarId: "primary",
        timeMin: new Date().toISOString(),
        timeMax: new Date(
          new Date().setDate(new Date().getDate() + 14)
        ).toISOString(),
        showDeleted: false,
        singleEvents: true,
        orderBy: "startTime",
      })
      .then(function (response) {
        var events_raw = response.result.items
        var eventList: Array<EventResp> = []

        if (events_raw.length > 0) {
          for (var i = 0; i < events_raw.length; i++) {
            var event_raw = events_raw[i]
            // cast the events into certain types
            var event: EventResp = {
              created: new Date(event_raw.created),
              summary: event_raw.summary,
              start: new Date(event_raw.start.dateTime),
              end: new Date(event_raw.end.dateTime),
              id: event_raw.id,
              creator: {
                email: event_raw.creator.email,
                self: event_raw.creator.self,
              },
            }
            eventList.push(event)
          }
          console.log("Event List:")
          console.log(eventList)
        } else {
          console.log("No upcoming events found.")
        }
      })
  } else {
    console.log("Current Status: Logged Out")
  }
}

// Create Event function
// helper function to parse date and time
function convertStringToDateTime(date, time, timeZone) {
  // expected input example:
  //     date = "2021-04-24"
  //     time = "09:50"
  var date_split = date.split("-")
  var time_split = time.split(":")
  var dateTime = new Date(
    new Date().toLocaleString("en-US", { timeZone: timeZone })
  )

  for (var i = 0; i < date_split.length; i++) {
    date_split[i] = parseInt(date_split[i])
  }

  for (i = 0; i < time_split.length; i++) {
    time_split[i] = parseInt(time_split[i])
  }
  dateTime.setFullYear(date_split[0])
  dateTime.setDate(date_split[2])
  // Somehow the months counts from 0
  dateTime.setMonth(date_split[1] - 1)
  dateTime.setHours(time_split[0])
  dateTime.setMinutes(time_split[1])

  return dateTime
}

// Create event for single attendee
// Example Use:
// createEvent("2021-04-30", "09:50", "2021-04-30", "15:52", "testEvent", "Boston, MA")
export const createSingleEvent = async (
  eventStartDate,
  eventStartTime,
  eventEndDate,
  eventEndTime,
  eventName,
  eventLocation
) => {
  if (isAuthorized()) {
    var timezone
    // get time zone information associated to the user's calendar
    await gapi.client.calendar.calendarList.get({ calendarId: "primary" }).then(
      function (response) {
        timezone = response.result.timeZone
      },
      function (reason) {
        timezone = "America/New_York"
        console.log("Failed to extract time zone")
        console.log(reason)
      }
    )

    // Convert event start / end DateTime and time zone string into DateTime object
    var eventStartDateTime = convertStringToDateTime(
      eventStartDate,
      eventStartTime,
      timezone
    )
    var eventEndDateTime = convertStringToDateTime(
      eventEndDate,
      eventEndTime,
      timezone
    )

    // Construct event details
    var event = {
      summary: eventName,
      location: eventLocation,
      start: {
        dateTime: eventStartDateTime.toISOString(),
      },
      end: {
        dateTime: eventEndDateTime.toISOString(),
      },
    }

    // Construct the claendar event insert request and execute it
    var request = gapi.client.calendar.events.insert({
      calendarId: "primary",
      resource: event,
    })
    request.execute(function (event) {
      console.log("Event created: " + event.htmlLink)
    })
  } else {
    console.log("Not Logged In...")
  }
}

// INPUT: startDateTime, endDateTime, Location, Title, List of attendees (emails)
// Create event for single attendee
// Example Use:
// createAttendeeEvent("2021-04-30", "09:50", "2021-04-30", "15:52", "testEvent", "Boston, MA", [ "test123@gmail.com", "test223@gmail.com", ... ])
export const createAttendeeEvent = async (
  eventStartDate: String,
  eventStartTime: String,
  eventEndDate: String,
  eventEndTime: String,
  eventName: String,
  eventLocation: String,
  attendees: String[]
) => {
  if (isAuthorized()) {
    var timezone
    // get time zone information associated to the user's calendar
    await gapi.client.calendar.calendarList.get({ calendarId: "primary" }).then(
      function (response) {
        timezone = response.result.timeZone
      },
      function (reason) {
        timezone = "America/New_York"
        console.log("Failed to extract time zone")
        console.log(reason)
      }
    )

    // Convert event start / end DateTime and time zone string into DateTime object
    var eventStartDateTime = convertStringToDateTime(
      eventStartDate,
      eventStartTime,
      timezone
    )
    var eventEndDateTime = convertStringToDateTime(
      eventEndDate,
      eventEndTime,
      timezone
    )

    // Construct attendee list
    const attendeeFormatted = attendees.map((attendee) => ({
      email: attendee,
    }))

    // [ { email: "new@example.com"} ]

    // Construct event details
    var event = {
      summary: eventName,
      location: eventLocation,
      attendees: attendeeFormatted,
      start: {
        dateTime: eventStartDateTime.toISOString(),
      },
      end: {
        dateTime: eventEndDateTime.toISOString(),
      },
    }

    // Construct the claendar event insert request and execute it
    var request = gapi.client.calendar.events.insert({
      calendarId: "primary",
      sendUpdates: "all",
      resource: event,
    })
    request.execute(function (event) {
      console.log("Event created: " + event.htmlLink)
    })
  } else {
    console.log("Not Logged In...")
  }
}
