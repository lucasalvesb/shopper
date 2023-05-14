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
const upload = multer({ dest: 'uploads/' })

app.post('/uploads', upload.single('file'), (req, res) => {
  const file = req.file

  // check if it is a .csv file
  if (!file.originalname.endsWith('.csv')) {
    res.status(400).send('O arquivo tem que ser CSV')
  } else {
    const fileExtension = path.extname(file.originalname)
    const oldPath = file.path
    const newPath = `${file.path}${fileExtension}`

    fs.rename(oldPath, newPath, (err) => {
      if (err) {
        console.error(err)
        res.status(500).send('Houve um erro ao tentar renomear o arquivo')
      } else {
        console.log('Arquivo renomeado com sucesso')

        // lê e processa o conteúdo

        // checagem das colunas product_code e new_price no arquivo .csv
        let hasProductCode = false
        let hasNewPrice = false

        fs.createReadStream(newPath)
          .pipe(csv())
          .on('data', (data) => {
            const keys = Object.keys(data)
            if (keys.includes('product_code')) {
              hasProductCode = true
            }
            if (keys.includes('new_price')) {
              hasNewPrice = true
            }
          })
          .on('end', () => {
            if (hasProductCode && hasNewPrice) {
              console.log('Arquivo tem as colunas necessárias')
              // validações necessárias
              res.status(200).send('Arquivo foi enviado e validado com sucesso')
            } else {
              console.log('Arquivo não tem contém as colunas necessárias')
              res
                .status(400)
                .send(
                  'O arquivo precisa ter as colunas product_code e new_price'
                )
            }
          })

        // checagem se os códigos de produtos informados existem
        fs.createReadStream(newPath)
          .pipe(csv())
          .on('data', (data) => {
            const productCode = data['product_code']
            const sql = `SELECT * FROM products WHERE code='${productCode}'`

            connection.query(sql, (err, rows) => {
              if (err) {
                console.error(err)
              } else {
                if (rows.length === 0) {
                  console.log(
                    `Produto com código ${productCode} não existe no banco de dados`
                  )
                } else {
                  console.log(
                    `Produto com código ${productCode} existe no banco de dados`
                  )
                }
              }
            })
          })
          .on('end', () => {
            if (hasProductCode && hasNewPrice) {
              console.log('Arquivo tem as colunas necessárias')
            } else {
              console.log('Arquivo nãotem as colunas necessárias')
            }
          })
      }
    })
  }
})



app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
// os códigos de produtos informados existem?

// os preços estão preenchidos e são valores numéricos válidos?

// o arquivo respeita as regras levantadas na seção CENARIO?
//preço de venda não pode ser menor que preço de custo
//impeça qualquer reajuste maior ou menor que 10% do preço do produto
//ao reajustar o preço de um pacote, o mesmo arquivo deve
// conter os reajustes dos preços dos componentes do pacote de modo que o preço final da
//soma dos componentes seja igual ao preço do pacote

/*
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
  })
*/
