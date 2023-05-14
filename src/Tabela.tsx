import React from 'react'
import './Tabela.css'

type Product = {
  product_code: string
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
          <th>Product Code</th>
          <th>Name</th>
          <th>Sales Price</th>
          <th>New Price</th>
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