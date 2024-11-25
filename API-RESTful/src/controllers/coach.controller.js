import { Types } from "mongoose";
import { sendMailToCoach } from "../config/nodemailer.js";
import generateToken from "../helpers/JWT.js";
import Coach from "../models/coach.js";
import User from "../models/user.js";
import { login } from "./users.controller.js";
import user from "../models/user.js";
import Client from "../models/client.js";

const coachRegister = async (req, res) => {
    try {
        const { name, lastname, email, description } = req.body
        const verifyEmailBDD = await User.findOne({ email })
        if (verifyEmailBDD) return res.status(400).json({ res: 'El email ya se encuentra registrado' })

        const newUser = new User({ name, lastname, email, rol: 'entrenador' })
        console.log(newUser);
        const password = `RutinFit${Math.random().toString(36).slice(2)}`
        newUser.password = await newUser.encryptPassword(password)

        await newUser.save()

        await sendMailToCoach(email, password, name)

        const newCoach = new Coach({ user_id: newUser._id, description })
        await newCoach.save()
        console.log(newCoach);

        res.status(201).json({ res: "Entrenador registrado correctamente", newUser, newCoach })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ res: 'Error en el servidor', error })

    }
};

const viewCoaches = async (req, res) => {
    try {
        const coaches = await Coach.find().populate('user_id', 'name lastname email status')
        res.status(200).json(coaches)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ res: 'Error en el servidor' })
    }
};

const viewCoachById = async (req, res) => {
    const { id } = req.params
    try {
        const coach = await Coach.findById(id).populate('user_id', 'name lastname email status')
        res.status(200).json(coach)

        if (!coach) return res.status(404).json({ res: 'Entrenador no encontrado' })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ res: 'Error en el servidor' })
    }
};


