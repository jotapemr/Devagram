import type {NextApiRequest, NextApiResponse} from 'next'
import {conectarMongoDB} from '../../midllewares/conectarMongoDB'
import {validarTokenJWT} from '../../midllewares/validarTokenJWT'
import { UsuarioModel } from '../../models/UsuarioModels'
import type {RespostaPadraoMsg} from '../../type/RespostaPadraoMsg'
import {politicaCORS} from '../../midllewares/politicaCORS'


const pesquisaEndpoint = async(req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg | any>) => {
    
    try{
        if(req.method === 'GET'){
            if(req?.query?.id){
                const usuarioEncontrado = await UsuarioModel.findById(req?.query?.id)
                if(!usuarioEncontrado){
                    return res.status(400).json({erro : 'Usuário não encontrado'})
                }
                usuarioEncontrado.senha = null;
                
                return res.status(200).json(usuarioEncontrado)
            }
            else{
                const {filtro} = req.query;
                if(!filtro || filtro.length < 2){
                    return res.status(400).json({erro : 'Favor informar pelo menos 2 caracteres para a busca'})
                }
    
                const usuariosEncontrados = await UsuarioModel.find({
                    $or: [{ nome : {$regex : filtro, $options: 'i'}}] // i de ignore case (ignora o case sensitive)
                })

                usuariosEncontrados.forEach(e => e.senha = null)

                return res.status(200).json(usuariosEncontrados)
            }
        }
        return res.status(405).json({erro : 'Método informado não e válido'})
    }catch(e){
        console.log(e);
        return res.status(500).json({erro : 'Não foi possivel buscar usuários:' + e})
    }
}


export default politicaCORS(validarTokenJWT(conectarMongoDB(pesquisaEndpoint)))