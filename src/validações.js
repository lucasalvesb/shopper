import fs from 'fs'
import csv from 'csv-parser'
import mysql from 'mysql'
import express from 'express'
import multer from 'multer'
import path from 'path'

const app = express()
const port = 5173

// create connection to db
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'lucasalves',
  password: 'salves123',
  database: 'shopperdb',
})

//cors configs

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})

// set up multer middleware
const upload = multer({dest: 'uploads/'})

app.post('/uploads', upload.single('file'), (req, res) => {
  const file = req.file
  // check if it is a .csv file
  if (!file.originalname.endsWith('.csv')) {
    res.status(400).send('The uploaded file must be a CSV file')
  } else {
    console.log('The uploaded file is a CSV file')
    // perform necessary validations
    res.status(200).send('File uploaded and validated successfully')
  }
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
/*
// lê e processar o conteúdo
fs.createReadStream(filePath)
  .pipe(csv())
  .on('data', (data) => {
    // todos os campos necessários existem?
    
    // os códigos de produtos informados existem?

    // os preços estão preenchidos e são valores numéricos válidos?

    // o arquivo respeita as regras levantadas na seção CENARIO?
    //preço de venda não pode ser menor que preço de custo
    //impeça qualquer reajuste maior ou menor que 10% do preço do produto
    //ao reajustar o preço de um pacote, o mesmo arquivo deve
     // conter os reajustes dos preços dos componentes do pacote de modo que o preço final da
      //soma dos componentes seja igual ao preço do pacote 



    // inserir os dados processados na database
    const sql = `INSERT INTO shopperdb.products (column1, column2, column3) VALUES (preencher1, preencher2, preencher3)`
    const values = [data.field1, data.field2, data.field3]

    connection.query(sql, values, (err, result) => {
      if (err) {
        console.error('Error inserting data into database:', err)
        return
      }

      console.log('Data inserted into database:', result)
    })
  })
  .on('end', () => {
    console.log('CSV file processing complete')
  })*/
