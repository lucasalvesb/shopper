*Para rodar o projeto, é necessário ter o mysql 8 instalado e com o banco de dados que foi enviado para nós executado.

*Substituir, em validações.js, os campos de connection com os dados do seu usuário do MySQL (ou crie um com os mesmos dados), assim como com o database name que você criou (ou crie com o mesmo nome que eu):

// create connection to db
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'lucasalves',
  password: 'salves123',
  database: 'shopperdb',
})

*Abrir dois terminais.

*Digite npm -i para instalar as dependências.

*Precisa ter node instalado.

*Em um deles, garanta que está na pasta src, e, então, digite 'node validações.js' para executar o servidor.

*No outro, digite npm run dev e em seguida clique no link que aparecer, por exemplo:

http://127.0.0.1:5173/

*Após isso, fazer o upload do arquivo csv que foi compartilhado conosco.

*Clicar em 'validar'. 

*A tabela deverá ser populada com os dados.
