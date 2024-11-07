import { Schema, model, Types } from "mongoose";


const clientSchema = new Schema({
    user_id:{
        type: Types.ObjectId,
        ref: 'User',
        required: true

    },
    genre:{
        type: String,
        enum: ['masculino', 'femenino'],
        required: true,
        trim: true

    },
    weight:{
        type: Number,
        required: true,
        trim: true

    },
    height:{
        type: Number,
        required: true,
        trim: true

    },
    age:{
        type: Number,
        required: true,
        trim: true

    },
    levelactivity:{
        type: String,
        enum: ['principiantes', 'intermedio', 'avanzado'],
        required: true,
        trim: true
        
    },
    days:{
        type: [String],
        enum: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sábado', 'domingo'],
        required: true,

    },
    coach_id:{
        type: Types.ObjectId,
        ref: 'Coach',
    },
    progress:[
        {
            startDate: {
                type: Date,
                default: Date.now
            },
            currentWeight: {
                type: Number,
                trim: true
            },
            observations: {
                type: String,
                trim: true
            }
        }
    ]
});


export default model('Client', clientSchema);