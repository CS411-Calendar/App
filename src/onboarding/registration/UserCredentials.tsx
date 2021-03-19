import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import 'tailwindcss/tailwind.css'

function UserCredentials() {
  // const username_validation = /^(?=[a-zA-Z0-9._]{3,20}$)(?!.*[_.]{2})/
  // const password_validation = //

  return (
    <div>
      <form>
        <div className="grid justify-items-center">
          <input
            className="mt-4 border-2 text-center w-2/5"
            name="username"
            type="text"
            placeholder="input username"
            required
          />
          <input
            className="mt-4 border-2 text-center w-2/5"
            name="email"
            type="text"
            placeholder="input email"
            required
          />
          <input
            className="mt-4 border-2 text-center w-2/5"
            name="email"
            type="text"
            placeholder="input email"
            required
          />

          <input
            className="mt-4 border-2 text-center w-2/5"
            name="password"
            type="password"
            placeholder="password"
            required
          />
          <input
            className="mt-4 border-2 text-center w-2/5"
            name="confirm_password"
            type="password"
            placeholder="confirm password"
            required
          />
        </div>
      </form>
    </div>
  )
}

export default UserCredentials
