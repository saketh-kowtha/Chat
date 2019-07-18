import React from 'react'
import {BrowserRouter, Switch, Route} from 'react-router-dom'
import Login from './Pages/Login/Login'
import Welcome from './Pages/Welcome/Welcome'

const Routes = (props) => {
      return <BrowserRouter>
            <Switch>
                  <Route path ="/Welcome" component={Welcome} />
                  <Route path ="/" component={Login} />
            </Switch>
      </BrowserRouter>
}

 export default Routes