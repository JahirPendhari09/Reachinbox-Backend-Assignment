import React from 'react'
import '../App.css';
import { Link } from 'react-router-dom';
const Home = () => {
  return (
    <div className='home'>
      <h1>Land Emails in Inboxes, Not Spam!</h1>
      <h1>10X <span style={{color:"rgb(117, 120, 255)"}}>Your Sales Pipeline!</span></h1>
      <p>Maximize your outreach potential with ReachInbox's unlimited email accounts, AI-</p>
      <p>driven warmups, and multi-channel capabilities. 10x your leads, meetings and deals.</p>
      <Link to="http://localhost:8080/auth/google/"><button className='btn1'>Get Started Now ➡️</button></Link>
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
