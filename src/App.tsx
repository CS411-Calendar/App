import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Landing from './onboarding/Landing'
import Feed from './feed'
import InviteScreen from './invite'
import 'tailwindcss/tailwind.css'

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Landing />
        </Route>
        <Route exact path="/invite/:id">
          <InviteScreen />
        </Route>
        <Route exact path="/feed">
          <Feed />
        </Route>
      </Switch>
    </Router>
  )
}

export default App
