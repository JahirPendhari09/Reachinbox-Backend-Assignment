const {  sendMailReplies } = require("./emailSend");
const { OpenAI } = require("openai");

const apiKey = process.env.OPENAI_API_KEY;

const openai = new OpenAI({ apiKey: apiKey });

const promptForReadEmails = `
You will serve as an ATS  and I will be send you gmail context. You have to assess to the read the gmail context analyse them and  understand the context and on the basis of below criteria give the response. 

Filtering Criteria:  emails containing job offers or opportunities matching certain criteria:

Job Titles: Full-stack web developer, software developer, software engineer.
Location: India.
Response Mechanism:
If the email matches the specified criteria, the AI responds with "interested."
If the email contains information about schools for learning or any other important message, the AI responds with "more information."
If the email doesn't meet any of the specified criteria, the AI responds with "not interested."`;

const captureEmails = async (gmail, messages, index) => {
    try {
        const messageId = messages.data.messages[index].id;
        const messageData = await gmail.users.messages.get({ userId: 'me', id: messageId });

        const headers = messageData.data.payload.headers;

        // Find the 'From' header
        const fromHeader = headers.find(header => header.name === 'From');

        // Extract the sender email address from the 'From' header
        const senderEmail = fromHeader.value;

        const fromHeaderSubject = headers.find(header => header.name === 'Subject');

        // Extract the sender email address from the 'From' header
        const senderSebject = fromHeaderSubject.value;

        const emailSnippet = messageData.data;

        // Analyse Message with the help of open Ai but right now it is not working becasue api for openai is expired 
        // const context = await analyzeEmail(emailSnippet.snippet)
        // console.log(context)

        // get Content of mail with the help of emailSnppet.snippet/

        const response = checkEmailContent(emailSnippet.snippet);
        // console.log(response)

        sendMailReplies('jahirpp1999@gmail.com',senderEmail,senderSebject,response)
        if (response === "Interested") {
            // await addLabel(gmail, messageId, "interested");
            await addLabel(gmail, messageId,"Label_5516825564213520612")
        }else if (response === "More Information") {
            // await addLabel(gmail, messageId, "More Information");
             await addLabel(gmail,messageId,"Label_3218851228108376452")
        }else {
            // await addLabel(gmail ,messageId, "Not Interested");
            await addLabel(gmail,messageId,"Label_4133738106663783671")
        }
    } catch (err) {
        console.log(err)
    }
}
const getEmails = async (gmail, messages) => {
    try {
        // categories only first 10 mails for learning
        for (let i = 0; i < 5; i++) {
            await captureEmails(gmail, messages, i);
        }
    } catch (err) {
        console.error("Error:", err);
    }
}

const checkEmailContent = (content) => {
    // Convert content to lowerCase
    content = content.toLowerCase();

    const interestedArr = ["developer", "software", "engineer"];
    const moreInfoArr = ["school", "course", "job"];

    // Check for keywords indicating interest
    if (interestedArr.some(keyword => content.includes(keyword))) {
        return "Interested";
    }
    // Check for keywords indicating request for more information
    else if (moreInfoArr.some(keyword => content.includes(keyword))) {
        return "More Information";
    }
    else {
        return "Not Interested";
    }
}

const addLabel = async (gmail, Id, label) => {
    const labelsResponse = await gmail.users.labels.list({ userId: 'me' });
    //  console.log(labelsResponse.data.labels,"ALL LABELS");
    try {
        await gmail.users.messages.modify({
            userId: "me",
            id: Id,
            resource: {
                addLabelIds: [label],
                removeLabelIds: ['INBOX']
            }
        });
        console.log(`Label '${label}' added to email with ID: ${Id}`);
    } catch (err) {
        console.error(`Error adding label '${label}' to email with ID: ${Id}`, err);
    }
}


const analyzeEmail = async (emailContent) => {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            prompt: emailContent,
            content: promptForReadEmails
        });
        console.log(response, "response")
        return response.data.choices[0].text.trim();
    } catch (error) {
        console.error('Error analyzing email:', error);
        throw error;
    }
};

module.exports = { getEmails }