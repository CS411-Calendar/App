import { useEffect } from 'react'
import {
  isAuthorized,
  oauthSetup,
  login,
  logout,
  listUpcoming,
} from '../../lib/auth'

function UserCredentials() {
  useEffect(() => {
    oauthSetup()
  })

  return (
    <div className="grid grid-cols-4 gap-8">
      <button
        onClick={login}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        sign-in
      </button>
      <button
        onClick={logout}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        sign-out
      </button>
      <button
        onClick={listUpcoming}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        list
      </button>
      <button
        onClick={isAuthorized}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        status
      </button>
    </div>
  )
}

export default UserCredentials
