import { useEffect } from "react"
import { useHistory } from "react-router-dom"
import { oauthSetup, login, isAuthorized } from "../lib/auth"
import "tailwindcss/tailwind.css"
import "./landing.css"
import background from "../img/calendar-wallpaper.jpg"

function Landing() {
  // OAuth setup code
  //   sendToFeed passed as callback function executed after oauthSetup is done
  useEffect(() => {
    oauthSetup(sendToFeed)
  })
  // For redirection based on OAuth state
  const history = useHistory()
  // Helper
  //   Triggers OAuth consent screen and then calls sendToFeed
  const loginLanding = async () => {
    await login()
    sendToFeed()
  }

  // Helper
  //   Checks whether user is authorized, and if so redirects the page to the feed screen
  const sendToFeed = () => {
    if (isAuthorized()) {
      history.push("/feed")
    }
  }
  return (
    <div
      className="h-screen"
      style={{
        backgroundImage: `url(${background})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <h1 className="landingHeader">Welcome to My Calendar</h1>
      <div>
        <button
          className="linkStyle loginButton"
          onClick={loginLanding}
          id="login"
        >
          Login with Google
        </button>
      </div>
    </div>
  )
}

export default Landing
