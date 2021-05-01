import React, { useEffect, useState } from "react"
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  useHistory,
} from "react-router-dom"
import "tailwindcss/tailwind.css"
import Feed from "../feed"
import { Link } from "react-router-dom"
import { oauthSetup, login, isAuthorized } from "../lib/auth"
// import styles from "Landing.css"

function Landing() {
  const history = useHistory()

  useEffect(() => {
    oauthSetup(sendToFeed)
  })

  const loginLanding = async () => {
    await login()
    sendToFeed()
  }

  const sendToFeed = () => {
    if (isAuthorized()) {
      history.push("/feed")
    }
  }

  return (
    <div>
      <div className="grid grid-rows-2 item-center justify-items-center h-screen">
        <div className="flex justify-items-center items-center h-full">
          <h1 className="text-6xl self-center font-bold ">
            {" "}
            Welcome to MY CALENDAR{" "}
          </h1>
        </div>
        <button
          onClick={loginLanding}
          className="border-2 px-8 py-4 bg-gray-300 h-1/5 rounded-lg items-center"
          id="login"
        >
          Login with Google
        </button>
        {/* <div>
        <Link to="/feed">
          <div
            className="border-2 px-8 py-4 bg-gray-300 rounded-lg items-center"
            id="login"
          >
            Login with Google
          </div>
        </Link>
      </div> */}
      </div>
    </div>
  )
}

export default Landing
