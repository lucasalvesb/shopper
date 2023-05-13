//const fs = require('fs')
//const csv = require('csv-parser')
import mysql from 'mysql'

// cria conexão com bd
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'lucasalves',
  password: 'salves123',
  database: 'shopperdb',
})

// abre a conexão
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err)
    return
  }

  console.log('Connected to database!')
})
/*
// caminho do arquivo
const filePath = 'path/to/uploaded/file.csv'

// checar se é .csv
if (!filePath.endsWith('.csv')) {
  console.error('The uploaded file must be a CSV file')
  return
}

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
      conter os reajustes dos preços dos componentes do pacote de modo que o preço final da
      soma dos componentes seja igual ao preço do pacote 



    // inserir os dados processados na database
    const sql = `INSERT INTO my_table (column1, column2, column3) VALUES (preencher1, preencher2, preencher3)`
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
