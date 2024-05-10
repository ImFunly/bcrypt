const jwt = require('jsonwebtoken');
const { secret } = require('../crypto/config'); // Importa la clave secreta desde config.js

function verifyToken(req, res, next) {
    const token = req.session.token;
  
    if (!token) {
      return res.status(401).json({ message: 'Token no proporcionado' });
    }
  
    jwt.verify(token, secret, (err, decoded) => { // Utiliza la clave secreta en jwt.verify
      if (err) {
        return res
          .status(401)
          .json({ message: 'Token inválido', error: err.message });
      }
  
      req.user = decoded.user;
      next();
    });
}

module.exports = { verifyToken };