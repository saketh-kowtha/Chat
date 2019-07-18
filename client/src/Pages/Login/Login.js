import React from 'react'
import './Login.scss'
import { Input, Icon, Card, Typography, Button } from 'antd';
import "antd/dist/antd.css";
import axios from 'axios';
const util = require('../../util/index')

const Login = (props) => {
      const [formName, setFormName] = React.useState("Sign Up")
      const [formValues, setFormValues] = React.useState({})
      const [isTokenVerified, setTokenVerfied] = React.useState(false)
      if(!isTokenVerified){
            axios.get("/api/verifyToken").then(d => console.log(d)).catch(e=>{if(e.response.status === 401) props.history.push("/Welcome")})
            setTokenVerfied(true)
      }
      const formData = require('./formData').formData
      const handleClick = () => {
            let errorList = formData[formName].map(ele => {
                  if(ele.validation){
                        let status = ele.validation(formValues[ele.name])
                        if(status !== true)
                              return status
                  }
            }).filter(ele => ele ? ele : false)
            if(errorList.length > 0)
                  return errorList.filter(e=> e ?  util.showNotification("error", formName + "Error", e) : false) 
            submitForm()
      }

      
      const TextInput = (properties) => {
            if(properties.type === "password"){
                  return <Input.Password
                              key={properties.label}
                              name={properties.name}
                              value={formValues[properties.name]}
                              className='formInput'
                              type={properties.name==="password" ? "password" : "text"}
                              placeholder = {properties.label}
                              onChange={handleChange}
                              allowClear
                              prefix = {
                                    <Icon
                                          type={properties.icon}
                                          className='formInputIcon' />
                         }/>
            }
            return <Input
                        key={properties.label}
                        name={properties.name}
                        value={formValues[properties.name]}
                        className='formInput'
                        type={properties.label==="password" ? "password" : "text"}
                        placeholder = {properties.label}
                        allowClear
                        onChange={handleChange}
                        prefix = {
                              <Icon
                                    type={properties.icon}
                                    className='formInputIcon' />
                        }/>
      }


      const submitForm = () => {
            let x = formValues
            x.chats = {a:1}
            setFormValues(x)
            let url = "/api/"
            if(formName === "Sign Up"){
                  url +=  "Register"
                  axios.post(url, formValues).then((success) => util.handleRegisterAPI(success)).catch((err) => util.handleRegisterAPI(err))  
            }
            else{
                  url += "Login"
                  localStorage.setItem("name", formValues.username)
                  axios.post(url, formValues).then((success) => util.handleLoginAPI(success, () => props.history.push("/Welcome"))).catch((err) => util.handleLoginAPI(err))  
            }

      }

      const handleChange = (event) =>{
            const formVal = {...formValues}
            formVal[event.target.name] = event.target.value
            setFormValues(formVal)
      }

      const otherForm = formName === "Sign Up" ? "Login" : "Sign Up"
      return <div className="form">
                  <Card 
                        actions={[<Icon type="facebook" theme="filled"/>, <Icon type="google" />]}
                        title={<Typography.Title strong={true}>Hola</Typography.Title>}>
                              <form onSubmit={submitForm}>
                                    {formData[formName].map(ele => TextInput(ele)) }
                                    <Typography.Paragraph 
                                          >{
                                                formName === "Sign Up" 
                                                      ? "" 
                                                      : <a onClick={()=> {}}>Forget Password ?</a>
                                                } 
                                    </Typography.Paragraph>

                                    <Button type='primary' className="Login-btn" onClick={handleClick}>{formName}</Button>
                                    <Typography.Paragraph 
                                          strong={true}>{
                                                formName !== "Sign Up" 
                                                      ? "New to Hola ? " 
                                                      : "Already have an Account ? "  
                                                } 
                                                <a onClick={
                                                      ()=>{
                                                            setFormName(otherForm)
                                                             setFormValues({})
                                                      }
                                                }>{otherForm}</a>
                                    </Typography.Paragraph>    
                              </form>
                  </Card>    

            </div>
}

export default Login