import User from "../models/user.js";
import Client from "../models/client.js";
import generateToken from "../helpers/JWT.js";
import { sendMailToConfirm } from "../config/nodemailer.js";


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
         await newUser.createToken()
         sendMailToConfirm(email, newUser.token)

        await newUser.save()

        res.status(201).json({res: 'Registro exitoso, confirme su correo para iniciar sesión', newUser})
    } catch (error) {
        console.error(error)
        return res.status(500).json({res: 'Error en el servidor'})
    }
};


const confirmEmail = async (req, res) => {
        if(!(req.params.token)) return res.status(400).json({res: 'No se puede validar la cuenta'})

        const userBDD = await User.findOne({token: req.params.token})
        if(!userBDD?.token) return res.status(404).json({res: 'La cuenta ya ha sido validada'})

        userBDD.token = null
        userBDD.confirmEmail = true
        await userBDD.save()
        res.status(200).json({res: 'Cuanta validada puedes iniciar sesión'})
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





export{
    clientRegisterAll,
    clientRegisterOnly,
    confirmEmail,
    configureClienProfile
}