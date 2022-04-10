import type {NextApiRequest, NextApiResponse} from 'next'
import type {RespostaPadraoMsg} from '../../type/RespostaPadraoMsg'
import { validarTokenJWT } from '../../midllewares/validarTokenJWT'
import { conectarMongoDB } from '../../midllewares/conectarMongoDB'
import { UsuarioModel } from '../../models/UsuarioModels'

const usuarioEndpoint = async (req: NextApiRequest, res : NextApiResponse<RespostaPadraoMsg | any>) => {

    try{

        //id usuário
        const {userId} = req.query
        //buscar todos os dados
        const usuario = await UsuarioModel.findById(userId)
        usuario.senha = null
        return res.status(200).json('Usuário autenticado com sucesso')

    }catch(e){
        console.log(e)
        return res.status(400).json({erro : 'Não foi pssível obter dados'})
    }


   
}

export default validarTokenJWT(conectarMongoDB(usuarioEndpoint))