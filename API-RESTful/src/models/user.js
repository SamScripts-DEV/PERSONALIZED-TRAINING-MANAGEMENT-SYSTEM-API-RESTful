import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";


const userSchema = new Schema({
    name :{
        type: String,
        required: true,
        trim: true,
    },
    lastname:{
        type: String,
        required: true,
        trim: true,
    },
    mail:{
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    rol:{
        type: String,
        enum: ['administrador', 'entrenador', 'cliente'],
        required: true,
        default: 'cliente'
    },
    status:{
        type: Boolean,
        default: true
    }
},{
    timestamps: true
});

export default model('User', userSchema);