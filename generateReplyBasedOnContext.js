// Function to generate automated reply based on category 
const  generateReply =  (category) => {
    switch (category){
      case 'Interested':
        return `Thank you for your interest! Would you be available for a demo call? Please suggest a time that works for you.\n\nLooking forward to connecting with you soon!\n\nBest regards,\n[Product Team]`;
      case 'Not Interested':
        return `Thank you for considering our product. If you have any further questions in the future, feel free to reach out.\n\nLooking forward to connecting with you soon!\n\nBest regards,\n[Product Team]`;
      case 'More Information':
        return `Thank you for reaching out.Plese go through the Website one's \n\nLooking forward to connecting with you soon!\n\nBest regards,\n[Product Team]`;
      default:
        return `Thank you for your email. We'll get back to you.\n\nLooking forward to connecting with you soon!\n\nBest regards,\n[Product Team]`;
    }
}

  
// Function to generate automated reply based on category 
const  generateReplyForEmails =  (category) => {
    switch (category){
      case 'Interested':
        // return `I'm interested for this post.i wanted to connect with you for next process . Please suggest me the time`;
        return `Hello , \nI'm glad to hear that I am interested in the Give Post. Let's move forward with the next steps. Could you please suggest a suitable time for a demo call or meeting to discuss further details?\n\nLooking forward to connecting with you soon!\n\nBest regards,\n for testing`;
      case 'Not Interested':
        return `Hello,\nThank you for your email. I appreciate you taking the time to reach out. However, at this time, I'm not interested in pursuing further discussions.\n\nKind regards,\nfor testing`;
      case 'More Information':
        return `Hello, \nThank you for your email. I'm happy to gain extra information about the post. Could you please provide the details ? This will help me tailor the information to your needs more effectively.\n\nLooking forward to assisting you further!\n\nBest regards,\nfor testing`;
      default:
        return `Thank you for your email. We'll get back to you.`;
    }
}


module.exports = { generateReply, generateReplyForEmails }
