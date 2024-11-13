import { Schema, model } from "mongoose";

const exerciseSchema = new Schema({
    apiID: { type: String, unique: true },
    category: String,
    equipment: String,
    force: String,
    images: [String],
    instructions: [String],
    level: String,
    mechanic: String,  
    name: String,
    primaryMuscles: [String],  
    secondaryMuscles: [String],  
});

export default model("Exercise", exerciseSchema);
