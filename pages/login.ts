import type {NextApiRequest, NextApiResponse} from 'next';
import {conectarMongoDB} from '../midllewares/conectarMongoDB'
import type {RespostaPadraoMsg} from '../type/RespostaPadraoMsg'

const endpointLogin = (
    req : NextApiRequest,
    res : NextApiResponse<RespostaPadraoMsg>
) => {
    if(req.method === 'POST'){
        const {login, senha} = req.body;

        if(login === 'admimadmim@.com' &&
        senha === 1234){
            return res.status(200).json({msg : 'Usuário autenticado'})
        }
        return res.status(400).json({erro : 'Usuário ou senha não encontrado'})
    }
    return res.status(405).json({erro : 'Método informado é inválido'})
}

export default conectarMongoDB(endpointLogin)