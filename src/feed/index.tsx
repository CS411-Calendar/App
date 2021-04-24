// All google code
import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import Calendar from '@ericz1803/react-google-calendar'
import { API_URL } from '../constants'
import { InviteModal, CreateModal } from '../components/modal'
import {UserIcon, UserGroupIcon} from '@heroicons/react/solid'

type WeatherArgs = {
  latitude: number
  longitude: number
}
type WeatherRes = {
  temperature: number
  weather: 'snow' | 'light rain' | 'clear' | 'scattered clouds' | 'heavy rain'
}
const API_KEY = 'AIzaSyCodX0arMiAB5dM6RmFT-bfEDCl9YGn0dI'
let calendars = [
  { calendarId: '09opmkrjova8h5k5k46fedmo88@group.calendar.google.com' },
  {
    calendarId: '09opmkrjova8h5k5k46fedmo88@group.calendar.google.com',
    color: '#B241D1', //optional, specify color of calendar 2 events
  },
]

//<button type="button" >clickme! </button>
export default function Feed() {
  const [weather, setWeather] = useState<WeatherRes[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const id = useParams()

  const getWeather = async (args: WeatherArgs) => {
    try {
      const res = await fetch(
        `${API_URL}/weather?lat=${args.latitude}&long=${args.longitude}`,
      )
      if (res.status === 200) {
        const data: WeatherRes[] = await res.json()
        setWeather(data)
      }
    } catch (e) {
      console.error('Server unreachable')
    }
  }
  //component onMount similar
  useEffect(() => {
    console.log('The dynamic id: ', id)
    //check if user allowed access to geolocation
    if ('geolocation' in navigator) {
      console.log('Available')
    } else {
      console.log('Not Available')
    }

    navigator.geolocation.getCurrentPosition(function (position) {
      getWeather(position.coords)
      console.log('Latitude is :', position.coords.latitude)
      console.log('Longitude is :', position.coords.longitude)
    })
  }, [])

  function createvent(e) {
    //e.preventDefault();
    //console.log("The create event btn was clicked.");
    setShowAlert(false)
    setShowCreateModal(true)
  }

  function sendurl(e) {
    //e.preventDefault();
    //console.log("The invite btn was clicked.");
    setShowAlert(false)
    setShowInviteModal(true)
  }

  function handleCreateSubmit(e) {
    //console.log("submit the form");
    e.preventDefault()

    let startdate = e.target.elements.startdate?.value
    let enddate = e.target.elements.enddate?.value
    let starttime = e.target.elements.starttime?.value
    let endtime = e.target.elements.endtime?.value
    let event_name = e.target.elements.event_name?.value
    let event_location = e.target.elements.event_location?.value

    if(startdate=='' || enddate==''){
      setShowAlert(true)
    }
    else if (startdate > enddate) {
      setShowAlert(true)
    } else if (startdate == enddate && starttime > endtime) {
      setShowAlert(true)
    } else {
      //example output: 2021-04-16 10:24 2021-04-16 22:29 study 411 CAS344
      if (event_name == '') {
        event_name = 'New Event'
      }
      if (event_location == '') {
        event_location = 'Home'
      }
      console.log(
        startdate,
        starttime,
        enddate,
        endtime,
        event_name,
        event_location,
      )
      setShowCreateModal(false)
    }
  }

  function handleInviteSubmit(e) {
    console.log('submit the invitation form')
    e.preventDefault()

    let startdate = e.target.elements.startdate?.value
    let enddate = e.target.elements.enddate?.value
    let event_name = e.target.elements.event_name?.value
    let event_location = e.target.elements.event_location?.value

    if(startdate=='' || enddate==''){
      setShowAlert(true)
    }
    else if (startdate > enddate) {
      setShowAlert(true)
    } 
    else {
      if (event_name == '') {
        event_name = 'New Event'
      }
      if (event_location == '') {
        event_location = 'Home'
      }
      //example output: 2021-04-16 2021-04-16 study 411 CAS344
      console.log(startdate, enddate, event_name, event_location)
      setShowInviteModal(false)
    }
  }

  return (
    <div>
      <div>
        <Calendar apiKey={API_KEY} calendars={calendars} />
      </div>
      <div className="fixed left-0 top-1/4 grid grid-rows-2">
        <button className="bg-gray-300 py-2 px-2 rounded border-2 grid" onClick={createvent}>
          <UserIcon className="text-blue-500 h-7 w-7 justify-self-center"></UserIcon>
          <span className="text-xs">Add personal event</span>
          
        </button>
        {showCreateModal ? (
          <CreateModal
            {...{
              handleCreateSubmit,
              setShowAlert,
              setShowCreateModal,
              showAlert,
            }}
          />
        ) : null}
        <button className="bg-gray-300 py-2 px-2 rounded border-2 grid" onClick={sendurl}>
          <UserGroupIcon className="text-blue-500 h-7 w-7 justify-self-center"></UserGroupIcon>
          <span className="text-xs">Create invitation</span>
        </button>
        {showInviteModal ? (
          <InviteModal
            {...{
              setShowAlert,
              setShowInviteModal,
              showAlert,
              handleInviteSubmit,
            }}
          />
        ) : null}
      </div>
    </div>
  )
}
