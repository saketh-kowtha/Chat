import React from 'react'
import './Welcome.scss'
import { Input, Icon, Card, Typography,Row, Col, Empty, List, Dropdown, Button  } from 'antd';
import icon from '../../images/profile.png'
import socketIOClient from "socket.io-client";
import Messages from '../../Components/Message'
import axios from 'axios';
export default class Welcome extends React.Component{
      constructor(props){
            super(props)
            this.state = {
                  addFriend: "",
                  userInfo: "",
                  userStatus: "....",
                  messages:[],
                  activeTab : "",
                  userChatIput: "",
                  users:[],
                  tone: []
            }
            this.emojis = {
                  Angry : ["😠", "😡", "👿","😤"],
                  Sadness: ["😞","😣","😩","😿"],
                  Joy: ["😁","😂","😃","😄","😆","😍"],
                  Fear: ["😥","😨","😰"],
                  Analytical: ["😐","😑","😶"],
                  Confident: ["😎","😇","😊"],
                  Tentative: ["😥","😨","😰", "😕","😧","😬"]
            }
            this.getFriends()
     }

     getFriends = () => {
            axios.post("/api/getFriendList").then(d=> 
                  d.length != 0 
                        ? this.setState({users : d.data.data})
                        : console.log(d)).catch(e=>console.log(e))
     }
      componentWillMount() {
            axios.post("/api/load").then(d=>{
                  this.setState({userInfo :d.data.data})
                  this.io = socketIOClient("/" + this.state.userInfo.username);
                  this.io.on("receiveMessage", (data)=>{
                        this.setState({tone: data.tone})
                        this.updateMessages(data)
                  })
                  this.io.on("receiveData", (data)=>{
                       this.setState({messages: (data.concat(this.state.userInfo.chats.filter(e => e.to === this.state.activeTab))).sort((a,b)=> a.ts - b.ts)})
                  })
                  this.io.on("userOffline", (data)=>{
                        this.setState({userStatus: "Last seen today at " +  data.lastSeen})
                  })
                  this.io.on("isTyping", (data)=>{
                        this.setState({userStatus: data.status})
                  })
            }).catch(e => {if(e.response.status === 401) this.props.history.push("/")})
          }


      handleTabClick = (ele) =>{
            this.io.emit("status event", {name: ele})
            this.setState({activeTab: ele, userChatIput: ""})
      }

