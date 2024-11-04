import { Schema, model, Tyoes } from "mongoose";


const clientSchema = new Schema({
    user_id:{

    },
    genre:{
        type: String,
        required: true,
        trim: true

    },
    weight:{

    },
    height:{

    },
    age:{

    },
    levelactivity:{
        
    },
    days:{

    },
    progress:{

    }
});


export default model('Client', clientSchema);