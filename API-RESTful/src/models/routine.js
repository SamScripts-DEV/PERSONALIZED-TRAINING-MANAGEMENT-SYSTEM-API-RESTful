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
    days: [
        {
            day:{
                type: String,
                required: true
            },
            exercises:[
                {
                    type: Types.ObjectId,
                    ref: 'Exercise',
                    required: true
                }
            ]
        }
    ],
    assignment_date:{
        type: Date,
        default: Date.now
    },
    comments:{
        type: String
    },
    
});

export default model("Routine", routineSchema);