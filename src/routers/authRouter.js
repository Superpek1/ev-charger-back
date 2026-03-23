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

/**
 * @swagger
 * /users/register:
 * post:
 * summary: ลงทะเบียนผู้ใช้งานใหม่
 * tags: [Auth]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * userName: { type: string }
 * userEmail: { type: string }
 * userPhoneNO: { type: string }
 * userPassword: { type: string }
 * responses:
 * 201:
 * description: สำเร็จ
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /users/login:
 * post:
 * summary: ตรวจสอบสิทธิ์เข้าใช้งานและคืนค่าเป็น Access Token
 * tags: [Auth]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * userEmail: { type: string }
 * userPassword: { type: string }
 * responses:
 * 200:
 * description: สำเร็จ (ได้ Token)
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /users/profile:
 * get:
 * summary: ดึงข้อมูลส่วนตัวของผู้ใช้
 * tags: [Profile]
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: สำเร็จ
 */
router.get('/profile', verifyToken, authController.getProfile);

/**
 * @swagger
 * /users/profile:
 * put:
 * summary: แก้ไขข้อมูลส่วนตัว
 * tags: [Profile]
 * security:
 * - bearerAuth: []
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * userName: { type: string }
 * userPhoneNO: { type: string }
 * responses:
 * 200:
 * description: สำเร็จ
 */
router.put('/profile', verifyToken, authController.updateProfile);

/**
 * @swagger
 * /users/change-password:
 * put:
 * summary: เปลี่ยนรหัสผ่าน
 * tags: [Auth]
 * security:
 * - bearerAuth: []
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * oldPassword: { type: string }
 * newPassword: { type: string }
 * responses:
 * 200:
 * description: สำเร็จ
 */
router.put('/change-password', verifyToken, authController.changePassword);

module.exports = router;