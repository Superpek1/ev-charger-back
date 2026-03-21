const express = require('express');
const cors = require('cors');
const authRouter = require('./routers/authRouter');
const carRouter = require('./routers/carRouter');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/users', authRouter);
app.use('/cars', carRouter); 

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});