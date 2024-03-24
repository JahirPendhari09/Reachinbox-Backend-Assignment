
const nodemailer = require('nodemailer');

require("dotenv").config();

// sendMail :- get mailTransporter and mailDetails and sent mail to that account

// create mailTransporter using createTransport methode and pass gmail id and app password for authentication

const transporter  = nodemailer.createTransport({
	service: 'gmail',
    host:'smtp.gmail.com',
    port:587,
    secure:true,
	auth: {
			user:process.env.GMAIL_USER,
			pass:process.env.GMAIL_APP_PASSWORD
		}
	});

// // creating the receivers details and passing the mail details
// const details = {
//     from:process.env.GMAIL_USER,
//     to:'jahir2665@gmail.com',
//     subject: 'Thank you so much for interest in Reachinbox',
//     text:'This Reachinbox Autometed mail',
//     html:'<b>This Reachinbox Autometed mail</b>'
// };

const main = async(details) => {
    try {
        await transporter.sendMail(details);
        console.log("email send successfully");
    } catch(err) {
        console.log(err);
    }
}

// main(transporter,details)
// sendMail(transporter,mailDetails)


const sendMailResponese = async(email, content)=>{
    try {
        const interest = generateReply(content)
        // console.log(interest,email)
        await transporter.sendMail({
            from:process.env.GMAIL_USER,
            to:email,
            subject: 'Thank you so much for Connecting Us',
            html:`<b>${interest}</b>`
        });
        console.log("email send successfully");
    } catch(err) {
        console.log(err);
    }
}

const sendMailReplies = async(from ,to,subject, content)=>{
  try {
      const interest = generateReplyForEmails(content)
      // console.log(interest,email)
      await transporter.sendMail({
          from:from,
          to:to,
          subject: `regarding ${subject} Inquiry `,
          html:`<b>${interest}</b>`
      });
      console.log("email send successfully");
  } catch(err) {
      console.log(err);
  }
}


  // Function to generate automated reply based on category 
  const  generateReply =  (category) => {
    switch (category){
      case 'Interested':
        return 'Thank you for your interest! Would you be available for a demo call? Please suggest a time that works for you.';
      case 'Not Interested':
        return 'Thank you for considering our product. If you have any further questions in the future, feel free to reach out.';
      case 'More Information':
        return `Thank you for reaching out.Plese go through the Website one's`;
      default:
        return `Thank you for your email. We'll get back to you.`;
    }
  }


  
  // Function to generate automated reply based on category 
  const  generateReplyForEmails =  (category) => {
    switch (category){
      case 'Interested':
        return `I'm interested for this post.i wanted to connect with you for next process . Please suggest me the time`;
      case 'Not Interested':
        return 'sorry not interested';
      case 'More Information':
        return `i want more information about the email`;
      default:
        return `Thank you for your email. We'll get back to you.`;
    }
  }

module.exports ={main,sendMailResponese,sendMailReplies}
