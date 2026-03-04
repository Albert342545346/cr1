const express = require('express');
const cors = require('cors');
const { nanoid } = require('nanoid');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:3001',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

app.use((req, res, next) => {
  res.on('finish', () => {
    const timestamp = new Date().toISOString();
    console.log('[' + timestamp + '][' + req.method + '] ' + res.statusCode + ' ' + req.path);
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
      console.log('Body:', JSON.stringify(req.body));
    }
  });
  next();
});

let products = [
  { id: nanoid(6), name: 'iPhone 15', category: 'Electronics', description: 'Latest iPhone', price: 99990, quantity: 15, rating: 4.8 },
  { id: nanoid(6), name: 'MacBook Pro', category: 'Electronics', description: 'Professional laptop', price: 189990, quantity: 8, rating: 4.9 },
  { id: nanoid(6), name: 'Sony WH-1000XM5', category: 'Audio', description: 'Wireless headphones', price: 34990, quantity: 25, rating: 4.7 },
  { id: nanoid(6), name: 'DeLonghi Coffee', category: 'Appliances', description: 'Coffee machine', price: 45990, quantity: 12, rating: 4.6 },
  { id: nanoid(6), name: 'Xiaomi Mi Band 8', category: 'Electronics', description: 'Fitness tracker', price: 4990, quantity: 50, rating: 4.5 },
  { id: nanoid(6), name: 'PlayStation 5', category: 'Gaming', description: 'Gaming console', price: 54990, quantity: 6, rating: 4.9 },
  { id: nanoid(6), name: 'Canon EOS R6', category: 'Photo', description: 'Mirrorless camera', price: 249990, quantity: 4, rating: 4.8 },
  { id: nanoid(6), name: 'Yandex Station', category: 'Electronics', description: 'Smart speaker', price: 16990, quantity: 30, rating: 4.4 },
  { id: nanoid(6), name: 'iPad Air', category: 'Electronics', description: 'Tablet with M1', price: 64990, quantity: 10, rating: 4.7 },
  { id: nanoid(6), name: 'Kindle', category: 'Electronics', description: 'E-Ink reader', price: 12990, quantity: 20, rating: 4.6 },
  { id: nanoid(6), name: 'ASUS RT-AX86U', category: 'Networking', description: 'Wi-Fi 6 router', price: 19990, quantity: 15, rating: 4.5 },
  { id: nanoid(6), name: 'LG UltraWide', category: 'Electronics', description: '34-inch monitor', price: 54990, quantity: 7, rating: 4.7 }
];

function findProductOr404(id, res) {
  const product = products.find(p => p.id === id);
  if (!product) {
    res.status(404).json({ error: 'Product not found' });
    return null;
  }
  return product;
}

app.get('/api/products', (req, res) => res.json(products));

app.get('/api/products/:id', (req, res) => {
  const product = findProductOr404(req.params.id, res);
  if (!product) return;
  res.json(product);
});

app.post('/api/products', (req, res) => {
  const { name, category, description, price, quantity, rating } = req.body;
  if (!name || !price || !category) return res.status(400).json({ error: 'Required fields missing' });
  const newProduct = {
    id: nanoid(6),
    name: String(name).trim(),
    category: String(category).trim(),
    description: description ? String(description).trim() : '',
    price: Number(price),
    quantity: Number(quantity) || 0,
    rating: Number(rating) || 0
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

app.patch('/api/products/:id', (req, res) => {
  const product = findProductOr404(req.params.id, res);
  if (!product) return;
  const { name, category, description, price, quantity, rating } = req.body;
  if (name !== undefined) product.name = String(name).trim();
  if (category !== undefined) product.category = String(category).trim();
  if (description !== undefined) product.description = String(description).trim();
  if (price !== undefined) product.price = Number(price);
  if (quantity !== undefined) product.quantity = Number(quantity);
  if (rating !== undefined) product.rating = Number(rating);
  res.json(product);
});

app.delete('/api/products/:id', (req, res) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Product not found' });
  products.splice(index, 1);
  res.status(204).send();
});

app.get('/', (req, res) => res.json({ message: 'Store API', endpoints: { products: '/api/products', getProduct: '/api/products/:id' } }));

app.use((req, res) => res.status(404).json({ error: 'Not found' }));
app.use((err, req, res, next) => { console.error('Error:', err); res.status(500).json({ error: 'Internal error' }); });

app.listen(PORT, () => console.log('Server running on http://localhost:' + PORT));