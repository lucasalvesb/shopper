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

app.options('*', (req, res) => {
  res.set('Access-Control-Allow-Origin', '*')
  res.set('Access-Control-Allow-Headers', 'Content-Type')
  res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  res.status(200).send()
})

// set up multer middleware
const upload = multer({ dest: 'uploads/' })

app.post('/uploads', upload.single('file'), (req, res) => {
  const file = req.file

  // check if it is a .csv file

  const results = []
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

        // checagem das colunas product_code e new_price no arquivo .csv - também já popula o array results com o new_price

        fs.createReadStream(newPath)
          .pipe(csv())
          .on('data', (data) => {
            const keys = Object.keys(data)
            if (keys.includes('product_code') && keys.includes('new_price')) {
              const productCode = data['product_code']
              const newPrice = data['new_price']
              results.push({ product_code: productCode, new_price: newPrice })
            }
          })
          .on('end', () => {
            console.log(results)
            if (results.length > 0) {
              console.log('Arquivo tem as colunas necessárias')
              // validações necessárias
              res.status(200).json({ results })
            } else {
              console.log('Arquivo não tem contém as colunas necessárias')
              return res
                .status(400)
                .send(
                  'O arquivo precisa ter as colunas product_code e new_price'
                )
            }
          })
        
        //enviar pro bacno de dados
        app.post('/update/', (req, res) => {
          const { product_code, new_price } = req.body

          connection.query(
            `UPDATE products SET sales_price = ? WHERE product_code = ?`,
            [new_price, product_code],
            (error, results) => {
              if (error) {
                console.error(error)
                res.status(500).send('Error updating product')
              } else {
                console.log(
                  `Updated product ${product_code} with sales_price ${new_price}`
                )
                res.status(200).send('Product updated')
              }
            }
          )
        })
        // checagem se os códigos de produtos informados existem
try {
  fs.createReadStream(newPath)
    .pipe(csv())
    .on('data', (data) => {
      const productCode = data['product_code']
      const sql = `SELECT * FROM products WHERE code='${productCode}'`

      connection.query(sql, (err, rows) => {
        if (err) {
          throw err // throw the error here
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
} catch (err) {
  // handle the error here
  console.error(err)
}

        // checagem se os preços estão preenchidos e são valores numéricos válidos
        const csvParser = csv()
        let rowIndex = 0

        fs.createReadStream(newPath)
          .pipe(csvParser)
          .on('data', (row) => {
            rowIndex++
            const newPrice = row['new_price']

            if (typeof newPrice !== 'undefined' && !isNaN(newPrice)) {
              console.log(
                `Linha ${rowIndex} tem um valor numérico válido na coluna new_price.`
              )
            } else {
              console.log(
                `Linha ${rowIndex} não tem um valor numérico válido na coluna new_price.`
              )
            }
          })
        // checagem se o arquivo respeita as regras levantadas na seção CENARIO
        // preço de venda não pode ser menor que preço de custo
        fs.createReadStream(newPath)
          .pipe(csv())
          .on('data', (data) => {
            const productCode = data['product_code']
            const newPrice = parseFloat(data['new_price'])

            const sql = `SELECT cost_price FROM products WHERE code='${productCode}'`
            connection.query(sql, (err, rows) => {
              if (err) {
                console.error(err)
              } else {
                if (rows.length === 0) {
                  console.log(
                    `Produto com código ${productCode} não existe no banco de dados`
                  )
                } else {
                  const costPrice = parseFloat(rows[0].cost_price)
                  if (newPrice < costPrice) {
                    console.log(
                      `O valor de venda do produto com código ${productCode} não pode ser mais barato do que o valor de custo`
                    )
                  }
                }
              }
            })
          })
        // checar se o preço de venda não está mais do que 10% maior ou menor do que o preço atual
        rowIndex = null
        fs.createReadStream(newPath)
          .pipe(csv())
          .on('data', (data) => {
            const productCode = data['product_code']
            const newPrice = parseFloat(data['new_price'])
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
                  const salesPrice = parseFloat(rows[0]['sales_price'])
                  const percentDifference =
                    Math.abs((newPrice - salesPrice) / salesPrice) * 100
                  if (percentDifference > 10) {
                    console.log(
                      `Atenção! Preço do produto com código ${productCode} difere mais de 10% do preço de venda atual`
                    )
                  } else {
                    console.log(
                      `Preço do produto com código ${productCode} está dentro do limite de 10%`
                    )
                  }
                }
              }
            })
            rowIndex++
          })
        // popular um array columns com o code, name e sales_price
        //express
        app.use(express.json())
        app.post('/columns', (req, res) => {
          console.log(req.body)
          const { productCodes } = req.body
          const sql = `SELECT code, name, sales_price FROM products`
          console.log(sql)
          connection.query(sql, (err, rows) => {
            if (err) {
              console.error(err)
              res
                .status(500)
                .json({ message: 'Erro ao obter os dados dos produtos' })
            } else {
              const columns = rows.map((row) => ({
                product_code: row.code,
                name: row.name,
                sales_price: row.sales_price,
              }))
              res.status(200).json({ columns })
            }
          })
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
