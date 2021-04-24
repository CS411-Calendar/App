import React from 'react'
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom'
import Landing from './onboarding/Landing'
import UserCredentials from './onboarding/registration/UserCredentials'
import LogIn from './onboarding/LogIn'
import Feed from './feed'
import 'tailwindcss/tailwind.css'

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/">
          <Landing />
        </Route>
        <Route path="/sign-up">
          <UserCredentials />
        </Route>
        <Route path="/sign-in">
          <LogIn />
        </Route>

        <Route path="/feed">
          <Feed />
        </Route>
      </Switch>
    </Router>
  )
}

export default App
