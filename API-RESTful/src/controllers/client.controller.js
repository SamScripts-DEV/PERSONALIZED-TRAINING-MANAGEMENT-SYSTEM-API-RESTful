import User from "../models/user.js";
import Client from "../models/client.js";
import { generateVerificationCode, sendMailToConfirm, sendVerificationMail } from "../config/nodemailer.js";
import Routine from "../models/routine.js";
import Progress from "../models/progress.js";
import Coach from "../models/coach.js";



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

        sendVerificationMail(newUser.email, verificationCode)

        setTimeout(async () => {
            try{
                const userInDb = await User.findById(newUser._id);
                if(userInDb && !userInDb.confirmEmail){
                    await User.deleteOne({_id: newUser._id});
                    console.log(`Usuario ${newUser.email} ha sido eliminado por no verificar su correo, por favor vuelva a registrarse`);
                }
            } catch (error) {
                console.error(error)
            }
        }, 3 * 60 * 1000)


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

        if(Object.values(req.body).includes('')) return res.status(400).json({res: 'Rellene todos los campos antes de enviar la solicitud'})

        const existingProfile = await Client.findOne({user_id: userID})
        if(existingProfile) return res.status(400).json({res: 'El perfil ya ha sido creado'})

        let coach = null
        if(coach_id){
            coach = await Coach.findOne({_id: coach_id})
            if(!coach) return res.status(404).json({res: 'El coach no existe'})
            
            
        }

        const initialProgress = await Progress.create({
            client_id: userID,
            currentWeight: weight,
            observations: 'Inicio del Perfil'
        })

        const newClient = new Client({
            user_id: userID, 
            genre, 
            weight, 
            height, 
            age, 
            levelactivity, 
            days, 
            coach_id,
            progress: [initialProgress]
        })
        await newClient.save()

        
        
        if(!coach.clientes.includes(newClient._id)){
            coach.clientes.push(newClient._id)
            await coach.save()
        }
        
        

        res.status(201).json({res: 'Perfil creado correctamente', newClient})


    } catch (error) {
        console.error(error)
        res.status(500).json({res: 'Error en el servidor', error})
        
    }
};


const viewRoutineForClient = async (req, res) => {
    try {
        
        const userId = req.userBDD._id;

        
        const client = await Client.findOne({ user_id: userId });
        if (!client) return res.status(404).json({ res: 'Cliente no encontrado' });

        
        const routine = await Routine.findOne({ client_id: client._id })
            .populate('client_id', 'name lastname') 
            .populate('coach_id', 'name lastname') 
            .populate('days.exercises', 'apiID name category equipment force images level primaryMuscles instructions'); 

        if (!routine) return res.status(404).json({ res: 'No hay rutina asignada para este cliente' });

       
        res.status(200).json({ res: 'Rutina encontrada', routine });
    } catch (error) {
        console.error(error);
        res.status(500).json({ res: 'Error en el servidor', error });
    }
};



const viewClientProfile = async(req, res) => {
    try {
        const client_id = req.userBDD._id

        const clientProfile = await Client.findOne({user_id: client_id})
            .populate('user_id', 'name lastname email')
            .populate('coach_id', 'user_id')
            .populate({
                path: 'progress',
                select: 'currentWeight observations, start_date',
            })

            if (!clientProfile) return res.status(404).json({ res: 'Perfil de cliente no encontrado' });

           
            res.status(200).json({
                res: 'Perfil de cliente encontrado',
                client: {
                    client_id: clientProfile._id,
                    name: clientProfile.user_id.name,
                    lastname: clientProfile.user_id.lastname,
                    email: clientProfile.user_id.email,
                    coach_id: clientProfile.coach_id ? clientProfile.coach_id._id : null,
                    coach_name: clientProfile.coach_id ? clientProfile.coach_id.user_id.name : null,
                    genre: clientProfile.genre,
                    weight: clientProfile.weight,
                    height: clientProfile.height,
                    age: clientProfile.age,
                    levelactivity: clientProfile.levelactivity,
                    days: clientProfile.days,
                    progress: clientProfile.progress
                }
            });

    } catch (error) {
        console.error(error)
        res.status(500).json({res: 'Error en el servidor', error})
        
    }
};


