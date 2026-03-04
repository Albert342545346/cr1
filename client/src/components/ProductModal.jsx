import React, { useEffect, useState } from 'react';

export default function ProductModal({ open, mode, initialProduct, onClose, onSubmit }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [rating, setRating] = useState('');

  useEffect(() => {
    if (!open) return;
    setName(initialProduct?.name || '');
    setCategory(initialProduct?.category || '');
    setDescription(initialProduct?.description || '');
    setPrice(initialProduct?.price != null ? String(initialProduct.price) : '');
    setQuantity(initialProduct?.quantity != null ? String(initialProduct.quantity) : '');
    setRating(initialProduct?.rating != null ? String(initialProduct.rating) : '');
  }, [open, initialProduct]);

  if (!open) return null;

  const title = mode === "edit" ? "Редактирование товара" : "Добавление товара";

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedCategory = category.trim();
    const parsedPrice = Number(price);
    const parsedQuantity = Number(quantity) || 0;
    const parsedRating = Number(rating) || 0;

    if (!trimmedName) {
      alert("Введите название товара");
      return;
    }
    if (!trimmedCategory) {
      alert("Введите категорию");
      return;
    }
    if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
      alert("Введите корректную цену");
      return;
    }

    onSubmit({
      id: initialProduct?.id,
      name: trimmedName,
      category: trimmedCategory,
      description: description.trim(),
      price: parsedPrice,
      quantity: parsedQuantity,
      rating: parsedRating
    });
  };

  return (
    <div className="backdrop" onMouseDown={onClose}>
      <div className="modal" onMouseDown={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="modal__header">
          <div className="modal__title">{title}</div>
          <button className="iconBtn" onClick={onClose} aria-label="Закрыть">
            ✕
          </button>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          <label className="label">
            Название *
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Например, Смартфон iPhone"
              autoFocus
            />
          </label>

          <label className="label">
            Категория *
            <input
              className="input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Например, Электроника"
            />
          </label>

          <label className="label">
            Описание
            <textarea
              className="input textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Описание товара"
              rows="3"
            />
          </label>

          <label className="label">
            Цена (₽) *
            <input
              className="input"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Например, 99990"
              inputMode="numeric"
              type="number"
              min="0"
            />
          </label>

          <label className="label">
            Количество на складе
            <input
              className="input"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Например, 10"
              inputMode="numeric"
              type="number"
              min="0"
            />
          </label>

          <label className="label">
            Рейтинг (0-5)
            <input
              className="input"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              placeholder="Например, 4.5"
              inputMode="decimal"
              type="number"
              min="0"
              max="5"
              step="0.1"
            />
          </label>

          <div className="modal__footer">
            <button type="button" className="btn" onClick={onClose}>
              Отмена
            </button>
            <button type="submit" className="btn btn--primary">
              {mode === "edit" ? "Сохранить" : "Добавить"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}