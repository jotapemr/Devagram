import type { NextApiRequest, NextApiResponse } from 'next'

export default (
    req : NextApiRequest,
    res : NextApiResponse
) => {
    if(req.method === 'POST'){
        const {login, senha} = req.body

        if(login === 'admimadmim@.com' &&
        senha === 1234){
            res.status(200).json({msg: 'Usuário autenticado'})
        }
        return res.status(400).json({erro: 'Usuário ou senha não encontrado'})
    }
    return res.status(405).json({erro: 'Método informado é inválido'})
}