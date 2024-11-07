import User from "../models/user.js";
import Client from "../models/client.js";
import generateToken from "../helpers/JWT.js";


const clientRegister = async (req, res) => {
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


export{
    clientRegister
}