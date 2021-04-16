import React from 'react'
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom'
import Landing from './onboarding/Landing'
import UserCredentials from './onboarding/registration/UserCredentials'
import LogIn from './onboarding/LogIn'
import Feed from './feed'
import Invite from './invite'
import 'tailwindcss/tailwind.css'

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Landing />
        </Route>
        <Route exact path="/project/:id">
          <Invite />
        </Route>
        <Route exact path="/sign-up">
          <UserCredentials />
        </Route>
        <Route exact path="/sign-in">
          <LogIn />
        </Route>
        <Route exact path="/feed">
          <Feed/>
        </Route>

      </Switch>
    </Router>
  )
}

export default App
