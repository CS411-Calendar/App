import { useEffect } from 'react'
import { oauthSetup, isAuthorized, listUpcoming } from '../lib/auth'

function LogIn() {
  useEffect(() => {
    oauthSetup()
  })

  return (
    <div>
      <button
        onClick={isAuthorized}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Check Auth
      </button>

      <button
        onClick={listUpcoming}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        list
      </button>
    </div>
  )
}

export default LogIn
