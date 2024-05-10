const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const { verifyToken } = require('../middlewares/authMiddleware');
const { users } = require('../data/users');
const { secret } = require('../crypto/config');

// Middleware para analizar el cuerpo de la solicitud
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.get('/login', (req, res) => {

  if (req.session.token) {
    // Redirigir al usuario al dashboard si está logueado
    return res.redirect('/dashboard');
}

    const loginForm = `
        <form action="/login" method="post">
            <label for="username">Usuario:</label>
            <input type="text" id="username" name="username" required><br>
            <label for="password">Contraseña:</label>
            <input type="password" id="password" name="password" required><br>
            <button type="submit">Iniciar sesión</button>
        </form>
        <a href="/dashboard">dashboard</a>
    `;
  
    res.send(loginForm);
});

function generateToken(user) {
    return jwt.sign({ user: user.id }, secret, { expiresIn: '1h' }); // Utiliza la clave secreta para firmar el token
}

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(
        (u) => u.username === username && u.password === password
    );
  
    if (user) {
        const token = generateToken(user);
        req.session.token = token;
        res.redirect('/dashboard');
    } else {
        res.status(401).json({ message: 'Credenciales incorrectas' });
    }
});
  
router.get('/dashboard', verifyToken, (req, res) => {
    const userId = req.user;
    const user = users.find((u) => u.id === userId);
    if (user) {
        res.send(`
            <h1>Bienvenido, ${user.name}!</h1>
            <p>ID: ${user.id}</p>
            <p>Usuario: ${user.username}</p>
            <br>
            <form action="/logout" method="post">
                <button type="submit">Cerrar sesión</button>
            </form>
            <a href="/login">home</a>
        `);
    } else {
        res.status(401).json({ message: 'Usuario no encontrado' });
    }
});
  
router.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

module.exports = router; 