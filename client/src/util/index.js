import { notification } from 'antd';
import React from 'react'
import {Icon} from 'antd';

export const showNotification = (type, title, message) => {
      const model = {
            success: {icon: "check-circle", color: "green"},
            error: {icon: "close-circle", color: "red"},
            warning: {icon: "warning", color: "red"}
      }
      return notification.open({
            message: title,
            description: message,
            icon: <Icon type={model[type].icon} style={{ color: model[type].color }} />,
      });
}

export const handleRegisterAPI = (object) =>{
      if(object.status === 200 && object.statusText === "OK"){
            let message = object.data.message
            if(typeof message === "object"){
                  if(message.errmsg){
                        showNotification("error", "User Registration Failed", "User Already Exist")
                  }
                  else if(message.errors){
                        showNotification("error", "User Registration Failed", "Feilds are incorrect")
                  }
            }
            else{
                  showNotification("success", "Successfully Registered", message)
            }
      }
}

export const handleLoginAPI = (object, cb) =>{
      if(object.status === 200 ){
           let status = object.data.message
            if(object.data === "User Found"){
                  cb()
            }
            else if(status === "User Not Found"){
                  showNotification("error", "Incorrect User", "User doesent exist")
           }
            else if(typeof status === "object")
            {
                  showNotification("error", "Something Wrong", "Please Try after sometime")
            }
      }
      else{
            if(object.data.message === "User Not Found"){
                  showNotification("error", "Incorrect User", "User doesent exist")
           }
           else
            showNotification("error", "Something Wrong", "Please Try after sometime")
      }
}