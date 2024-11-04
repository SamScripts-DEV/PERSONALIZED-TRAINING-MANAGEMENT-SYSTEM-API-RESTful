import { sendMailToCoach } from "../config/nodemailer.js";
import generateToken from "../helpers/JWT.js";
import Coach from "../models/coach.js";
import User from "../models/user.js";

const coachRegister = async (req, res) => {
    const {email} = req.body 
    const verifyEmailBDD = await User.findOne({email})
    if(verifyEmailBDD) return res.status(400).json({res: 'El email ya se encuentra registrado'})

    const newCoach = new Coach(req.body)
}