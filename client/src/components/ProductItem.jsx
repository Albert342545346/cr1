import React from 'react';

export default function ProductItem({ product, onEdit, onDelete }) {
  return (
    <div className="product-card">
      <div className="product-card__header">
        <h3 className="product-card__title">{product.name}</h3>
        <span className="product-card__category">{product.category}</span>
      </div>
      
      <p className="product-card__description">{product.description || 'Нет описания'}</p>
      
      <div className="product-card__info">
        <div className="product-card__price">
          <strong>Цена:</strong> {product.price.toLocaleString('ru-RU')} ₽
        </div>
        <div className="product-card__quantity">
          <strong>На складе:</strong> {product.quantity} шт.
        </div>
        <div className="product-card__rating">
          <strong>Рейтинг:</strong> {product.rating}/5
        </div>
      </div>
      
      <div className="product-card__actions">
        <button className="btn btn--secondary" onClick={onEdit}>
            Редактировать
        </button>
        <button className="btn btn--danger" onClick={onDelete}>
          Удалить
        </button>
      </div>
    </div>
  );
}