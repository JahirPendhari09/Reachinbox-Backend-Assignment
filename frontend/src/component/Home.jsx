import React, { useEffect, useState } from 'react'
import '../App.css';
import { Link, useLocation } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";


const Home = () => {
  const location = useLocation();
  const [ loginDone,setLogin]= useState(false)

  const handleLogin = ()=>{
    setTimeout(()=> {setLogin(true)},3000)
  }
  let token =localStorage.getItem("reachinbox-auth")
  useEffect(()=>{
    
    token = location.search.split("?token=")?.join("") || takeToken();
    // console.log("Token::",token)
    if(token)
    {
      let ParseData = jwtDecode(token);
      console.log(ParseData)
      localStorage.setItem("reachinbox-auth",JSON.stringify(token));
      localStorage.setItem("reachinbox-auth-name",JSON.stringify(ParseData.name));
      localStorage.setItem("reachinbox-auth-email",JSON.stringify(ParseData.email));
    }
  },[loginDone,token]);

  function takeToken(){
    try{
       return JSON.parse(localStorage.getItem("reachinbox-auth")) || "";
    }
    catch(e){
        console.log("Error:",e)
      }
  }

  return (
    <div className='home'>
      <h1>Land Emails in Inboxes, Not Spam!</h1>
      <h1>10X <span style={{color:"rgb(117, 120, 255)"}}>Your Sales Pipeline!</span></h1>
      <p>Maximize your outreach potential with ReachInbox's unlimited email accounts, AI-</p>
      <p>driven warmups, and multi-channel capabilities. 10x your leads, meetings and deals.</p>
      {
        !token && <Link to={token? "/": "https://reachinbox-assignment.onrender.com/auth/google/"} onClick={handleLogin}><button className='btn1'>Get Started Now ➡️</button></Link>
      }
      <div className='btns'>
        <button>❌ No Credit Card Required</button>
        <button>✅ 7-Days Free Trial</button>
      </div>
      <div className='chat'>
        <img src='https://static.wixstatic.com/media/713b90_7841ba78e810446f8765776b69ee76e3~mv2.png' width="50px"/>
      </div>
    </div>
  )
}

export default Home
