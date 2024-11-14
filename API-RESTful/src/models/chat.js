import { Schema, model } from "mongoose";

const chatSchema = new Schema({
    message:{
        type:String,
        required:true,
        trim: true,
    },
    trasnmitter:{
        type:String,
        required:true,
        trim: true,
    },
    name:{
        type:String,
        required:true,
        trim: true,
    },
    rol:{
        type:String,
        required:true,
        trim: true,
    },

},{timestamps:true});

export default model('Chat', chatSchema);