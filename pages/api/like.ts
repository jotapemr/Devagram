import type {NextApiRequest, NextApiResponse} from 'next'
import { conectarMongoDB } from '../../midllewares/conectarMongoDB'
import { validarTokenJWT } from '../../midllewares/validarTokenJWT'
import { PublicacaoModel } from '../../models/PublicacaoModel'
import { UsuarioModel } from '../../models/UsuarioModels'
import type {RespostaPadraoMsg} from '../../type/RespostaPadraoMsg'
import {politicaCORS} from '../../midllewares/politicaCORS'



const likeEndpoint = async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {
    try{
        if(req.method === 'PUT'){
            const {id} = req?.query
            const publicacao = await PublicacaoModel.findById(id)
            if(!publicacao){
                return res.status(400).json({erro : 'Pulblicação não encontrada'})
            }

            const {userId} = req?.query

            const usuario = await UsuarioModel.findById(id)

            if(!usuario){
                return res.status(400).json({erro : 'Usuário não encontrado'})  
            }
            
            const indexDoUsuarioNoLike = publicacao.likes.findIndex((e : any) => e.toString() === usuario._id.toString())

            if(indexDoUsuarioNoLike != -1){ //se o index for -1 sinal q ele não curtiu a foto
                publicacao.likes.splice(indexDoUsuarioNoLike, 1)
                await PublicacaoModel.findByIdAndUpdate({_id : publicacao._id}, publicacao)
                return res.status(200).json({msg : 'Publicação descurtida com sucesso'})
            }else {  //se o index for > -1 sinal q ele ja curtiu a foto
                publicacao.likes.push(usuario._id);
                await PublicacaoModel.findByIdAndUpdate({_id : publicacao._id}, publicacao)
                return res.status(200).json({msg : 'Publicação curtida com sucesso'})
            }

        }
        return res.status(405).json({erro : 'Método informado não e válido'})
    }catch(e){
        console.log(e)
        return res.status(500).json({erro : 'Ocorreu erro ao curtir a foto'})
    }
}

export default politicaCORS(validarTokenJWT(conectarMongoDB(likeEndpoint)))
