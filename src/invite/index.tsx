import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Calendar from "@ericz1803/react-google-calendar"
import apiGoogleconfig from "../config/apiGoogleconfig.json"
import { oauthSetup, isAuthorized, login, getEmail } from "../lib/auth"

// Define type for the params of the invite page, used to identify each invites in the DB
type ParamsType = { id: string }
// Define API Key
const API_KEY = apiGoogleconfig.apiKey

export default function Invite() {
  // Initialize params
  const params = useParams<ParamsType>()
  // OAuth setup code
  useEffect(() => {
    oauthSetup()
  }, [])
  // Setup acceptedInvite state, used to display thank you text after user accepts invite
  const [acceptedInvite, setAcceptedInvite] = useState(false)
  // Helper
  //   Handles accept invite clicks by extracting user email and updating state.
  const acceptInviteClick = async () => {
    if (isAuthorized()) {
      // Extract user email
      console.log(getEmail())
      setAcceptedInvite(true)
    } else {
      await login()
      // Extract user email
      console.log(getEmail())
      if (isAuthorized()) {
        setAcceptedInvite(true)
      }
    }
  }
  // TODO: Info to display calendar, need to make it so that it pulls data from DB and updates the calendar
  let calendars = [
    {
      calendarId: "u.s.apple1102@gmail.com",
      color: "#B241D1", //optional, specify color of calendar 2 events
    },
  ]

  return (
    <div>
      <div>
        <Calendar apiKey={API_KEY} calendars={calendars} />
      </div>
      <div>
        The ID of this page is: <b>{params.id}</b>
      </div>
      <div className="flex flex-col h-screen my-auto items-center bgimg bg-cover">
        {!acceptedInvite && (
          <button
            onClick={(e) => {
              acceptInviteClick()
            }}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Join Calendar
          </button>
        )}
        {acceptedInvite && (
          <h1>
            {" "}
            Thank you for accepting the invite from&nbsp;
            {/* TODO: change this part to show the host */}
            {calendars[0].calendarId}. The owner will send you a calendar invite
            via E-mail shortly once all attendees accept the invite.
          </h1>
        )}
      </div>
    </div>
  )
}
