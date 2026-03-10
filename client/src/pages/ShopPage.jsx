import React, { useEffect, useState } from 'react';
import '../styles/ShopPage.scss';
import ProductList from '../components/ProductList';
import ProductModal from '../components/ProductModal';
import { api } from '../api';

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await api.getProducts();
      setProducts(data);
    } catch (err) {
      console.error('Ошибка загрузки:', err);
      alert("Ошибка загрузки товаров: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setModalMode("create");
    setEditingProduct(null);
    setModalOpen(true);
  };

  const openEdit = (product) => {
    setModalMode("edit");
    setEditingProduct(product);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingProduct(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Удалить товар?")) return;

    try {
      await api.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      alert("Товар удалён");
    } catch (err) {
      console.error('Ошибка удаления:', err);
      alert("Ошибка удаления товара: " + (err.response?.data?.error || err.message));
    }
  };

  const handleSubmitModal = async (payload) => {
    try {
      console.log('Отправка данных:', payload);
      
      if (modalMode === "create") {
        const newProduct = await api.createProduct(payload);
        setProducts((prev) => [...prev, newProduct]);
        alert("Товар успешно добавлен!");
      } else {
        const updatedProduct = await api.updateProduct(payload.id, payload);
        setProducts((prev) =>
          prev.map((p) => (p.id === payload.id ? updatedProduct : p))
        );
        alert("Товар успешно обновлён!");
      }
      closeModal();
    } catch (err) {
      console.error('Ошибка сохранения:', err);
      const errorMsg = err.response?.data?.error || 
                      err.response?.data?.details?.join(', ') || 
                      err.message || 
                      "Неизвестная ошибка";
      alert("Ошибка сохранения товара: " + errorMsg);
    }
  };

  return (
    <div className="page">
      <header className="header">
        <div className="header__inner">
          <div className="brand">🛒 Интернет-магазин</div>
          <div className="header__right">React + Express</div>
        </div>
      </header>

      <main className="main">
        <div className="container">
          <div className="toolbar">
            <h1 className="title">Каталог товаров</h1>
            <button className="btn btn--primary" onClick={openCreate}>
              + Добавить товар
            </button>
          </div>

          {loading ? (
            <div className="empty">Загрузка...</div>
          ) : products.length === 0 ? (
            <div className="empty">
              <p>Товары не найдены</p>
              <button className="btn btn--primary" onClick={openCreate}>
                Добавить первый товар
              </button>
            </div>
          ) : (
            <ProductList 
              products={products} 
              onEdit={openEdit} 
              onDelete={handleDelete} 
            />
          )}
        </div>
      </main>

      <footer className="footer">
        <div className="footer__inner">
          © {new Date().getFullYear()} Интернет-магазин. Практическая работа
        </div>
      </footer>

      <ProductModal
        open={modalOpen}
        mode={modalMode}
        initialProduct={editingProduct}
        onClose={closeModal}
        onSubmit={handleSubmitModal}
      />
    </div>
  );
}