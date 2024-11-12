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

const sendMailToConfirm = async (userMail, token) => {
    let mailOptions = {
        from: process.env.USER_MAILTRAP,
        to: userMail,
        subject: 'Confirmación de correo',
        html: `<h1>Confirma tu correo</h1>
        <p>Para confirmar tu correo da click en el siguiente enlace</p>
        <a href="${process.env.URL_FRONT}/confirm/${token}">Click aqui</a>
        `
    }
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
        }else{
            console.log('Email enviado: ' + info.response);
        }
    })
}


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

const sendMailToRecoveryPassword = async (userMail, token) => {
    let info = await transporter.sendMail({
        from: 'rutinfit@fitness.com',
        to: userMail,
        subject: "Recuperación de contraseña",
        html: `<h1>Recuperación de contraseña</h1>
        <p>Para recuperar tu contraseña da click en el siguiente enlace</p>
        <a href="${process.env.URL_FRONT}/recovery/${token}">Click aqui</a>
        `
    });
    console.log("Mensaje enviado correctamente");
}

export {
    sendMailToCoach,
    sendMailToConfirm,
    sendMailToRecoveryPassword
}