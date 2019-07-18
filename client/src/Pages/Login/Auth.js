import React from 'react'
import {BrowserRouter, Switch, Route} from 'react-router-dom'

import axios from 'axios'
const Auth = (props) =>{
      const [isToken, setTokenStatus] = React.useState("empty")
      axios.get("/api/verifyToken").then((d) => {
            if(d.data.status)
                  setTokenStatus({a:"true"})
            else
                  setTokenStatus({a:"false"})
      }).catch(e => {
            console.log(e)
      })
      return <Route path = {props.path} component = {props.component}/>) 


} 

export default Auth