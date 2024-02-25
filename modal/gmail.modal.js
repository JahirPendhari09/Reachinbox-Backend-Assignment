const mongoose = require("mongoose");

const userEmailSchema = mongoose.Schema({
    email:{type:String,required:true},
    name:String,
    createAt:Number,
    picture:String,
    expireAt:Number
},{
    versionKey:false
});

const UserEmailModel = mongoose.model("emailauth",userEmailSchema);

module.exports = {
    UserEmailModel
}