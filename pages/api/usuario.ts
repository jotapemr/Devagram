import type {NextApiRequest, NextApiResponse} from 'next'
import type {RespostaPadraoMsg} from '../../type/RespostaPadraoMsg'
import { validarTokenJWT } from '../../midllewares/validarTokenJWT'

const usuarioEndpoint = (req: NextApiRequest, res : NextApiResponse) => {


    return res.status(200).json('Usuário autenticado com sucesso')
}

export default validarTokenJWT(usuarioEndpoint)