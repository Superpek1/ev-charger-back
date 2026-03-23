const express = require('express');
const cors = require('cors');
const authRouter = require('./routers/authRouter');
const carRouter = require('./routers/carRouter');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/users', authRouter);
app.use('/cars', carRouter); 

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'EV Charger Management API',
            version: '1.0.0',
            description: 'ระบบจัดการผู้ใช้และยานพาหนะไฟฟ้า',
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                }
            }
        },
        security: [{
            bearerAuth: []
        }],
        paths: {
            '/users/register': {
                post: {
                    tags: ['Auth'],
                    summary: 'ลงทะเบียนผู้ใช้งานใหม่',
                    requestBody: {
                        required: true,
                        content: { 'application/json': { schema: { type: 'object', properties: { userName: { type: 'string' }, userEmail: { type: 'string' }, userPhoneNO: { type: 'string' }, userPassword: { type: 'string' } } } } }
                    },
                    responses: { '201': { description: 'สำเร็จ' } }
                }
            },
            '/users/login': {
                post: {
                    tags: ['Auth'],
                    summary: 'ตรวจสอบสิทธิ์เข้าใช้งานและคืนค่า Access Token',
                    requestBody: {
                        required: true,
                        content: { 'application/json': { schema: { type: 'object', properties: { userEmail: { type: 'string' }, userPassword: { type: 'string' } } } } }
                    },
                    responses: { '200': { description: 'สำเร็จ' } }
                }
            },
            '/users/profile': {
                get: {
                    tags: ['Profile'],
                    summary: 'ดึงข้อมูลส่วนตัวของผู้ใช้',
                    responses: { '200': { description: 'สำเร็จ' } }
                },
                put: {
                    tags: ['Profile'],
                    summary: 'แก้ไขข้อมูลส่วนตัว',
                    requestBody: {
                        required: true,
                        content: { 'application/json': { schema: { type: 'object', properties: { userName: { type: 'string' }, userPhoneNO: { type: 'string' } } } } }
                    },
                    responses: { '200': { description: 'สำเร็จ' } }
                }
            },
            '/users/change-password': {
                put: {
                    tags: ['Auth'],
                    summary: 'เปลี่ยนรหัสผ่าน',
                    requestBody: {
                        required: true,
                        content: { 'application/json': { schema: { type: 'object', properties: { oldPassword: { type: 'string' }, newPassword: { type: 'string' } } } } }
                    },
                    responses: { '200': { description: 'สำเร็จ' } }
                }
            },
            '/cars/add': {
                post: {
                    tags: ['Vehicles'],
                    summary: 'เพิ่มข้อมูลรถยนต์ไฟฟ้าใหม่',
                    requestBody: {
                        required: true,
                        content: { 'application/json': { schema: { type: 'object', properties: { licensePlate: { type: 'string' }, model: { type: 'string' }, chargerType: { type: 'string' }, batteryCapacity: { type: 'string' } } } } }
                    },
                    responses: { '201': { description: 'สำเร็จ' } }
                }
            },
            '/cars/my-cars': {
                get: {
                    tags: ['Vehicles'],
                    summary: 'ดึงรายการรถยนต์ทั้งหมดของผู้ใช้งาน',
                    responses: { '200': { description: 'สำเร็จ' } }
                }
            },
            '/cars/{id}': {
                delete: {
                    tags: ['Vehicles'],
                    summary: 'ลบข้อมูลรถยนต์ออกจากระบบ',
                    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                    responses: { '200': { description: 'สำเร็จ' } }
                }
            }
        }
    },
    apis: [], 
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});