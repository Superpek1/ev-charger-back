const db = require('../config/db'); 

// ฟังก์ชันเพิ่มรถใหม่
exports.addCar = async (req, res) => {
    try {
        const { name, type, src, licensePlate } = req.body;
        const userId = req.userId; 
        const [existingCar] = await db.query('SELECT * FROM vehicles WHERE licensePlate = ?', [licensePlate]);
        if (existingCar.length > 0) {
            return res.status(400).json({ message: "รถทะเบียนนี้ถูกเพิ่มในระบบแล้ว" });
        }
        await db.query(
            'INSERT INTO vehicles (userId, licensePlate, model, chargerType, src) VALUES (?, ?, ?, ?, ?)',
            [userId, licensePlate, name, type, src]
        );

        res.status(201).json({ message: "เพิ่มรถยนต์สำเร็จ" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "เกิดข้อผิดพลาดในการเพิ่มรถ" });
    }
};

// ฟังก์ชันดึงรายการรถของฉัน
exports.getMyCars = async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT vehicleId AS Id, model AS Name, licensePlate, chargerType AS Type, src FROM vehicles WHERE userId = ?', 
            [req.userId]
        );
        
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูลรถยนต์" });
    }
};

//ฟังก์ชันลบรถออกจากระบบ
exports.deleteCar = async (req, res) => {
    try {
        const vehicleId = req.params.id; 
        const userId = req.userId;
        const [result] = await db.query(
            'DELETE FROM vehicles WHERE vehicleId = ? AND userId = ?', 
            [vehicleId, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "ไม่พบรถยนต์หรือไม่มีสิทธิ์ลบ" });
        }

        res.json({ message: "ลบรถยนต์สำเร็จ" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "เกิดข้อผิดพลาดในการลบรถ" });
    }
};