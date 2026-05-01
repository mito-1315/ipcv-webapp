require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    const adminExists = await User.findOne({ email: 'admin@test.com' });
    if (adminExists) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    const adminUser = new User({
      name: 'System Admin',
      email: 'admin@test.com',
      password: hashedPassword,
      role: 'admin',
    });

    await adminUser.save();
    console.log('Admin user seeded successfully. Email: admin@test.com | Password: admin123');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
