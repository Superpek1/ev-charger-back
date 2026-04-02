const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'YOUR_SECRET_KEY'; 

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.status(403).json({ message: "ไม่มีสิทธิ์เข้าถึง (No Token)" });

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(401).json({ message: "เซสชันหมดอายุ กรุณาล็อกอินใหม่" });
        req.userId = decoded.userId; 
        next();
    });
};

router.post('/register', authController.register);

router.post('/login', authController.login);

router.get('/profile', verifyToken, authController.getProfile);

router.put('/profile', verifyToken, authController.updateProfile);

router.put('/change-password', verifyToken, authController.changePassword);

module.exports = router;