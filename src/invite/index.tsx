import React, { useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import Calendar from '@ericz1803/react-google-calendar'
import apiGoogleconfig from '../config/apiGoogleconfig.json'
import { oauthSetup, isAuthorized, login, getEmail } from '../lib/auth'
import { UserIcon } from '@heroicons/react/solid'
import { CreateModal } from '../components/modal'
import { createSingleEvent } from '../lib/event'
import { WeatherRes } from '../feed'
import { API_URL } from '../constants'
import { Invite, User } from '../types'

type WeatherArgs = {
  latitude: number
  longitude: number
}

type ParamsType = { id: string }
export default function InviteScreen() {
  const [weather, setWeather] = useState<WeatherRes[] | undefined>()
  const [invite, setInvite] = useState<Invite | null>(null)
  const [attendees, setAttendees] = useState<User[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [acceptedInvite, setAcceptedInvite] = useState(false)
  const [email, setEmail] = useState<string | null>(null)
  const history = useHistory()

  const { id } = useParams<ParamsType>()
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

    fetch(`${API_URL}/api/calendar/invite/${id}`).then(async (res) => {
      if (res.status === 200) {
        const data: {
          inviteJson?: Invite
          attendeeJson?: User[]
        } = await res.json()
        if (data.attendeeJson) {
          setAttendees(data.attendeeJson)
        }
        if (data.inviteJson) {
          setInvite(data.inviteJson)
        }
      } else {
        // display error
      }
    })
  }, [])

  const getWeather = async (args: WeatherArgs) => {
    try {
      const res = await fetch(
        `${API_URL}/weather?lat=${args.latitude}&long=${args.longitude}`,
      )
      if (res.status === 200) {
        const data: WeatherRes[] = await res.json()
        setWeather(data)
        console.log('Weather Server: ', weather)
      }
    } catch (e) {
      console.error('Server unreachable')
    }
  }

  const acceptInviteClick = async () => {
    if (email) {
      const res = await fetch(`${API_URL}/api/calendar/invite/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: email,
        }),
      })
      if (res.status === 200) {
        setAcceptedInvite(true)
        console.log(await res.json())
        // added
      }else{
        console.log("RES:", res)
        console.log(await res.json())
      }
    }
  }

  // info to display calendar
  const API_KEY = apiGoogleconfig.apiKey
  let calendars = attendees.map(({calendarId}) => ({calendarId}))
  console.log("Calendar: ", calendars)
  if (invite) {
    calendars.push({ calendarId: invite.to })
  }

  function createvent(e) {
    setShowAlert(false)
    setShowCreateModal(true)
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

  return (
    <div>
      <div>
        {/* Potentially add more attributes to change starting month / date? */}
        <Calendar apiKey={API_KEY} calendars={calendars} />
      </div>
      <div className="fixed left-0 top-1/2 grid grid-rows-2">
        {invite && getEmail() === invite.to && (
          <button
            className="bg-gray-300 py-2 px-2 rounded border-2 grid"
            onClick={createvent}
          >
            <UserIcon className="text-blue-500 h-7 w-7 justify-self-center"></UserIcon>
            <span className="text-xs">Create Group Event</span>
          </button>
        )}
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
        {invite && (
          <div className="flex flex-col bg-gray-300 py-2 px-2 rounded border-2 text-xs">
              <h1> Attendee Emails: </h1>
            {[invite.to, ...(attendees.map(attendee => attendee.calendarId))].map((email, i)=><div key={i}>{email}</div>)}
          </div>)}
      </div>
      <div>
        The ID of this page is: <b>{id}</b>
      </div>


      {invite && getEmail() !== invite.to && (<div className="flex flex-col h-screen my-auto items-center bgimg bg-cover">
        {!acceptedInvite && (
          <>
            {invite && (
              <div
                className={
                  'fixed bottom-20 bg-gray-300 text-black py-2 px-5 rounded'
                }
              >
                The event will occur between {invite.start} to {invite.end}.
              </div>
            )}
            <button
              onClick={acceptInviteClick}
              className="fixed bottom-5 hover:bg-blue-100 hover:text-black bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Share Calendar
            </button>
          </>
        )}
        {acceptedInvite && (
          <>
            <div
              className={
                'fixed bottom-20 bg-gray-300 text-black py-2 px-5 rounded'
              }
            >
              The event will occur between May 5, 2021 to June 10, 2021.
            </div>
            <h1 className={'fixed bottom-5 bg-white'}>
              {' '}
              Thank you for accepting the invite from&nbsp;
              {/* change this part to show the host */}
              {calendars[0].calendarId}. The owner will send you a calendar
              invite via E-mail shortly once all attendees accept the invite.
            </h1>
          </>
        )}
      </div>)}
    </div>
  )
}
