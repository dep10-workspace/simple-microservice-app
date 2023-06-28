import express, {json} from 'express'
import cors from 'cors'
import mysql, {Pool} from 'promise-mysql'


let datasource:Pool;
const BASE_URL='/api/v1/books'

const app =express();
const router =express.Router();
initDataSource();

app.use(cors())
app.use(json())

app.listen("8081" ,()=>{console.log("server has started")});
app.use(BASE_URL,router);

router.delete("/:isbn",async (req,res)=>{

    try {
        const result = await datasource.query(" delete from book where isbn=?", [req.params.isbn]);
        if(result.affectedRows==1){
            res.sendStatus(204).send("Sucessfully Deleted");
            return;
        }
        res.sendStatus(400);

    }catch (err:any){
        throw err;
    }
});

router.patch("/:isbn",async (req,res)=>{
     const bookNew = req.body as book;
     console.log(bookNew)
     if(!bookNew.title || !bookNew.isbn){

         res.sendStatus(400);

         return;
     }else{
         try {
             const result = await datasource.query("update book set title=? where isbn=?", [bookNew.title, req.params.isbn]);
             if (result.changedRows === 1) {
                 res.json(bookNew);
             }
             else if(result.affectedRows==1) {
                 res.send("Already updated");
             }else{
                 res.sendStatus(400);

             }
         }catch (err:any){
             console.log("release error")
           throw err;
         }
     }
})

async function initDataSource(){
    datasource =await mysql.createPool({
        host:'localhost',
        port:3306,
        database:'dep10_microservices',
        user:'root',
        password:'root',
        connectionLimit:10
    })
}
type book={
    isbn:string,
    title:string
}
