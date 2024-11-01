import User from "../models/user.js";

const userRegister = async (req, res) => {
    const {email, password} = req.body
    const newUser = new User(req.body)
    await newUser.save()

    res.status(201).json({res: 'Registro exitoso'})
};

export{
    userRegister
}