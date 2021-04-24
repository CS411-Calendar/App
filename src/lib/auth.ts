import { gapi } from 'gapi-script'
import apiGoogleconfig from '../config/apiGoogleconfig.json'

export const initClient = () =>
  gapi.client.init({
    apiKey: apiGoogleconfig.apiKey,
    clientId: apiGoogleconfig.clientId,
    discoveryDocs:
      'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
    scope: 'https://www.googleapis.com/auth/calendar.readonly',
  })

export const isAuthorized = () => gapi.auth2.getAuthInstance().isSignedIn.get()
export const oauthSetup = () => {
  gapi.load('client:auth2', initClient)
}
export const logout = () => gapi.auth2.getAuthInstance().signOut()
export const login = () => gapi.auth2.getAuthInstance().signIn()
export const listUpcoming = async () => {
  if (!isAuthorized()) {
    return []
  }
  const response = await gapi.client.calendar.events.list({
    calendarId: 'primary',
    timeMin: new Date().toISOString(),
    showDeleted: false,
    singleEvents: true,
    maxResults: 10,
    orderBy: 'startTime',
  })

  const events = response.result.items
  console.log('Upcoming events:')

  if (events.length > 0) {
    for (var i = 0; i < events.length; i++) {
      var event = events[i]
      var when = event.start.dateTime
      if (!when) {
        when = event.start.date
      }
      console.log(event.summary + ' (' + when + ')')
    }
  } else {
    console.log('No upcoming events found.')
  }

  return events
}
