import React from 'react'
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom'
import Landing from './onboarding/Landing'
import UserCredentials from './onboarding/registration/UserCredentials'
import LogIn from './onboarding/LogIn'

function App() {
  return (
    <Router>
      <nav>
        <ul>
          <li>
            <Link to="/landing">Landing</Link>
          </li>
          <li>
            <Link to="/sign-up">Registration</Link>
          </li>
          <li>
            <Link to="/sign-in">Log in</Link>
          </li>
        </ul>
      </nav>

      <Switch>
        <Route path="/landing">
          <Landing />
        </Route>
        <Route path="/sign-up">
          <UserCredentials />
        </Route>
        <Route path="/sign-in">
          <LogIn />
        </Route>
      </Switch>
    </Router>
  )
}

export default App
