import User from "../models/user.js";
import Client from "../models/client.js";
import generateToken from "../helpers/JWT.js";
import { generateVerificationCode, sendMailToConfirm } from "../config/nodemailer.js";
import Routine from "../models/routine.js";


const clientRegisterAll = async (req, res) => {
    try {
        const {name, lastname, email,password, genre, weight, height, age, levelactivity, days, coach_id} = req.body
        const verifyEmailBDD = await User.findOne({email}) 
        if(verifyEmailBDD) return res.status(400).json({res: 'El email ya se encuentra registrado'})

        const newUser = new User({name, lastname, email, password, rol: 'cliente'})
        newUser.password = await newUser.encryptPassword(password)
        await newUser.save()


        const newClient = new Client(
            {
                user_id: newUser._id, 
                genre, 
                weight, 
                height, 
                age, 
                levelactivity, 
                days, 
                coach_id
            })

        await newClient.save()

        res.status(201).json({res: "Cliente registrado correctamente", newUser, newClient})

    } catch (error) {
        console.error(error)
        res.status(500).json({res: 'Error en el servidor', error})
    }
};


const clientRegisterOnly = async (req, res) => {
    try {
        const {email, password, rol} = req.body

        if(Object.values(req.body).includes('')) return res.status(400).json({res: 'Rellene todos los campos antes de enviar la solicitud'})
        if(await  User.findOne({email})) return res.status(400).json({res: 'El email ya se encuentra registrado'})

        const newUser = new User(req.body)
        newUser.password = await newUser.encryptPassword(password)

        const verificationCode = generateVerificationCode()
        newUser.verificationCode = verificationCode
        newUser.codeExpiry = new Date(Date.now() + 10 * 60 * 1000)

        
        await newUser.save()

        sendMailToConfirm(newUser.email, verificationCode)

        res.status(201).json({res: 'Registro exitoso, confirme su correo para iniciar sesión', newUser})
    } catch (error) {
        console.error(error)
        return res.status(500).json({res: 'Error en el servidor'})
    }
};


const confirmEmail = async (req, res) => {
    const {email, code} = req.body
    try {
        const userBDD = await User.findOne({email})
        if(!userBDD) return res.status(400).json({res: 'Usuario no encontrado'})

        if(userBDD.verificationCode !== code || userBDD.codeExpiry < Date.now()) return res.status(400).json({res: 'Código invalido o expirado'});
        if(!userBDD.verificationCode) return res.status(401).json({res:"La cuenta no ha sido verificada"})

        

        userBDD.verificationCode = null
        userBDD.codeExpiry = null
        userBDD.confirmEmail = true
        await userBDD.save()
        res.status(200).json({res: 'Correo verificado con éxito'})
    } catch (error) {
        console.error(error)
        res.status(500).json({res: 'Error en el servidor', error})
        
    }
      
};

const configureClienProfile = async (req, res) => {
    try {
        const {genre, weight, height, age, levelactivity, days, coach_id} = req.body
        const userID = req.userBDD._id

        const existingProfile = await Client.findOne({user_id: userID})
        if(existingProfile) return res.status(400).json({res: 'El perfil ya ha sido creado'})

        const newClient = new Client({user_id: userID, genre, weight, height, age, levelactivity, days, coach_id})
        await newClient.save()
        res.status(201).json({res: 'Perfil creado correctamente', newClient})


    } catch (error) {
        console.error(error)
        res.status(500).json({res: 'Error en el servidor', error})
        
    }
};


const viewRoutineForClient = async (req, res) => {
    try {
        const routine = await Routine.findOne({client_id: req.userBDD._id}).populate('client_id', 'name lastname').populate('coach_id', 'name lastname').populate('days.exercises', 'apiID name category instructions')
        if(!routine) return res.status(404).json({res: 'No hay rutina asignada'})

        res.status(200).json({res: 'Rutina encontrada', routine})
        
    } catch (error) {
        console.error(error)
        res.status(500).json({res: 'Error en el servidor', error})
        
    }
}





export{
    clientRegisterAll,
    clientRegisterOnly,
    confirmEmail,
    configureClienProfile,
    viewRoutineForClient
}