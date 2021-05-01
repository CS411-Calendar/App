import { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import Calendar from '@ericz1803/react-google-calendar'
import { API_URL } from '../constants'
import { InviteModal, CreateModal } from '../components/modal'
import { UserIcon, UserGroupIcon } from '@heroicons/react/solid'
import { createSingleEvent } from '../lib/event'
import { oauthSetup, isAuthorized, getEmail } from '../lib/auth'
import apiGoogleconfig from '../config/apiGoogleconfig.json'
import { Loading } from '../components/EmptyState'
type WeatherArgs = {
  latitude: number
  longitude: number
}
export type WeatherRes = {
  temperature: number
  weather: string
}
const API_KEY = apiGoogleconfig.apiKey

export default function Feed() {
  const [email, setEmail] = useState<string | null>(null)
  const [weather, setWeather] = useState<WeatherRes[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const history = useHistory()

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

  const sendToLanding = () => {
    if (!isAuthorized()) {
      history.push('/')
    }
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) =>
      getWeather(position.coords),
    )
    oauthSetup(() => {
      sendToLanding()
      setEmail(getEmail())
    })
  }, [])

  if (!email) {
    return <Loading />
  }

  const calendars = [
    {
      calendarId: email,
    },
  ]

  function createvent(e) {
    setShowAlert(false)
    setShowCreateModal(true)
  }

  function sendurl(e) {
    setShowAlert(false)
    setShowInviteModal(true)
  }

  function handleCreateSubmit(e) {
    e.preventDefault()

    let startdate = e.target.elements.startdate?.value
    let enddate = e.target.elements.enddate?.value
    let starttime = e.target.elements.starttime?.value
    let endtime = e.target.elements.endtime?.value
    let event_name = e.target.elements.event_name?.value
    let event_location = e.target.elements.event_location?.value

    if (startdate === '' || enddate === '') {
      setShowAlert(true)
    } else if (startdate > enddate) {
      setShowAlert(true)
    } else if (startdate === enddate && starttime > endtime) {
      setShowAlert(true)
    } else {
      //example output: 2021-04-16 10:24 2021-04-16 22:29 study 411 CAS344
      if (event_name === '') {
        event_name = 'New Event'
      }
      if (event_location === '') {
        event_location = 'Home'
      }

      createSingleEvent(
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

  async function handleInviteSubmit(e) {
    console.log('submit the invitation form')
    e.preventDefault()

    let start = e.target.elements.startdate?.value
    let end = e.target.elements.enddate?.value
    let name = e.target.elements.event_name?.value
    let location = e.target.elements.event_location?.value

    if (start === '' || end === '') {
      setShowAlert(true)
    } else if (start > end) {
      setShowAlert(true)
    } else {
      if (name === '') {
        name = 'New Event'
      }
      if (location === '') {
        location = 'Home'
      }
      //example output: 2021-04-16 2021-04-16 study 411 CAS344
      await fetch(`${API_URL}/api/calendar/invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          start,
          end,
          location,
          name,
          email,
        }),
      })
      // setShowInviteModal(false)
    }
  }

  return (
    <div>
      <div>
        <Calendar apiKey={API_KEY} calendars={calendars} />
      </div>
      <div className="fixed left-0 top-1/4 grid grid-rows-2">
        <button
          className="bg-gray-300 py-2 px-2 rounded border-2 grid"
          onClick={createvent}
        >
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
              weather,
            }}
          />
        ) : null}
        <button
          className="bg-gray-300 py-2 px-2 rounded border-2 grid"
          onClick={sendurl}
        >
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
              weather,
            }}
          />
        ) : null}
      </div>
    </div>
  )
}
