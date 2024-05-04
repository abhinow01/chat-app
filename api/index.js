const express = require('express');
const app = express();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('./models/User')
const bcrypt = require('bcryptjs');

const jwtSecret = 'SecRET';
const bcryptSalt = bcrypt.genSaltSync(10);
// connecting to db 
mongoose.connect('mongodb+srv://tanejavidhata:bEcSgDg39FD2QRlX@cluster0.uqjltqz.mongodb.net/');

app.use(cors({
    credentials: true,
    origin: 'http://127.0.0.1:5173/'
}))

app.get('/test', (req, res) => {
    res.json({ message: 'test ok' });
});


app.post('/register', async (req,res) => {
    const {username,password} = req.body;
    try {
      const hashedPassword = bcrypt.hashSync(password, bcryptSalt);
      const createdUser = await User.create({
        username:username,
        password:hashedPassword,
      });
      jwt.sign({userId:createdUser._id,username}, jwtSecret, {}, (err, token) => {
        if (err) throw err;
        res.cookie('token', token, {sameSite:'none', secure:true}).status(201).json({
          id: createdUser._id,
        });
      });
    } catch(err) {
      if (err) throw err;
      res.status(500).json('error');
    }
  });
  

app.listen(4000, () => {
    console.log('Server is running on port 4000');
});
