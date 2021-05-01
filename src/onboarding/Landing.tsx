import { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { oauthSetup, login, isAuthorized } from '../lib/auth'
// import styles from "Landing.css"
import 'tailwindcss/tailwind.css'
import './landing.css'
import background from '../img/calendar-wallpaper.jpg'

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
      history.push('/feed')
    }
  }

  return (
    <div
      className="h-screen"
      style={{
        backgroundImage: `url(${background})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
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
