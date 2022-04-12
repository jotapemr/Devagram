import type {NextApiRequest, NextApiResponse, NextApiHandler} from 'next'
import moongose from 'mongoose'
import mongoose from 'mongoose'
import type {RespostaPadraoMsg} from '../type/RespostaPadraoMsg'

export const conectarMongoDB = (handler: NextApiHandler) =>
    async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg | any>) =>{

        //checa se o banco está conectado, se estiver seguir para o proximo endpoint ou midlleware
        if(mongoose.connections[0].readyState){
            return handler(req, res)
        }
        //obter a variavel de ambiente preenchida do ENV
        const {DB_CONEXAO_STRING} = process.env

        //se a env tiver vazia aborta o sistema e avisa o dev
        if(!DB_CONEXAO_STRING){
            return res.status(500).json({erro : 'ENV de configuração do banco, não informado'})
        }

        mongoose.connection.on('connected', () => console.log('Banco de dados conectado'))
        mongoose.connection.on('error', error => console.log('Ocorreu erro ao conectar banco de dados'))
        await mongoose.connect(DB_CONEXAO_STRING)

        return handler(req, res)
    }
