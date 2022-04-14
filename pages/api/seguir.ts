import type {NextApiRequest, NextApiResponse} from 'next'
import {conectarMongoDB} from '../../midllewares/conectarMongoDB'
import {validarTokenJWT} from '../../midllewares/validarTokenJWT'
import {SeguidorModel} from '../../models/SeguidorModel'
import {UsuarioModel} from '../../models/UsuarioModels'
import type {RespostaPadraoMsg} from '../../type/RespostaPadraoMsg'
import {politicaCORS} from '../../midllewares/politicaCORS'



const endpointSeguir = async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {
    try{
        if(req.method === 'PUT'){
            const {userId,id} = req?.query
            const usuarioLogado = await UsuarioModel.findById(userId)
            if(!usuarioLogado){
                return res.status(400).json({erro : 'Usuário logado não encontrado'})
            }
            const usuarioaSerSeguido = await UsuarioModel.findById(userId)
            if(!usuarioaSerSeguido){
                return res.status(400).json({erro : 'Usuário a ser seguido não encontrado'})
            }


            const jasigoesseusuario = await SeguidorModel.find({usuarioId : usuarioLogado._id, usuarioSeguidoId : usuarioaSerSeguido._id })
            if(jasigoesseusuario && jasigoesseusuario.length > 0){
                //para deixar de seguir
                jasigoesseusuario.forEach(async(e : any) => await SeguidorModel.findByIdAndDelete({_id : e._id}))
                usuarioLogado.seguindo--
                await UsuarioModel.findByIdAndUpdate({_id : usuarioLogado._id}, usuarioLogado);
                usuarioaSerSeguido.seguidores--;
                await UsuarioModel.findByIdAndUpdate({_id : usuarioaSerSeguido._id}, usuarioaSerSeguido);

                return res.status(200).json({msg : 'Deixou de seguir o usuário com sucesso'});

            }else{
                //para seguir
                const seguidor = {
                    usuarioId:usuarioLogado._id, 
                    usuarioSeguidoId:usuarioaSerSeguido._id
                }
                await SeguidorModel.create(seguidor)

                usuarioLogado.seguindo++
                await UsuarioModel.findByIdAndUpdate({_id: usuarioLogado._id},usuarioLogado)

                usuarioaSerSeguido.seguidores++
                await UsuarioModel.findByIdAndUpdate({_id:usuarioaSerSeguido._id}, usuarioaSerSeguido)




                return res.status(200).json({msg : 'Usuário seguido com sucesso'})
            }
        }
        return res.status(405).json({erro : 'Método informado não existe'})
    }catch(e){
        console.log(e)
        return res.status(500).json({erro : 'Não foi possivel seguir ou deixar de seguir'})
    }
}

export default politicaCORS(validarTokenJWT(conectarMongoDB(endpointSeguir)))