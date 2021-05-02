import { gapi } from "gapi-script"
import apiGoogleconfig from "../config/apiGoogleconfig.json"
import { isAuthorized } from "../lib/auth"

// Helper
//   List the next 10 upcoming events
export const listUpcoming = async () => {
  if (!isAuthorized()) {
    return []
  }
  const response = await gapi.client.calendar.events.list({
    calendarId: "primary",
    timeMin: new Date().toISOString(),
    showDeleted: false,
    singleEvents: true,
    maxResults: 10,
    orderBy: "startTime",
  })
  const events = response.result.items
  // To display individual events nicely on console, if needed
  // console.log("Upcoming events:")
  // if (events.length > 0) {
  //   for (var i = 0; i < events.length; i++) {
  //     var event = events[i]
  //     var when = event.start.dateTime
  //     if (!when) {
  //       when = event.start.date
  //     }
  //     console.log(event.summary + " (" + when + ")")
  //   }
  // } else {
  //   console.log("No upcoming events found.")
  // }
  return events
}
// Helper
//  List all events occuring over the next 14 days from now
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
    // Get info. about events occuring in the next 14 days
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
        // Initialize eventList, which will be returned
        var eventList: Array<EventResp> = []

        if (events_raw.length > 0) {
          for (var i = 0; i < events_raw.length; i++) {
            var event_raw = events_raw[i]
            // Cast the events into EventResp type
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
        }
        return eventList
      })
  } else {
    return []
  }
}
// Helper
//   Parse date, time and timezone  and return a DateTime object corresponding to each.
//   Note: timeZone variable only takes timeZone strings (e.g. "America/New_York").
// Example input:
//   date = "2021-04-24"
//   time = "09:50"
//   timeZone = "America/New_York"
function convertStringToDateTime(date, time, timeZone) {
  var date_split = date.split("-")
  var time_split = time.split(":")
  // Initialize DateTime object with specified timeZone
  var dateTime = new Date(
    new Date().toLocaleString("en-US", { timeZone: timeZone })
  )
  // Parse the date and time strings into ints
  for (var i = 0; i < date_split.length; i++) {
    date_split[i] = parseInt(date_split[i])
  }
  for (i = 0; i < time_split.length; i++) {
    time_split[i] = parseInt(time_split[i])
  }
  // Set the date and time to specified values
  dateTime.setFullYear(date_split[0])
  dateTime.setDate(date_split[2])
  // Somehow the months counts from 0
  dateTime.setMonth(date_split[1] - 1)
  dateTime.setHours(time_split[0])
  dateTime.setMinutes(time_split[1])
  return dateTime
}
// Helper
//   Create event for single attendee
// Example input:
//   eventStartDate = "2021-04-30"
//   eventStartTime = "09:50"
//   eventEndDate = "2021-04-30"
//   eventEndTime =  "15:52"
//   eventName = "testEvent"
//   eventLocation = "Boston, MA"
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
    // Get time zone information associated to the user's calendar
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

// Helper
//   Create event for multiple attendees. Attendees should be specified by passing an array of attendee emails.
// Example input:
//   eventStartDate = "2021-04-30"
//   eventStartTime = "09:50"
//   eventEndDate = "2021-04-30"
//   eventEndTime =  "15:52"
//   eventName = "testEvent"
//   eventLocation = "Boston, MA"
//   attendees = [ "test123@gmail.com", "test223@gmail.com", ... ]
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
    // Get time zone information associated to the user's calendar
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
