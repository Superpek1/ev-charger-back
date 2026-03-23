const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');
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
 * /cars/add:
 * post:
 * summary: เพิ่มข้อมูลรถยนต์ไฟฟ้าใหม่
 * tags: [Vehicles]
 * security: [{ bearerAuth: [] }]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * licensePlate: { type: string }
 * model: { type: string }
 * chargerType: { type: string }
 * batteryCapacity: { type: string }
 * responses:
 * 201: { description: เพิ่มรถสำเร็จ }
 */
router.post('/add', verifyToken, carController.addCar);

/**
 * @swagger
 * /cars/my-cars:
 * get:
 * summary: ดึงรายการรถยนต์ทั้งหมดของผู้ใช้งาน
 * tags: [Vehicles]
 * security: [{ bearerAuth: [] }]
 * responses:
 * 200: { description: ดึงข้อมูลสำเร็จ }
 */
router.get('/my-cars', verifyToken, carController.getMyCars);

/**
 * @swagger
 * /cars/{id}:
 * delete:
 * summary: ลบข้อมูลรถยนต์ออกจากระบบ
 * tags: [Vehicles]
 * security: [{ bearerAuth: [] }]
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema: { type: string }
 * responses:
 * 200: { description: ลบรถสำเร็จ }
 */
router.delete('/:id', verifyToken, carController.deleteCar);

module.exports = router;