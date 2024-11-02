import User from "../models/user.js";
import generateToken from "../helpers/JWT.js";

const userRegister = async (req, res) => {
    try {
        const {email, password, rol} = req.body

        if(Object.values(req.body).includes('')) return res.status(400).json({res: 'Rellene todos los campos antes de enviar la solicitud'})
        if(await  User.findOne({email})) return res.status(400).json({res: 'El email ya se encuentra registrado'})

        const newUser = new User(req.body)
        newUser.password = await newUser.encryptPassword(password)

        await newUser.save()

        res.status(201).json({res: 'Registro exitoso'})
    } catch (error) {
        console.error(error)
        return res.status(500).json({res: 'Error en el servidor'})
    }
};

export{
    userRegister
}