import { Types } from "mongoose";
import { sendMailToCoach } from "../config/nodemailer.js";
import generateToken from "../helpers/JWT.js";
import Coach from "../models/coach.js";
import User from "../models/user.js";
import { login } from "./users.controller.js";
import user from "../models/user.js";

const coachRegister = async (req, res) => {
    try {
        const {name, lastname, email, description} = req.body 
        const verifyEmailBDD = await User.findOne({email}) || await Coach.findOne({email})
        if(verifyEmailBDD) return res.status(400).json({res: 'El email ya se encuentra registrado'})

        const newUser = new User({name, lastname, email, rol: 'entrenador'})
        console.log(newUser);
        const password = `rutinfit${Math.random().toString(36).slice(2)}`
        newUser.password = await newUser.encryptPassword(password)

        await newUser.save()
       
        await sendMailToCoach(email, password, name)

        const newCoach = new Coach({user_id: newUser._id, description})
        await newCoach.save()
        console.log(newCoach);
        
        res.status(201).json({res: "Entrenador registrado correctamente", newUser, newCoach})
    } catch (error) {
        console.error(error)
        return res.status(500).json({res: 'Error en el servidor', error})
        
    }
};

const viewCoaches = async (req,res) => {
    try {
        const coaches = await Coach.find().populate('user_id', 'name lastname email')
        res.status(200).json(coaches)
    } catch (error) {
        console.error(error)
        return res.status(500).json({res: 'Error en el servidor'})
    }
};

const viewCoachById = async (req, res) => {
    const {id}  = req.params 
    try {
        const coach = await Coach.findById(id).populate('user_id', 'name lastname email')
        res.status(200).json(coach)

        if(!coach) return res.status(404).json({res: 'Entrenador no encontrado'})
    } catch (error) {
        console.error(error)
        return res.status(500).json({res: 'Error en el servidor'})
    }
};


const updateCoach = async (req, res) => {
    const {id} = req.params 
    if(!Types.ObjectId.isValid(id)) return res.status(400).json({res: 'Id no válido'})
    if(Object.values(req.body).includes('')) return res.status(400).json({res: 'Rellene todos los campos'})

    await Coach.findByIdAndUpdate(id, req.body)
    res.status(200).json({res: 'Entrenador actualizado correctamente'})
};


const deleteCoach = async (req, res) => {
    try {
        const {id} = req.params 
    if(!Types.ObjectId.isValid(id)) return res.status(400).json({res: 'Id no válido'})

    const deletedCoach = await Coach.findByIdAndDelete({user_id: id})
    if (!deletedCoach)  return res.status(404).json({res: 'Entrenador no encontrado'})


    const deletedUser = await User.findByIdAndDelete(id)
    if (!deletedUser) return res.status(404).json({res: 'Usuario no encontrado'})


    res.status(200).json({res: 'Entrenador eliminado correctamente'})

    } catch (error) {
        res.status(500).json({res: 'Error en el servidor'})
        
    }
};

export {
    coachRegister,
    viewCoaches,
    viewCoachById,
    updateCoach,
    deleteCoach
}