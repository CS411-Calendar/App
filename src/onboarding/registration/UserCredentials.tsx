import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

function UserCredentials() {
  // const username_validation = /^(?=[a-zA-Z0-9._]{3,20}$)(?!.*[_.]{2})/
  // const password_validation = //

  return (
    <div>
      <form>
        <input
          name="username"
          type="text"
          placeholder="input username"
          required
        />
        <input name="email" type="text" placeholder="input email" required />
        <input name="email" type="text" placeholder="input email" required />

        <input
          name="password"
          type="password"
          placeholder="password"
          required
        />
        <input
          name="confirm_password"
          type="password"
          placeholder="confirm password"
          required
        />
      </form>
    </div>
  )
}

export default UserCredentials
