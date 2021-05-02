import { useEffect } from "react"
import { useHistory } from "react-router-dom"
import { oauthSetup, login, isAuthorized } from "../lib/auth"
import "tailwindcss/tailwind.css"
import "./landing.css"
import background from "../img/calendar-wallpaper.jpg"

// Landing page
// If the user already has OAuth credential setup (e.g. from previous visits or through sign-up page)
//   automatically redirect them to Feed page.
// If the user is not authenticated, clicking on the "Login with Google" button triggers OAuth page.
// If user does not authenticate, they will not be able to visit the Feed page (due to redirect setup on Feed)
function Landing() {
  // OAuth setup code
  // sendToFeed passed as callback function executed after oauthSetup is done
  useEffect(() => {
    oauthSetup(sendToFeed)
  })

  // For redirection based on OAuth state
  const history = useHistory()

  // Helper, triggers OAuth consent screen and then calls sendToFeed
  const loginLanding = async () => {
    await login()
    sendToFeed()
  }

  // Helper, checks whether user is authorized, and if so redirects the page to the feed screen
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
