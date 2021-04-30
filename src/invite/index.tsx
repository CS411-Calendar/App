import React, { useEffect, useState } from "react"
import { useHistory, useParams } from "react-router-dom"
import Calendar from "@ericz1803/react-google-calendar"
import apiGoogleconfig from "../config/apiGoogleconfig.json"

type ParamsType = { id: string }
export default function Invite() {
  const [acceptedInvite, setAcceptedInvite] = useState(false)
  const acceptInviteClick = () => setAcceptedInvite(true)

  // params stuff
  const params = useParams<ParamsType>()
  console.log(params)

  // info to display calendar
  const API_KEY = apiGoogleconfig.apiKey
  let calendars = [
    {
      calendarId: "u.s.apple1102@gmail.com",
      color: "#B241D1", //optional, specify color of calendar 2 events
    },
  ]

  return (
    <div>
      <div>
        {/* Potentially add more attributes to change starting month / date? */}
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
            {/* change this part to show the host */}
            {calendars[0].calendarId}. The owner will send you a calendar invite
            via E-mail shortly once all attendees accept the invite.
          </h1>
        )}
      </div>
    </div>
  )
}
