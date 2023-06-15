import express, { Request, Response } from 'express'
import cors from 'cors'
import { accounts } from './database'
import { ACCOUNT_TYPE } from './types'

const app = express()

app.use(express.json())
app.use(cors())

app.listen(3003, () => {
    console.log("Servidor rodando na porta 3003")
})

app.get("/ping", (req: Request, res: Response) => {
    res.send("Pong!")
})

app.get("/accounts", (req: Request, res: Response) => {
    res.send(accounts)
})

app.get("/accounts/:id", (req: Request, res: Response) => {

    try {
        const regexIDID = /^a\d{3}$/
        const id = req.params.id

        if(!regexIDID.test(id)){
            res.status(400)
            throw new Error("Id inválido, o id deve ter a seguinte estrutura: 'a001', 'a123', 'a999'.")
        }

        const result = accounts.find((account) => account.id === id) 

        if(!result){
            res.statusCode = 404
            throw new Error("Conta não encontrada! Verifique o Id.")
        }
    
        res.status(200).send(result)

    } catch (error) {

        if(error instanceof Error){
            res.send(error.message)
        }

        res.status(500).send("Erro desconheicido!")
        
    }
   
})

app.delete("/accounts/:id", (req: Request, res: Response) => {
    try {

        const regexID = /^a\d{3}$/
        const id = req.params.id

        if(!regexID.test(id)){
            res.status(400)
            throw new Error("Id inválido, o id deve ter a seguinte estrutura: 'a001', 'a123', 'a999'.")
        }

        const result = accounts.findIndex((account) => account.id === id) 
        console.log(result)

        if(result < 0){
            res.statusCode = 404
            throw new Error("Conta não encontrada! Verifique o Id.")
        }

        accounts.splice(result, 1)
        
        res.status(200).send("Item deletado com sucesso")

    } catch (error) {

        if(error instanceof Error){
            res.send(error.message)
        }

        res.status(500).send("Erro desconheicido!")
        
    }
    
})

app.put("/accounts/:id", (req: Request, res: Response) => {

    try {

        const regexID = /^a\d{3}$/
        const regexOwnerName = /^.{2,}$/

        const id = req.params.id

        if(!regexID.test(id)){
            res.status(400)
            throw new Error("Id inválido, o id deve ter a seguinte estrutura: 'a001', 'a123', 'a999'.")
        }

        const result = accounts.find((account) => account.id === id) 

        if(!result){
            res.statusCode = 404
            throw new Error("Conta não encontrada! Verifique o Id.")
        }

        const newId = req.body.id
        const newOwnerName = req.body.ownerName
        const newBalance = req.body.balance
        const newType = req.body.type

        if(newId){

            if(typeof(newId) === "string"){

                if(!regexID.test(newId)){
                    res.status(400)
                    throw new Error("O novo id é inválido, o id deve ter a seguinte estrutura: 'a001', 'a123', 'a999'.")
                }
            }else{
                res.status(400)
                throw new Error("O novo id é inválido, ele deve ser do tipo 'string'.")
            }
           
        }else if(newId === 0 || newId === ""){
            throw new Error("O novo id é inválido, o id deve ter a seguinte estrutura: 'a001', 'a123', 'a999'.")
        }

        if(newOwnerName){
            if(typeof(newOwnerName) === "string"){

                if(!regexOwnerName.test(newOwnerName)){
                    res.status(400)
                    throw new Error("A propriedade 'ownerName' deve ter no mínimo 2 caracteres e precisa ser do tipo 'string'.")
                }
            }else{
                res.status(400)
                throw new Error("O novo 'ownerName' é inválido, ele deve ser do tipo 'string'.")
            }
        }else if(newOwnerName === 0 || newOwnerName === ""){
            throw new Error("A propriedade 'ownerName' deve ter no mínimo 2 caracteres e precisa ser do tipo 'string'.")
        }

        if(newBalance !== null && newBalance !== undefined){

            if(typeof(newBalance) !== "number" || newBalance < 0){
                res.status(400)
                throw new Error("O valor do balance deve ser númerico e maior ou igual a 0.")
            }
        }

        if(newType){
            
            if(newType !== ACCOUNT_TYPE.BLACK && newType !== ACCOUNT_TYPE.GOLD && newType !== ACCOUNT_TYPE.PLATINUM){
                throw new Error(`O accout type deve ser um desses itens ${JSON.stringify(ACCOUNT_TYPE).valueOf()}`)
            }
        }
        

        const account = accounts.find((account) => account.id === id) 

        if (account) {
            account.id = newId || account.id
            account.ownerName = newOwnerName || account.ownerName
            account.type = newType || account.type

            account.balance = isNaN(newBalance) ? account.balance : newBalance
        }

        res.status(200).send(account)
        } catch (error) {
        
            if(error instanceof Error){
                res.send(error.message)
            }
    
            res.status(500).send("Erro desconheicido!")
    }
    
})