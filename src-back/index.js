const express = require('express');
const app = express();
const path = require('path');
const bcrypt = require('bcryptjs');
const hbs = require('hbs');
require('../src-back/expressTodb/connection');
const Register = require('../src-back/models/model');
const port = process.env.PORT || 8000;
const static_path = path.join(__dirname, '../Frontend');
const template_path = path.join(__dirname, '../src-back/templates_path/views');
const partials_path = path.join(
  __dirname,
  '../src-back/templates_path/partials'
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(static_path));
app.set('view engine', 'hbs');
app.set('views', template_path);
hbs.registerPartials(partials_path);

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', async (req, res) => {
  try {
    const password = req.body.password;
    const cpassword = req.body.confirmpassword;
    if (password === cpassword) {
      const userRegistry = new Register({
        name: req.body.name,
        email: req.body.email,
        password: password,
        confirmpassword: cpassword,
        address: req.body.address,
        phone: req.body.phone,
        gender: req.body.gender,
        zip: req.body.zip,
      });

      const token = await userRegistry.generateAuthToken();
      const result = await userRegistry.save();
      res.status(201).render('index');
    } else {
      res.send('password are not matching');
    }
  } catch (err) {
    res.status(400).send(err);
  }
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const loginResult = await Register.findOne({ email: email });
    const isMatch = await bcrypt.compare(password, loginResult.password);
    const token = await loginResult.generateAuthToken();
    if (isMatch) {
      res.status(201).render('index');
    } else {
      res.send('password are not matching');
    }
  } catch (err) {
    res.status(400).send('invalid Email');
  }
});

app.get('*', (req, res) => {
  res.render('404');
});
app.listen(port, () => {
  console.log('Server is running at port @', port);
});
