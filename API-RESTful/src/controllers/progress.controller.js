import Client from "../models/client.js";
import Progress from "../models/progress.js";


const createProgress = async (req, res) => {
    try {
        const userID = req.userBDD._id
        const clientExist = await Client.findOne({user_id: userID})
        const {currentWeight, observations} = req.body

        if(!currentWeight) return res.status(400).json({res: 'El peso actual son obligatorios'})

        
        if(!clientExist) return res.status(400).json({res: 'El cliente no existe'})

        const lastProgress = await Progress.findOne({client_id: clientExist}).sort({start_date: -1}).limit(1)

        let progressMessage = ''
        if(lastProgress){
            const weightDifference = currentWeight - lastProgress.currentWeight
            if(weightDifference > 0){
                progressMessage = `El cliente ha subido ${weightDifference}kg`
            }else if(weightDifference < 0){
                progressMessage = `El cliente ha bajado ${Math.abs(weightDifference)}kg`
            }else{
                progressMessage = 'El cliente ha mantenido su peso'
            }
        }else{
            progressMessage = 'Primer registro de peso'
        }

        const newProgress = new Progress({
            client_id: clientExist._id,
            currentWeight,
            observations,
            start_date: new Date()
        });

        await newProgress.save()

        res.status(201).json({res: 'Progreso creado correctamente',newProgress, message: progressMessage})


    } catch (error) {
        console.error(error)
        return res.status(500).json({res: 'Error en el servidor', error})
        
    }
};

const viewProgressById = async (req, res) => {
    try {
        const {id} = req.params
        if(!Types.ObjectId.isValid(id)) return res.status(400).json({res: 'El id del progreso no es válido'})

        const progress = await Progress.findById(id).populate('client_id', 'name')
        if(!progress) return res.status(404).json({res: 'Progreso no encontrado'})

        res.status(200).json({res: 'Progreso encontrado', progress})
        
    } catch (error) {
        console.error(error)
        return res.status(500).json({res: 'Error en el servidor', error})
        
    }
};

const viewAllProgressByClientId = async (req, res) => {
    try {
        const {client_id} = req.params
        if(!Types.ObjectId.isValid(client_id)) return res.status(400).json({res: 'El id del cliente no es válido'})
        
        const progress = await Progress.find({client_id}).sort({start_date: -1})
        if(progress.length === 0) return res.status(404).json({res: 'No hay progresos registrados'})

        res.status(200).json({res: 'Progresos encontrados', progress})

    } catch (error) {
        console.error(error)
        return res.status(500).json({res: 'Error en el servidor', error})
        
    }
};

const updateProgress = async (req, res) => {
    try {
        const {id} = req.params
        const {currentWeight, observations} = req.body
        if(!Types.ObjectId.isValid(id)) return res.status(400).json({res: 'El id del progreso no es válido'})
        if(!currentWeight) return res.status(400).json({res: 'El peso actual es obligatorio'})

        const updateProgress = await Progress.findByIdAndUpdate(
            id,
            {currentWeight, observations},
            {new: true, runValidators: true}
        )

        if(!updateProgress) return res.status(404).json({res: 'Progreso no encontrado'})

        res.status(200).json({res: 'Progreso actualizado correctamente', updateProgress})



    } catch (error) {
        console.error(error)
        return res.status(500).json({res: 'Error en el servidor', error})
        
    }    
};

const deleteProgress = async (req, res) => {
    try {
        const {id} = req.params
        if(!Types.ObjectId.isValid(id)) return res.status(400).json({res: 'El id del progreso no es válido'})

        const deleteProgress = await Progress.findByIdAndDelete(id)
        if(!deleteProgress) return res.status(404).json({res: 'Progreso no encontrado'})

        res.status(200).json({res: 'Progreso eliminado correctamente', deleteProgress})

    } catch (error) {
        console.error(error)
        return res.status(500).json({res: 'Error en el servidor', error})
    }
}


export{
    createProgress,
    viewProgressById,
    viewAllProgressByClientId,
    updateProgress,
    deleteProgress  
}