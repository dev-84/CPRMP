
require('dotenv').config({
  path: require('path').resolve(__dirname, '../.env'),
});

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const prompt = require('prompt-sync')({ sigint: true });
const User = require('../src/models/User');

const SALT_ROUNDS = 12;

async function main() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is missing from backend/.env');
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully.');

    const name = prompt('Admin name: ').trim();
    const email = prompt('Admin email: ').trim().toLowerCase();

    if (!name) {
      throw new Error('Admin name is required.');
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error('Enter a valid email address.');
    }

    const existingUser = await User.findOne({ email }).lean();

    if (existingUser) {
      throw new Error(
        'An account with this email already exists. No changes were made.'
      );
    }

    const password = prompt.hide('Admin password (hidden): ');
    const confirmation = prompt.hide('Confirm admin password: ');

    if (password.length < 12) {
      throw new Error('Use a password with at least 12 characters.');
    }

    if (password !== confirmation) {
      throw new Error('Passwords do not match.');
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    await User.create({
      name,
      email,
      passwordHash,
      role: 'admin',
      isActive: true,
    });

    console.log(`Admin account created successfully for ${email}.`);
  } finally {
    await mongoose.disconnect().catch(() => {});
  }
}

main().catch((error) => {
  console.error(`Admin setup failed: ${error.message}`);
  process.exitCode = 1;
});