const viewAllClients = async (req, res) => {
    try {
        
        const clients = await Client.find()
            .populate('user_id', 'name lastname email status') 
            .populate('coach_id', 'user_id') 
            .populate({
                path: 'progress', 
                select: 'currentWeight observations start_date',
            });

        if (!clients.length) {
            return res.status(404).json({ res: 'No hay clientes registrados' });
        }

        const clientData = clients.map(client => ({
            client_id: client._id,
            name: client.user_id.name,
            lastname: client.user_id.lastname,
            email: client.user_id.email,
            coach_id: client.coach_id ? client.coach_id._id : null,
            coach_name: client.coach_id ? client.coach_id.user_id.name : null,
            genre: client.genre,
            weight: client.weight,
            height: client.height,
            age: client.age,
            status: client.user_id.status,
            levelactivity: client.levelactivity,
            days: client.days,
            progress: client.progress,
        }));

        res.status(200).json({
            res: 'Clientes encontrados',
            clients: clientData,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ res: 'Error en el servidor', error });
    }
};



const deleteClient = async (req, res) => {
    try {
        const {clientID} = req.params

        const client = await Client.findById(clientID)
        if(!client) return res.status(404).json({res: 'Cliente no encontrado'})

        const user = await User.findById(Client.user_id)
        if(user){
            user.status = false
            await user.save()
        }

        if(client.coach_id){
            const coach = await Coach.findById(client.coach_id)
            if(coach){
                coach.clientes = coach.clientes.filter(id => id.toString() !== client._id.toString())
                await coach.save()
            }
        }

        await client.deleteOne()
        res.status(200).json({res: 'Cliente eliminado correctamente'})
    } catch (error) {
        console.error(error)
        res.status(500).json({res: 'Error en el servidor', error})
        
    }
};



const updateClientProfile = async (req, res) => {
    try {
        const userId = req.userBDD._id; 
        const {
            name,
            lastname,
            email,
            genre,
            weight,
            height,
            age,
            levelactivity,
            days
        } = req.body;

       
        if (
            !name || !lastname || !email || 
            !genre || !weight || !height || 
            !age || !levelactivity || !days || days.length === 0
        ) {
            return res.status(400).json({ res: 'Rellene todos los campos obligatorios' });
        }

      
        if (!['masculino', 'femenino'].includes(genre)) {
            return res.status(400).json({ res: 'El género debe ser masculino o femenino' });
        }
        if (!['principiante', 'intermedio', 'avanzado'].includes(levelactivity)) {
            return res.status(400).json({ res: 'El nivel de actividad no es válido' });
        }
        if (!days.every(day => ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'].includes(day))) {
            return res.status(400).json({ res: 'Los días de entrenamiento no son válidos' });
        }

        
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { name, lastname, email },
            { new: true, runValidators: true }
        );
        if (!updatedUser) {
            return res.status(404).json({ res: 'Usuario no encontrado' });
        }

        
        const client = await Client.findOne({ user_id: userId });
        if (!client) {
            return res.status(404).json({ res: 'Cliente no encontrado' });
        }

       
        const updatedClient = await Client.findByIdAndUpdate(
            client._id,
            { genre, weight, height, age, levelactivity, days },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            res: 'Perfil actualizado correctamente',
            user: {
                name: updatedUser.name,
                lastname: updatedUser.lastname,
                email: updatedUser.email
            },
            client: {
                genre: updatedClient.genre,
                weight: updatedClient.weight,
                height: updatedClient.height,
                age: updatedClient.age,
                levelactivity: updatedClient.levelactivity,
                days: updatedClient.days
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ res: 'Error en el servidor', error });
    }
};


const getTrainingReminders = async (req, res) =>{
    try {
        const userID = req.userBDD._id

        const client = await Client.findOne({user_id: userID})
        if(!client) return res.status(404).json({res: 'Cliente no encontrado'})

        res.status(200).json({res: 'Dias de entrenamiento obtenidos', days: client.days})
        
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
    viewRoutineForClient,
    viewClientProfile,
    deleteClient,
    viewAllClients,
    updateClientProfile,
    getTrainingReminders
}