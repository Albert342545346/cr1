import React, { useState, useEffect } from 'react';
import '../styles/ShopPage.scss';

export default function ProductModal({ open, mode, initialProduct, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    quantity: '',
    rating: ''
  });

  useEffect(() => {
    if (open && mode === 'edit' && initialProduct) {
      setFormData({
        id: initialProduct.id,
        name: initialProduct.name || '',
        category: initialProduct.category || '',
        description: initialProduct.description || '',
        price: initialProduct.price || '',
        quantity: initialProduct.quantity || '',
        rating: initialProduct.rating || ''
      });
    } else if (open && mode === 'create') {
      setFormData({
        name: '',
        category: '',
        description: '',
        price: '',
        quantity: '',
        rating: ''
      });
    }
  }, [open, mode, initialProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Валидация
    if (!formData.name || !formData.category || !formData.price) {
      alert('Заполните обязательные поля: Название, Категория, Цена');
      return;
    }

    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity) || 0,
      rating: parseFloat(formData.rating) || 0
    };

    onSubmit(payload);
  };

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h2>{mode === 'create' ? 'Добавление товара' : 'Редактирование товара'}</h2>
          <button className="modal__close" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal__form">
          <div className="form-group">
            <label>Название *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Введите название товара"
              required
            />
          </div>

          <div className="form-group">
            <label>Категория *</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Например: Electronics"
              required
            />
          </div>

          <div className="form-group">
            <label>Описание</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Описание товара"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Цена (₽) *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="0"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="form-group">
            <label>Количество на складе</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="0"
              min="0"
            />
          </div>

          <div className="form-group">
            <label>Рейтинг (0-5)</label>
            <input
              type="number"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              placeholder="0"
              min="0"
              max="5"
              step="0.1"
            />
          </div>

          <div className="modal__actions">
            <button type="button" className="btn btn--secondary" onClick={onClose}>
              Отмена
            </button>
            <button type="submit" className="btn btn--primary">
              {mode === 'create' ? 'Добавить' : 'Сохранить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}