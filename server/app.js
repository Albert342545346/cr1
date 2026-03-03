const express = require('express');
const app = express();
const port = 3000;

// Middleware для парсинга JSON
app.use(express.json());

// База данных товаров (в памяти)
let products = [
    {id: 1, name: 'Ноутбук', price: 50000},
    {id: 2, name: 'Смартфон', price: 30000},
    {id: 3, name: 'Планшет', price: 20000},
];

// Главная страница
app.get('/', (req, res) => {
    res.send('API для управления товарами');
});

// CREATE - Добавление нового товара
app.post('/products', (req, res) => {
    const { name, price } = req.body;
    
    if (!name || !price) {
        return res.status(400).json({ error: 'Необходимо указать name и price' });
    }
    
    const newProduct = {
        id: Date.now(),
        name,
        price: parseFloat(price)
    };
    
    products.push(newProduct);
    res.status(201).json(newProduct);
});

// READ - Получение всех товаров
app.get('/products', (req, res) => {
    res.json(products);
});

// READ - Получение товара по id
app.get('/products/:id', (req, res) => {
    const product = products.find(p => p.id == req.params.id);
    
    if (!product) {
        return res.status(404).json({ error: 'Товар не найден' });
    }
    
    res.json(product);
});

// UPDATE - Редактирование товара
app.patch('/products/:id', (req, res) => {
    const product = products.find(p => p.id == req.params.id);
    
    if (!product) {
        return res.status(404).json({ error: 'Товар не найден' });
    }
    
    const { name, price } = req.body;
    
    if (name !== undefined) product.name = name;
    if (price !== undefined) product.price = parseFloat(price);
    
    res.json(product);
});

// DELETE - Удаление товара
app.delete('/products/:id', (req, res) => {
    const initialLength = products.length;
    products = products.filter(p => p.id != req.params.id);
    
    if (products.length === initialLength) {
        return res.status(404).json({ error: 'Товар не найден' });
    }
    
    res.json({ message: 'Товар удален' });
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});