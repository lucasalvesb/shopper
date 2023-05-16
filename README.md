1 - Para rodar o projeto, é necessário ter o mysql 8 instalado e com o banco de dados que foi enviado para nós executado.

2 - Substituir, em validações.js, os campos de connection com os dados do seu usuário do MySQL (ou crie um com os mesmos dados), assim como com o database name que você criou (ou crie com o mesmo nome que eu):

// create connection to db
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'lucasalves',
  password: 'salves123',
  database: 'shopperdb',
})

3 - Abrir dois terminais.

4 - Digite npm -i para instalar as dependências (é necessário ter node instalado).

5 - Em um deles, navegue até a pasta src (cd shopper, cd src), e, então, digite 'node validações.js' para executar o servidor.

6 - No outro, digite npm run dev e em seguida clique no link que aparecer, por exemplo:

http://127.0.0.1:5173/

7 - Após isso, fazer o upload do arquivo csv que foi compartilhado conosco.

8 - Clicar em 'validar'. 

9 - A tabela deverá ser populada com os dados.

10 - Todos os erros estão validados no backend, basta alterar o csv (por exemplo, botar o nome errado do new_price) e checar o terminal, que haverá um erro disparado para cada um dos casos pedidos.
