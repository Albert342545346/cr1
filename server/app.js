const express = require('express');
const cors = require('cors');
const { nanoid } = require('nanoid');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS настройки
app.use(cors({
  origin: 'http://localhost:3001',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// Логирование запросов
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Начальные данные
let products = [
  { id: nanoid(6), name: 'iPhone 15', category: 'Electronics', description: 'Latest iPhone', price: 99990, quantity: 15, rating: 4.8 },
  { id: nanoid(6), name: 'MacBook Pro', category: 'Electronics', description: 'Professional laptop', price: 189990, quantity: 8, rating: 4.9 },
  { id: nanoid(6), name: 'Sony WH-1000XM5', category: 'Audio', description: 'Wireless headphones', price: 34990, quantity: 25, rating: 4.7 },
  { id: nanoid(6), name: 'DeLonghi Coffee', category: 'Appliances', description: 'Coffee machine', price: 45990, quantity: 12, rating: 4.6 },
  { id: nanoid(6), name: 'Xiaomi Mi Band 8', category: 'Electronics', description: 'Fitness tracker', price: 4990, quantity: 50, rating: 4.5 },
  { id: nanoid(6), name: 'PlayStation 5', category: 'Gaming', description: 'Gaming console', price: 54990, quantity: 6, rating: 4.9 }
];

// === ГЛАВНАЯ СТРАНИЦА (должна быть ПЕРВОЙ) ===
app.get('/', (req, res) => {
  res.json({ 
    message: '🛒 Store API работает!',
    version: '1.0.0',
    endpoints: {
      products: '/api/products',
      getProduct: '/api/products/:id',
      createProduct: 'POST /api/products',
      updateProduct: 'PATCH /api/products/:id',
      deleteProduct: 'DELETE /api/products/:id'
    }
  });
});

// === API ROUTES ===

// GET все товары
app.get('/api/products', (req, res) => {
  res.json(products);
});

// GET один товар по ID
app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Товар не найден' });
  }
  res.json(product);
});

// POST создать новый товар
app.post('/api/products', (req, res) => {
  const { name, category, description, price, quantity, rating } = req.body;
  
  // Валидация
  if (!name || !category || price === undefined) {
    return res.status(400).json({ 
      error: 'Недостаточно данных',
      details: ['Обязательные поля: name, category, price']
    });
  }
  
  if (typeof name !== 'string' || name.trim().length < 2) {
    return res.status(400).json({ error: 'Название должно содержать минимум 2 символа' });
  }
  
  if (typeof category !== 'string' || category.trim().length < 2) {
    return res.status(400).json({ error: 'Категория должна содержать минимум 2 символа' });
  }
  
  if (typeof price !== 'number' || price < 0) {
    return res.status(400).json({ error: 'Цена должна быть неотрицательным числом' });
  }
  
  const newProduct = {
    id: nanoid(6),
    name: String(name).trim(),
    category: String(category).trim(),
    description: description ? String(description).trim() : '',
    price: Number(price),
    quantity: Number(quantity) || 0,
    rating: Number(rating) || 0,
    createdAt: new Date().toISOString()
  };
  
  products.push(newProduct);
  console.log('✅ Создан товар:', newProduct);
  res.status(201).json(newProduct);
});

// PATCH обновить товар
app.patch('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Товар не найден' });
  }
  
  const { name, category, description, price, quantity, rating } = req.body;
  
  if (name !== undefined) {
    if (typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ error: 'Название должно содержать минимум 2 символа' });
    }
    product.name = String(name).trim();
  }
  
  if (category !== undefined) {
    if (typeof category !== 'string' || category.trim().length < 2) {
      return res.status(400).json({ error: 'Категория должна содержать минимум 2 символа' });
    }
    product.category = String(category).trim();
  }
  
  if (description !== undefined) {
    product.description = String(description).trim();
  }
  
  if (price !== undefined) {
    if (typeof price !== 'number' || price < 0) {
      return res.status(400).json({ error: 'Цена должна быть неотрицательным числом' });
    }
    product.price = Number(price);
  }
  
  if (quantity !== undefined) {
    product.quantity = Number(quantity);
  }
  
  if (rating !== undefined) {
    product.rating = Number(rating);
  }
  
  product.updatedAt = new Date().toISOString();
  console.log('✅ Обновлён товар:', product);
  res.json(product);
});

// DELETE удалить товар
app.delete('/api/products/:id', (req, res) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Товар не найден' });
  }
  
  const deleted = products.splice(index, 1)[0];
  console.log('✅ Удалён товар:', deleted);
  res.status(204).send();
});

// === 404 Handler (должен быть ПОСЛЕДНИМ) ===
app.use((req, res) => {
  res.status(404).json({ error: 'Маршрут не найден' });
});

// === Global Error Handler ===
app.use((err, req, res, next) => {
  console.error('❌ Ошибка:', err);
  res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log('\n' + '='.repeat(60));
  console.log('✅ СЕРВЕР ЗАПУЩЕН');
  console.log('📍 Адрес: http://localhost:' + PORT);
  console.log('🔌 API: http://localhost:' + PORT + '/api');
  console.log('📦 Products: http://localhost:' + PORT + '/api/products');
  console.log('='.repeat(60) + '\n');
});

module.exports = app;