const updateCoach = async (req, res) => {
    const { id } = req.params;
    const { name, lastname, email, description } = req.body;

    // Validaciones iniciales
    if (!Types.ObjectId.isValid(id)) return res.status(400).json({ res: 'Id no válido' });
    if (Object.values(req.body).includes('')) return res.status(400).json({ res: 'Rellene todos los campos' });

    try {
        // Buscar el entrenador por ID
        const coach = await Coach.findById(id);
        if (!coach) return res.status(404).json({ res: 'Entrenador no encontrado' });

        // Actualizar descripción del entrenador
        const updatedCoach = await Coach.findByIdAndUpdate(
            id,
            { description },
            { new: true }
        ).select('-__v'); // Excluir la propiedad `__v`

        // Actualizar información del usuario asociado
        const updatedUser = await User.findByIdAndUpdate(
            coach.user_id,
            { name, lastname, email },
            { new: true }
        ).select('name lastname email rol status'); // Seleccionar campos específicos

        // Construir respuesta uniforme
        res.status(200).json({
            res: 'Entrenador actualizado correctamente',
            coach: {
                id: updatedCoach._id,
                description: updatedCoach.description,
                clientes: updatedCoach.clientes.map(cliente => ({
                    id: cliente._id,
                    assignmentDate: cliente.assignmentDate,
                })),
            },
            user: {
                id: updatedUser._id,
                name: updatedUser.name,
                lastname: updatedUser.lastname,
                email: updatedUser.email,
                rol: updatedUser.rol,
                status: updatedUser.status,

            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ res: 'Error en el servidor' });
    }
};



const deleteCoach = async (req, res) => {
    try {
        const { id } = req.params
        if (!Types.ObjectId.isValid(id)) return res.status(400).json({ res: 'Id no válido' })

        console.log(id);

        const coach = await Coach.findOne({ _id: id })
        if (!coach) return res.status(404).json({ res: 'Entrenador no encontrado' })

        const { user_id } = coach
        const user = await User.findById(user_id)

        if (!user) return res.status(404).json({ res: 'Usuario no encontrado' })
        await Coach.findByIdAndDelete(id)
        await User.findByIdAndDelete(user_id)

        res.status(200).json({ res: 'Entrenador eliminado correctamente' })

    } catch (error) {
        res.status(500).json({ res: 'Error en el servidor', error })

    }
};

const getClientsByCoach = async (req, res) => {
    try {
        const userID = req.userBDD._id;
        const userRole = req.userBDD.rol;

        if (userRole !== 'entrenador') {
            return res.status(403).json({ res: 'Acceso denegado: solo los entrenadores pueden ver a sus clientes' });
        }

        const coach = await Coach.findOne({ user_id: userID });

        if (!coach) {
            return res.status(404).json({ res: 'Entrenador no encontrado' });
        }

        const coachID = coach._id;


        const clients = await Client.find({ coach_id: coachID })
            .populate('user_id', 'name lastname email status')
            .populate('progress');

        if (!clients.length) {
            return res.status(404).json({ res: 'No hay clientes asignados a este entrenador' });
        }
        res.status(200).json(clients);

    } catch (error) {
        console.error(error);
        res.status(500).json({ res: 'Error en el servidor', error });
    }
};

const getClientsByCoachId = async (req, res) => {
    try {
        const { coachID } = req.params;

        if (!Types.ObjectId.isValid(coachID)) {
            return res.status(400).json({ res: 'ID de entrenador no válido' });
        }

        const coach = await Coach.findById(coachID);
        if (!coach) {
            return res.status(404).json({ res: 'Entrenador no encontrado' });
        }

        const clients = await Client.find({ coach_id: coach._id })
            .populate('user_id', 'name lastname email status')
            .populate('progress');

        if (!clients.length) {
            return res.status(404).json({ res: 'No hay clientes asignados a este entrenador' });
        }

        res.status(200).json({ res: 'Clientes encontrados', clients });
    } catch (error) {
        console.error(error);
        res.status(500).json({ res: 'Error en el servidor', error });
    }
};




const getClientByCoachById = async (req, res) => {
    try {

        const userID = req.userBDD._id;
        const coach = await Coach.findOne({ user_id: userID });
        if (!coach) {
            return res.status(404).json({ res: 'Entrenador no encontrado' });
        }

        const coach_id = coach._id;

        const { clientID } = req.params;

        const clientBDD = await Client.findOne({ coach_id, _id: clientID })
            .populate('user_id', 'name lastname email status')

        if (!clientBDD) {
            return res.status(404).json({ res: 'Cliente no encontrado' });
        }


        res.status(200).json({ client: clientBDD });

    } catch (error) {

        console.error(error);
        res.status(500).json({ res: 'Error en el servidor', error });
    }
};


const viewCoachProfile = async (req, res) => {
    try {

        const userID = req.userBDD._id;

        const coachProfile = await Coach.findOne({ user_id: userID })
            .populate('user_id', 'name lastname email rol');

        if (!coachProfile) {
            return res.status(404).json({ res: 'Entrenador no encontrado' });
        }


        const clientIDs = coachProfile.clientes.map(client => client._id);
        const clients = await Client.find({ _id: { $in: clientIDs } })
            .populate('user_id', 'name lastname email')
            .populate({
                path: 'progress',
                select: 'start_date currentWeight observations',
            });


        res.status(200).json({
            coach: {
                name: coachProfile.user_id.name,
                lastname: coachProfile.user_id.lastname,
                email: coachProfile.user_id.email,
                rol: coachProfile.user_id.rol,
                description: coachProfile.description,
            },
            clients: clients.map(client => ({
                _id: client._id,
                name: client.user_id.name,
                lastname: client.user_id.lastname,
                email: client.user_id.email,
                genre: client.genre,
                weight: client.weight,
                height: client.height,
                age: client.age,
                levelactivity: client.levelactivity,
                days: client.days,
                progress: client.progress,
            })),
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ res: 'Error en el servidor', error });
    }
};







export {
    coachRegister,
    viewCoaches,
    viewCoachById,
    updateCoach,
    deleteCoach,
    getClientsByCoach,
    getClientByCoachById,
    viewCoachProfile,
    getClientsByCoachId
}