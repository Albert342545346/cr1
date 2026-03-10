import React from 'react';
import ProductItem from './ProductItem';

export default function ProductList({ products, onEdit, onDelete }) {
  if (!products || products.length === 0) {
    return <div className="empty">Товары не найдены</div>;
  }

  return (
    <div className="product-list">
      {products.map((product) => (
        <ProductItem
          key={product.id}
          product={product}
          onEdit={() => onEdit(product)}
          onDelete={() => onDelete(product.id)}
        />
      ))}
    </div>
  );
}