import { Schema, model, Types } from "mongoose";


const routineSchema = new Schema({
    client_id:{
        type: Types.ObjectId,
        ref: 'Client',
        required: true
    },
    coach_id:{
        type: Types.ObjectId,
        ref: 'Coach',
        required: true
    },
    exercises:[],
    assignment_date:{
        type: Date,
        default: Date.now
    },
    comments:{
        type: String
    },
    
});