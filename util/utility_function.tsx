import { gapi } from "gapi-script";

// List events over the next 14 days (startinf today)

function list14daysEvents() {
  // Type definition for event response
  type EventResp = {
    created: Date;
    summary: string;
    start: Date;
    end: Date;
    id: string;
    creator: {
      email: string;
      self?: boolean;
    };
  };

  if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
    console.log("Current Status: Logged In");
    // gapi.client
    //   .request({
    //     path: `https://www.googleapis.com/calendar/v3/calendars/primary`,
    //     method: "GET",
    //     // params: {},
    //   })
    //   .then(
    //     function (response) {
    //       alert("Success");
    //       console.log(response);
    //     },
    //     function (reason) {
    //       alert("Failure");
    //       console.log(reason);
    //     }
    //   );

    // For Testing
    // console.log(`Start DateTime: ${new Date().toISOString()}`);
    // console.log(
    //   `End DateTime: ${new Date(
    //     new Date().setDate(new Date().getDate() + 14)
    //   ).toISOString()}`
    // );

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
        var events_raw = response.result.items;
        var eventList: Array<EventResp> = [];

        if (events_raw.length > 0) {
          for (var i = 0; i < events_raw.length; i++) {
            var event_raw = events_raw[i];
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
            };
            eventList.push(event);
          }
          console.log("Event List:");
          console.log(eventList);
        } else {
          console.log("No upcoming events found.");
        }
      });
  } else {
    console.log("Current Status: Logged Out");
  }
}
