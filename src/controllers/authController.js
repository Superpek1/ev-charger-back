const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'YOUR_SECRET_KEY';

// ฟังก์ชันสมัครสมาชิก
exports.register = async (req, res) => {
    try {
        const { 
            userName, userEmail, userPhoneNO, userPassword, 
            idCard, firstName, lastName, dob 
        } = req.body;

        const [existingUser] = await db.query('SELECT * FROM users WHERE userEmail = ?', [userEmail]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: "อีเมลนี้ถูกใช้งานแล้ว" });
        }

        const hashedPassword = await bcrypt.hash(userPassword, 10);
        const [result] = await db.query(
            `INSERT INTO users 
            (userName, userEmail, userPhoneNO, userPassword, idCard, firstName, lastName, dob) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [userName, userEmail, userPhoneNO, hashedPassword, idCard, firstName, lastName, dob]
        );

        res.status(201).json({ message: "ลงทะเบียนสำเร็จ", userId: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "เกิดข้อผิดพลาดในการลงทะเบียน" });
    }
};

//เข้าสู่ระบบ
exports.login = async (req, res) => {
    try {
        const { identifier, userPassword } = req.body;
        const [rows] = await db.query(
            'SELECT * FROM users WHERE userEmail = ? OR userName = ?', 
            [identifier, identifier]
        );
        const user = rows[0];
        if (!user) return res.status(401).json({ message: "ชื่อผู้ใช้ อีเมล หรือรหัสผ่านไม่ถูกต้อง" });
        const isPasswordValid = await bcrypt.compare(userPassword, user.userPassword);
        if (!isPasswordValid) return res.status(401).json({ message: "ชื่อผู้ใช้ อีเมล หรือรหัสผ่านไม่ถูกต้อง" });

        const token = jwt.sign({ userId: user.id, role: 'user' }, SECRET_KEY, { expiresIn: '1h' });

        res.json({ message: "เข้าสู่ระบบสำเร็จ", token: token, role: 'user' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์" });
    }
};

// ฟังก์ชันดึงข้อมูลโปรไฟล์มาแสดง
exports.getProfile = async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT userName, userEmail, userPhoneNO, idCard, firstName, lastName, dob FROM users WHERE id = ?', 
            [req.userId]
        );
        
        if (rows.length === 0) return res.status(404).json({ message: "ไม่พบข้อมูลผู้ใช้" });
        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูล" });
    }
};

//ฟังก์ชันบันทึกข้อมูลโปรไฟล์ใหม่
exports.updateProfile = async (req, res) => {
    try {
        const { idCard, firstName, lastName, dob, phone } = req.body;
        
        await db.query(
            'UPDATE users SET idCard = ?, firstName = ?, lastName = ?, dob = ?, userPhoneNO = ? WHERE id = ?',
            [idCard, firstName, lastName, dob, phone, req.userId]
        );
        
        res.json({ message: "อัปเดตข้อมูลโปรไฟล์เรียบร้อยแล้ว" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "เกิดข้อผิดพลาดในการอัปเดตข้อมูล" });
    }
};

// ฟังก์ชันเปลี่ยนรหัสผ่าน
exports.changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const [rows] = await db.query('SELECT userPassword FROM users WHERE id = ?', [req.userId]);
        if (rows.length === 0) return res.status(404).json({ message: "ไม่พบข้อมูลผู้ใช้" });
        const user = rows[0];

        const isPasswordValid = await bcrypt.compare(oldPassword, user.userPassword);
        if (!isPasswordValid) return res.status(401).json({ message: "รหัสผ่านเดิมไม่ถูกต้อง" });
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await db.query('UPDATE users SET userPassword = ? WHERE id = ?', [hashedNewPassword, req.userId]);

        res.json({ message: "เปลี่ยนรหัสผ่านสำเร็จ" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน" });
    }
};