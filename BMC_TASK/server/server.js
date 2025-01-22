const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path'); 


let users = []; 
const products = [
  { id: 1, name: 'Product 1', price: 10.99 },
  { id: 2, name: 'Product 2', price: 19.99 },
  { id: 3, name: 'Product 3', price: 7.99 }
];


const SECRET_KEY = 'bF8s9$gD1pL2kH#7!jK6wQ3l1XpZtVs';

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Register API
app.post('/api/register', (req, res) => {
  const { username, email, password } = req.body;
  
  // Check if user already exists
  const userExists = users.find(user => user.email === email);
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }
  
  // Hash the password and store the new user
  const hashedPassword = bcrypt.hashSync(password, 8);
  const newUser = { username, email, password: hashedPassword };
  users.push(newUser);

  res.status(201).json({ message: 'User registered successfully' });
});

// Login API
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  
  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }
  
  // Check password
  const passwordIsValid = bcrypt.compareSync(password, user.password);
  if (!passwordIsValid) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  
  // Generate JWT token
  const token = jwt.sign({ email: user.email }, SECRET_KEY, { expiresIn: '1h' });
  
  res.status(200).json({ message: 'Login successful', token });
});

// Get Products API (Protected)
app.get('/api/products', (req, res) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    res.status(200).json(products);
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
});

// Serve the login page
app.get('/', (req, res) => {
    const filePath = path.join(__dirname, '../shopping-cart/src/app/login/login.component.html');
    res.sendFile(filePath); 
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
