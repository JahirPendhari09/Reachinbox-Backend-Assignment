
const nodemailer = require('nodemailer');
const { generateReplyForEmails, generateReply } = require('./generateReplyBasedOnContext');

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


const sendMailResponese = async(email, content)=>{
    try {
        const emailContent = generateReply(content);
        // console.log("hiii")
        
        await transporter.sendMail({
            from:process.env.GMAIL_USER,
            to:email,
            subject: 'Regarding Interest in our Startup',
            html:`<b>${emailContent}</b>`
        });
        console.log("email send successfully");
    } catch(err) {
        console.log(err);
    }
}

const sendMailReplies = async(from ,to,subject, content)=>{
  try {
      const emailContent = generateReplyForEmails(content)
  
      await transporter.sendMail({
          from:from,
          to:to,
          subject: `Expressing Interest regarding ${subject}   `,
          html:`<b>${emailContent}</b>`
      });
    //   console.log(`reply send successfully to ${to} from ${from}`);
  } catch(err) {
      console.log(err);
  }
}



module.exports ={main,sendMailResponese,sendMailReplies}
