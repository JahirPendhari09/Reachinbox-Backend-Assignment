import React, { useState } from 'react'

import "../App.css"
import axios from 'axios';

const Interest = () => {
    const [interest, setInterest] = useState("");
    const email = localStorage.getItem("reachinbox-auth-email");
    
    const sendInterestToBackend = () => {
        axios.post("https://reachinbox-assignment.onrender.com/user/interest", { email, interest })
            .then(() => {
                alert("Thank you so much for your interest!");
                window.location.href = "/"; 
            })
            .catch(err => console.error(err)); 
    };
    
    const handleSubmit = (e) => {
        e.preventDefault()
        // console.log(interest)!
        if(!email){
            return alert("Please Login Again")
        }
        sendInterestToBackend()
    }
    return (
        <div className='home'>
           <div className='interest'>
           <form onSubmit={handleSubmit} className='form_data'>
              <h3>Share Your Interest</h3>
                <div>
                    <label >Interested</label>
                    <input type="radio" value={interest} checked={interest == "Interested"} onChange={() => setInterest("Interested")} />
                </div>
                <div>
                    <label >Not Interested</label>
                    <input type="radio" value={interest} checked={interest == "Not Interested"} onChange={() => setInterest("Not Interested")} />
                </div>
                <div>
                    <label >I need more Information</label>
                    <input type="radio" value={interest} checked={interest == "More Information"} onChange={() => setInterest("More Information")} />
                </div>
                <input type='Submit' value="Send" className='btn' />
            </form>
           </div>
        </div>
    )
}

export default Interest
