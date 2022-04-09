import type {NextApiRequest, NextApiResponse} from 'next';
import type {RespostaPadraoMsg} from '../type/RespostaPadraoMsg'
import type {UsuarioRequisicao} from '../type/UsuarioRequisicao'
import { UsuarioModel } from '../models/UsuarioModels';
import md5 from 'md5';
import { conectarMongoDB } from '../midllewares/conectarMongoDB';

const endpointCadastro = async (req : NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {

    if(req.method === 'POST'){
        const usuario = req.body as UsuarioRequisicao

        if(!usuario.nome || usuario.nome.length < 2){
            return res.status(400).json({erro: 'Nome inválido'})
        }

        if(!usuario.email || usuario.email.length < 5 || usuario.email.includes('@') || usuario.email.includes('.')){
            return res.status(400).json({erro: 'Email inválido'})
        }

        if(!usuario.senha || usuario.senha.length < 4) {
            return res.status(400).json({erro : 'Senha inválida'})
        }   
        //validar se ja existe o mesmo email
        const usuariosComMesmoEmail = await UsuarioModel.find({email : usuario.email})

        //salvar no banco de dados

        const usuarioASerSalvo = {
            nome : usuario.nome,
            email : usuario.email,
            senha : md5(usuario.senha)
        }
        await UsuarioModel.create(usuario);
        return res.status(200).json({msg : 'Usuário criado com sucesso'})
    }
    return res.status(405).json({erro: 'Método informado não é valido'})
}
export default conectarMongoDB(endpointCadastro)