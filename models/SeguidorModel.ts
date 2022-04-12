import mongoose, {Schema} from 'mongoose'
const SeguidorSchema = new Schema({
    usuarioId : {type : String, required : true},//que tem interesse em seguir
    usuarioSeguidoId : {type : String, required : true}//que está sendo seguido
});
export const SeguidorModel = (mongoose.models.seguidores || mongoose.model('seguidores', SeguidorSchema))