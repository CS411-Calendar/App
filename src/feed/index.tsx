// All google code
import React from 'react'
import Calendar from '@ericz1803/react-google-calendar'
const API_KEY = 'AIzaSyCodX0arMiAB5dM6RmFT-bfEDCl9YGn0dI'
let calendars = [
  { calendarId: '09opmkrjova8h5k5k46fedmo88@group.calendar.google.com' },
  {
    calendarId: '09opmkrjova8h5k5k46fedmo88@group.calendar.google.com',
    color: '#B241D1', //optional, specify color of calendar 2 events
  },
]

export default function Feed() {
  return (
    <div>
      <Calendar apiKey={API_KEY} calendars={calendars} />
    </div>
  )
}
