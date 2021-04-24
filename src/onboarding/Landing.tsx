import { useEffect } from 'react'
import 'tailwindcss/tailwind.css'
import { useHistory } from 'react-router-dom'
import { isAuthorized, oauthSetup, login } from '../lib/auth'

function Landing() {
  const history = useHistory()

  useEffect(() => {
    oauthSetup()
    if (isAuthorized()) {
      history.push('/feed')
    }
  }, [])

  return (
    <div className="grid grid-rows-2 item-center justify-items-center h-screen">
      <div className="flex justify-items-center items-center h-full">
        <h1 className="text-6xl self-center font-bold ">
          Wlecome to MY CALENDAR
        </h1>
      </div>
      <div>
        <button
          onClick={login}
          className="border-2 px-8 py-4 bg-gray-300 rounded-lg items-center"
          id="login"
        >
          Login with Google
        </button>
      </div>
    </div>
  )
}

export default Landing
