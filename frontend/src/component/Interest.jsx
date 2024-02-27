import React, { useState } from 'react'

import "../App.css"
import axios from 'axios';

const Interest = () => {
    const [interest, setInterest] = useState("");
    const email = localStorage.getItem("reachinbox-auth-email");
    
    const sendInterestToBackend = () => {
        axios.post("https://localhost:8080/user/show-interest", { email, interest })
            .then(() => {
                alert("Thank you so much for your interest!");
                window.location.href = "/"; // Corrected from window.href.location
            })
            .catch(err => console.error(err)); // Changed console.log to console.error for errors
    };
    
    const handleSubmit = (e) => {
        e.preventDefault()
        // console.log(interest)
        sendInterestToBackend()
    }
    return (
        <div className='home'>
            <form onSubmit={handleSubmit}>
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
                <input type='Submit' value="Send" />
            </form>
        </div>
    )
}

export default Interest
