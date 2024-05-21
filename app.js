const express = require('express');
const connectDB = require('./config/db');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');
const handleError  = require('./controllers/errorCOntroller');

dotenv.config();

const app = express();

app.use(bodyParser.json());

connectDB();

app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);


app.use((err, req, res, next) => {
  handleError(err, req, res, next);
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
