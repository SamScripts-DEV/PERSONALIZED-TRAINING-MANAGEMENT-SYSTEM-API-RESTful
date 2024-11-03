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
    email:{
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
    },
    token:{
        type: String,
        default: null
    }

},{
    timestamps: true
});

userSchema.methods.encryptPassword = async (password) =>{
    return await bcrypt.hash(password, await bcrypt.genSalt(10))
}

userSchema.methods.matchPassword = async function(password){
    return await bcrypt.compare(password, this.password)
}


userSchema.methods.createToken = function(){
    this.token = Math.random().toString(36).slice(2)
}

export default model('User', userSchema);