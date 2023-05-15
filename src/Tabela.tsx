import React from 'react'
import './Tabela.css'

type Product = {
  product_code: number
  name: string
  sales_price: number
  new_price: number
}

type Props = {
  products: Product[]
}

const ProductTable: React.FC<Props> = ({ products }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Código</th>
          <th>Nome</th>
          <th>Preço atual</th>
          <th>Novo preço</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr key={product.product_code}>
            <td>{product.product_code}</td>
            <td>{product.name}</td>
            <td>{product.sales_price}</td>
            <td>{product.new_price}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default ProductTable