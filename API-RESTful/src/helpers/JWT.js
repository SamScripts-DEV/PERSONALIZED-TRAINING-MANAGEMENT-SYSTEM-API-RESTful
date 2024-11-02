import jwt from 'jsonwebtoken';

const generateToken = (id, rol) =>{
    let options;
    if(rol != 'cliente'){options = {expiresIn: '1h'}}
    return jwt.sign({id, rol}, process.env.JWT_SECRET, options)

}

export default generateToken