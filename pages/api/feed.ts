import type {NextApiRequest, NextApiResponse} from 'next'
import type {RespostaPadraoMsg} from '../../type/RespostaPadraoMsg'
import { validarTokenJWT } from '../../midllewares/validarTokenJWT'
import { conectarMongoDB } from '../../midllewares/conectarMongoDB'
import { UsuarioModel } from '../../models/UsuarioModels'
import {PublicacaoModel} from '../../models/PublicacaoModel'


const feedEndpoint = async (req : NextApiRequest, res : NextApiResponse<RespostaPadraoMsg | any>) => {
    try{
        if(req.method === 'GET'){

            if(req?.query?.id){
                const usuario = await UsuarioModel.findById(req?.query?.id)
                if(!usuario){
                    return res.status(400).json({erro : 'Usuário não encontrado'})
                }

                const pulblicacoes = await PublicacaoModel
                .find({idUsuario : usuario._id})
                .sort({data : -1})

                return res.status(200).json(pulblicacoes)
            }


        }

        return res.status(405).json({erro : 'Método informado não é válido'})
    }catch(e){
        console.log(e)
      
    }
    res.status(400).json({erro : 'Não foi possível obter o feed'})
}

export default validarTokenJWT(conectarMongoDB(feedEndpoint))






















//anotação

//body (post ou put, tudo que é envio de informação é no body)
//query (tudo que é consulta de informação)