      chatUserCard = (ele) => {
            return  <List key={ele.name} style={{cursor: 'pointer'}} onClick={()=>this.handleTabClick(ele.name)} >
                        <Card style={{backgroundColor: "rgb(230, 230, 230)"}} className={this.state.activeTab === ele.name ? "TabActive" : ""} >
                              <div style={{float: "left"}}>
                                    <img src={icon} style={{width: "35px", height: "35px", margin: "5px", marginRight: "10px"}}/>
                              </div>
                              <div style={{float: "left"}}>
                                    <div>
                                          <Typography.Text strong={true}>{ele.name}</Typography.Text>
                                    </div>
                                    <div style={{width: "180px", whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden'}}>
                                          {ele.message} 
                                    </div>
                              </div>
                        </Card>
                  </List>
      }

      updateMessages = (msg) => {
            let _messages = this.state.messages
            _messages.push(msg)
            this.setState({messages: _messages})
      }

      handleSendMessage = () => {
            if(this.state.userChatIput.trim() !== ""){
                  let sentMessage = {message: this.state.userChatIput, to: this.state.activeTab, from: this.state.userInfo.username}
                  this.updateMessages(sentMessage)
                  this.io.emit("sendMessage", sentMessage)
            }
            this.setState({userChatIput: ""})
            this.setState({tone: []})
      }

      handleUserChatIput = (event) => {
            let value = event.target.value
            value = value.replace(":)","😊")
            value = value.replace(":-)","😊")
            value = value.replace(":3","👄")
            value = value.replace(":*","😘")
            value = value.replace(":-*]","😘")
            value = value.replace(">:(","😡")
            value = value.replace(">:-(","😡")
            value = value.replace("8)","😎")
            value = value.replace("8-)","😎")
            value = value.replace("^_^","😊")
            value = value.replace("3:)","👿")
            value = value.replace("3:-)","👿")
            value = value.replace(`_//\_`,"🙏🏻")
            this.setState({userChatIput: value})            
      }

       
      messageContainer = (ele) => {
   
            return <div>
            <div style={{height: '8vh'}}>
                  <Card>
                        <div style={{float: "left"}}>
                              <img src={icon} style={{width: "35px", height: "35px", margin: "5px", marginRight: "10px"}}/>
                        </div>
                        <div style={{float: "left"}}>
                              <div>
                                    <Typography.Text strong={true}>{ele}</Typography.Text>
                              </div>
                              <div>
                                    <span>{this.state.userStatus}</span>
                              </div>
                        </div>
                  </Card>

            </div>
            <div style={{height: '68vh', maxHeight: '72vh', overflow: 'scroll', width: "100%",marginTop: "20px"}}>
                  {this.state.messages.map(ele =>  <Messages to={ele.to} message={ele.message} from={ele.from} />)}
            </div>
            <div style={{height: '12vh'}}>
                  <Card>
                        <div>
                        <div style={{margin: "10px"}}>
                              {
                                    this.state.tone ? this.state.tone.map(e=> <Button onClick={()=>{
                                          let sentMessage = {message: e, to: this.state.activeTab, from: this.state.userInfo.username}
                                          this.updateMessages(sentMessage)
                                          this.io.emit("sendMessage", sentMessage)
                                    }}>{this.emojis[e] ? this.emojis[e] : e}</Button>) : ""
                              
                              }
                        </div>
                        <Input.Search
                              placeholder="Type a message!!!"
                              enterButton="Send"
                              size="large"
                              value = {this.state.userChatIput}
                              onChange = {this.handleUserChatIput}
                              onFocus = {() => this.io.emit("typing", {status: "Typing..."})}
                              onBlur = {() => this.io.emit("typing", {status: "Online..."})}
                              onSearch = {this.handleSendMessage}
                        />               
                        </div>
                  </Card>
            </div>
      </div>
      }
      render(){
            const logout = () => {
                  axios.get("/api/logout").then(d => {
                        if(d.data==="OK")
                              this.props.history.push("/")
                  }).catch(e => {

                  })
            }
            return   <div className="container">
                        <Row align={'middle'} style={{height: "8vh", borderBottom: "0.5px solid #d9d9d9"}}>
                              <Col offset={9} span={6} style={{textAlign: "center", marginTop: '10px'}}>
                                          <Input
                                                placeholder = {"Search"}
                                                allowClear
                                                onChange = {(event) => this.setState({addFriend: event.target.value})}
                                                addonAfter = {
                                                      <span onClick=
                                                      {
                                                            () =>{
                                                                  const filterUserList = () => {
                                                                        return (this.state.users.map(e => e.name)).indexOf(this.state.addFriend) != -1 ? true : false
                                                                  }
                                                                  if(!this.state.addFriend.trim() || this.state.addFriend.trim() === "" || this.state.addFriend.trim() === this.state.userInfo.username || filterUserList()){
                                                                        return alert("Invalid name " + this.state.addFriend)
                                                                  }
                                                                  axios.get("/api/addFriend?name="+ this.state.addFriend).then(d => {
                                                                        console.log(d)
                                                                        if(d.data.msg === "Added"){
                                                                              let users = this.state.users
                                                                              users.push({name: d.data.name, message: d.data.message})
                                                                              this.setState({users: users})
                                                                        }
                                                                        else{
                                                                              alert("Invalid User")
                                                                        }
                                                                  }).catch(e => {
                                                                              console.log(e)                                                                              
                                                                              alert("Something wrong. Please try after sometime")
                                                                  })
                                                            }
                                                      } 
                                                      style={{cursor: 'pointer'}}>Add</span>}
                                                style={{ borderRadius: '20px !important'}}
                                                prefix = {<Icon type={"search"}
                                          />

                                    }/>

                              </Col>
                              <Col offset={6} span={1} style={{textAlign: "center", marginTop: '10px'}}>
                                    <Button onClick={logout}>Logout</Button> <span style={{color: 'grey', fontSize: '10px', marginLeft: '10px'}}>{this.state.userInfo.username}</span>
                              </Col>
                        </Row>
                        <Row align={'middle'} >
                              <Col span={5} style={{height: "92vh",maxHeight: "92vh", borderRight: "0.5px solid #d9d9d9"}}>
                                          {
                                                this.state.users && this.state.userInfo && this.state.userInfo.username ? this.state.users.map(ele => {
                                                                  if(ele && ele.name && ele.name !== this.state.userInfo.username) 
                                                                        return this.chatUserCard(ele)
                                                            }).filter(e => e) :   ""
                                          }
                                    
                              </Col>
                              <Col span={19} style={{height: "92vh",maxHeight: "92vh", overflow: "auto", borderRight: "0.5px solid #d9d9d9"}}>
                                          {
                                                this.state.activeTab  !== ""
                                                      ? this.messageContainer(this.state.activeTab) 
                                                      : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                                          }
                              </Col>
                       </Row>
            </div>
      }
}
