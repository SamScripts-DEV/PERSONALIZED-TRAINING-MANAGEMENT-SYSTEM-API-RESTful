import User from "../models/user.js";
import generateToken from "../helpers/JWT.js";
import { sendMailToConfirm, sendMailToRecoveryPassword } from "../config/nodemailer.js";

const userRegister = async (req, res) => {
    try {
        const { email, password, rol } = req.body

        if (Object.values(req.body).includes('')) return res.status(400).json({ res: 'Rellene todos los campos antes de enviar la solicitud' })
        if (await User.findOne({ email })) return res.status(400).json({ res: 'El email ya se encuentra registrado' })

        const newUser = new User(req.body)
        newUser.password = await newUser.encryptPassword(password)
        // await newUser.crearToken()
        // sendMailToConfirm(email, newUser.token)

        await newUser.save()

        res.status(201).json({ res: 'Registro exitoso', newUser })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ res: 'Error en el servidor' })
    }
};

// const confirmEmail = async (req, res) => {
//     if(!(req.params.token)) return res.status(400).json({res: 'No se puede validar la cuenta'})

//     const userBDD = await User.findOne({token: req.params.token})
//     if(!userBDD?.token) return res.status(404).json({res: 'La cuenta ya ha sido validada'})

//     userBDD.token = null
//     userBDD.confirmEmail = true
//     await userBDD.save()
//     res.status(200).json({res: 'Cuanta validada puedes iniciar sesión'})
// };


const login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (Object.values(req.body).includes('')) return res.status(400).json({ res: 'Rellene todos los campos' })
        const userBDD = await User.findOne({ email }).select('-status -createdAt -updatedAt -token')
        console.log(userBDD);

        if (!userBDD) return res.status(404).json({ res: 'El email no se encuentra registrado por favor registrese' })
        const verifyPassword = await userBDD.matchPassword(password)
        if (!verifyPassword) return res.status(401).json({ res: 'Contraseña Incorrecta' })

        const token = generateToken(userBDD._id, userBDD.rol)
        const { name, lastname, rol, _id } = userBDD
        res.status(200).json({ res: 'Login exitoso', token, name, lastname, email, rol, _id })

    } catch (error) {
        console.error(error);
        return res.status(500).json({ res: 'Error en el servidor' })
    }

};


const updatePassword = async (req, res) => {
    const userBDD = await User.findById(req.userBDD._id)
    const verifyPassword = await userBDD.matchPassword(req.body.password)
    if (!verifyPassword) return res.status(401).json({ res: 'Contraseña Incorrecta' })

    userBDD.password = await userBDD.encryptPassword(req.body.newpassword)
    await userBDD.save()

    res.status(200).json({ res: 'Contraseña actualizada correctamente' })
};

const restorePassword = async (req, res) => {
    const { email } = req.body
    if (Object.values(req.body).includes('')) return res.status(400).json({ res: 'Rellene todos los campos' })
    const userBDD = await User.findOne({ email })
    if (!userBDD) return res.status(404).json({ res: 'El email no se encuentra registrado' })

    await userBDD.createToken()
    sendMailToRecoveryPassword(email, userBDD.token)
    await userBDD.save()

    res.status(200).json({ res: 'Correo enviado, revise su bandeja de entrada' })
};

const confirmTokenPassword = async (req, res) => {
    if (!(req.params.token)) return res.status(400).json({ res: 'Token no encontrado' })

    const userBDD = await User.findOne({ token: req.params.token })
    if (userBDD?.token !== req.params.token) return res.status(404).json({ res: 'Token no valido' })

    await userBDD.save()

    res.status(200).json({ res: 'Token confirmado, puede cambiar su contraseña' })
};

const newPassword = async (req, res) => {
    const { password, confirmPassword } = req.body;
    if (!password || !confirmPassword) {
        return res.status(400).json({ res: 'Rellene todos los campos' });
    }
    if (password !== confirmPassword) {
        return res.status(400).json({ res: 'Las contraseñas no coinciden' });
    }

    try {
        const userBDD = await User.findOne({ token: req.params.token });

        if (!userBDD || userBDD.token !== req.params.token) {
            return res.status(404).json({ res: 'Token no válido' });
        }

        userBDD.token = null;
        userBDD.password = await userBDD.encryptPassword(password);
        await userBDD.save();

        res.status(200).json({ res: 'Contraseña actualizada correctamente' });
    } catch (error) {
        console.error('Error al actualizar la contraseña:', error);
        res.status(500).json({ res: 'Error en el servidor' });
    }
}

export {
    userRegister,
    login,
    updatePassword,
    restorePassword,
    confirmTokenPassword,
    newPassword

}