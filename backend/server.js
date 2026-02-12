const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./config/database');
const { User } = require('./models');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/employees', require('./routes/employees'));
app.use('/api/materials', require('./routes/materials'));
app.use('/api/borrow', require('./routes/borrow'));
app.use('/api/admin', require('./routes/admin'));

const PORT = process.env.PORT || 5000;

sequelize.sync({ force: false }).then(async () => {
    console.log('Database connected and synced');

    // Create admin user if not exists
    const adminExists = await User.findOne({ where: { username: 'admin' } });
    if (!adminExists) {
        await User.create({
            username: 'admin',
            password: 'admin123',
            role: 'admin',
            is_approved: true
        });
        console.log('Default admin created');
    }

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Database connection failed:', err);
});
