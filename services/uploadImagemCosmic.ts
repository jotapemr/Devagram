import multer from "multer";
import cosmicjs from 'cosmicjs'
import { write } from "fs";



const {
    CHAVE_GRAVACAO_AVATARES,
CHAVE_GRAVACAO_PULBLICACOES,    //pegou as 4 variáveis de ambiente
BUCKET_AVATARES,
BUCKET_PULBLICACOES, 
} = process.env 

const Cosmic = cosmicjs() //criou a estância do cosmic
const bucketAvatares = Cosmic.bucket({
    slug : BUCKET_AVATARES,
    write_key : CHAVE_GRAVACAO_AVATARES
})
                                            //depois foi criado os dois bucket (bucket de avatar e pulblicação)
const bucketPulblicacoes = Cosmic.bucket({
    slug : BUCKET_PULBLICACOES,
    write_key : CHAVE_GRAVACAO_PULBLICACOES
})
const storage = multer.memoryStorage()
const upload = multer({storage : storage})


const uploadImagemCosmic = async(req : any) => {
    if(req?.file?.originalname){

        if(!req.file.originalname.includes('.png') &&
            !req.file.originalname.includes('.jpg') && 
            !req.file.originalname.includes('.jpeg')){
                throw new Error('Extensao da imagem invalida');
        } 

        const media_object = {
            originalname: req.file.originalname,
            buffer : req.file.buffer
        };


        if(req.url && req.method.includes('pulblicacao')){
            return await bucketPulblicacoes.addMedia({media: media_object})
        }else{
            return await bucketAvatares.addMedia({media : media_object})
        }
    }
}

export {upload, uploadImagemCosmic}