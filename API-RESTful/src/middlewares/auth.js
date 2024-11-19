import jwt from 'jsonwebtoken';
import  User from '../models/user.js';


const verifyAuth = async (req, res, next) => {
    const {authorization} = req.headers;
    if(!authorization) return res.status(401).json({res: 'Acceso denegado proporciona un token válido'});

    try {
        const { id, rol } = jwt.verify(authorization.split(' ')[1], process.env.JWT_SECRET);
        const user = await User.findById(id).lean().select('-password');

        if (!user) {
            return res.status(401).json({ res: 'Usuario no encontrado.' });
        }

        req.userBDD = { ...user, role: rol }; 

        next();

    } catch (error) {
        const e = new Error('Token no válido o expirado, comuníquese con soporte')
        console.error(error);
        return res.status(401).json({res: e})
        
    }
}

export default verifyAuth;