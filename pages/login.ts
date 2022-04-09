import type {NextApiRequest, NextApiResponse} from 'next';
import {conectarMongoDB} from '../midllewares/conectarMongoDB'
import type {RespostaPadraoMsg} from '../type/RespostaPadraoMsg'
import md5 from 'md5';
import { UsuarioModel } from '../models/UsuarioModels';

const endpointLogin = async (
    req : NextApiRequest,
    res : NextApiResponse<RespostaPadraoMsg>
) => {
    if(req.method === 'POST'){
        const {login, senha} = req.body;

        const usuariosEncontrados = await UsuarioModel.find({email: login, senha: md5(senha)})

        if(usuariosEncontrados && usuariosEncontrados.length > 0){
            const usuarioEncontrado = usuariosEncontrados[0]
            return res.status(200).json({msg : `Usuário ${usuarioEncontrado.nome} autenticado`})
        }
        return res.status(400).json({erro : 'Usuário ou senha não encontrado'})
    }
    return res.status(405).json({erro : 'Método informado é inválido'})
}

export default conectarMongoDB(endpointLogin)