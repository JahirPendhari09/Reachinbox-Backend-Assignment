const mongoose = require("mongoose");

const gmailSchema = mongoose.Schema({
    form:String,
    subject:String,
    body:String
})

const GmailModal = mongoose.model("gmail",gmailSchema);

module.exports ={GmailModal}