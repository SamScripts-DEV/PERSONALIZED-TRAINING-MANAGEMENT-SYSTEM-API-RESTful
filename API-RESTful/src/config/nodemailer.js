import nodemailer from 'nodemailer';
import 'dotenv/config';

let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: process.env.HOST_MAILTRAP,
    port: process.env.PORT_MAILTRAP,
    auth: {
        user: process.env.USER_MAILTRAP,
        pass: process.env.PASS_MAILTRAP
    }
});


const sendMailToCoach = async (userMail, password, nameCoach) =>{
    let info = await transporter.sendMail({
        from: 'rutinfit@fitness.com',
        to: userMail,
        subject: "Bienvenido a RutinFit",
        html: `<h1>Bienvenido a RutinFit</h1>
        <p>Hola ${nameCoach} es un gusto que trabajes junto a nostros, a continuación encontraras la contraeña con la que podrás acceder al sistema de entrenadores</p>

        <h3>Contraseña: ${password}</h3>
        <p>Por favor no compartas esta contraseña con nadie</p>
        <a href = ${process.env.URL_FRONT}>Click aqui para iniciar sesión</a>
        <p>Gracias por ser parte de RutinFit.</p>
        `
    });
    console.log("Mensaje enviado correctamente");
    
}

export {
    sendMailToCoach
}