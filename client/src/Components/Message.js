import React from 'react'

const me = (ele) => {
    return <div style={{marginTop: "10px", fontWeight: "bold", marginLeft:"5px"}}>
          <label >Me : </label><span>{ele.message}</span>
    </div>  
}

const you = (ele) => {
      return <div style={{marginTop: "10px", fontWeight: "bold", marginLeft:"5px", color: 'blue'}}>
          <label >{ele.from} : </label><span>{ele.message}</span>
      </div>  
  }

const Message  = (props) => {
        return <div style={{width: "100%"}}>
              {
                    localStorage.getItem("name") === props.from ? me({message: props.message, name: props.from}) : you({message: props.message, from: props.from})
              }
        </div>
  }

  export default  Message 