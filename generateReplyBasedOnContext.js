const { interestedHtmlResponse, notInterestedHtmlResponse, moreInformationHtmlResponse, interestedHtmlInterestReply, notInterestedHtmlInterestReply, moreInformationtmlInterestReply } = require("./replyMessages");

// Function to generate automated reply based on category 
const  generateReply =  (category) => {
    switch (category){
      case 'Interested':
        return interestedHtmlInterestReply;
      case 'Not Interested':
        return notInterestedHtmlInterestReply;
      case 'More Information':
        return moreInformationtmlInterestReply;
      default:
        return `Thank you for your email. We'll get back to you.Looking forward to connecting with you soon!`;
    }
}


// Function to generate automated reply based on category 
const  generateReplyForEmails =  (category) => {
    switch (category){
      case 'Interested':
        return interestedHtmlResponse;
      case 'Not Interested':
        return notInterestedHtmlResponse;
      case 'More Information':
        return moreInformationHtmlResponse;
      default:
        return `Thank you for your email. We'll get back to you.`;
    }
}


module.exports = { generateReply, generateReplyForEmails }
