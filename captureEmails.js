

const captureEmails = async (gmail , messages, index)=>{
    try{
        const messageId = messages.data.messages[index].id;
        const messageData = await gmail.users.messages.get({ userId: 'me', id: messageId });

        const emailSnippet = messageData.data;

        // get Content of mail with the help of emailSnippet.snippet
        const response = checkEmailContent(emailSnippet.snippet);
        // console.log(response)

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
    }catch(err){
        console.log(err)
    }
}
const getEmails = async (gmail, messages) => {
    try {
        // categories only first 10 mails for learning
        for (let i=0; i<10; i++) {
            await captureEmails(gmail, messages, i);
        }
    } catch (err) {
        console.error("Error:", err);
    }
}

const checkEmailContent = (content) => {
    // Convert content to lowerCase
    content = content.toLowerCase();
  
    const interestedArr = ["developer", "software","engineer"];
    const moreInfoArr = ["school", "course","job"];

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
            resource:{
                addLabelIds: [label],
                removeLabelIds: ['INBOX']  
            }
        });
        console.log(`Label '${label}' added to email with ID: ${Id}`);
    } catch (err) {
        console.error(`Error adding label '${label}' to email with ID: ${Id}`, err);
    }
}

module.exports ={ getEmails }