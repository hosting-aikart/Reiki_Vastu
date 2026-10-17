import bcrypt from 'bcryptjs';
import { connectDB, disconnectDB } from '../src/config/db.js';
import Admin from '../src/models/Admin.js';
import env from '../src/config/env.js';

async function seedAdmin() {
  try {
    console.log('Connecting to database...');
    await connectDB();

    const email = (process.env.INITIAL_ADMIN_EMAIL || 'admin@reikivaastuworld.com').toLowerCase().trim();
    const password = process.env.INITIAL_ADMIN_PASSWORD || 'Admin@RVW#2026';
    const name = process.env.INITIAL_ADMIN_NAME || 'Dr. Naresh Chhabdiya';
    const forceReset = process.argv.includes('--force');

    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin && !forceReset) {
      console.log(`ℹ️  Admin with email "${email}" already exists. Skipping.`);
      console.log('   Use "node scripts/seedAdmin.js --force" if you want to reset their password.');
      return;
    }

    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    if (existingAdmin && forceReset) {
      existingAdmin.passwordHash = passwordHash;
      existingAdmin.name = name;
      existingAdmin.isActive = true;
      await existingAdmin.save();
      console.log(`✅ Admin password successfully updated for "${email}".`);
    } else {
      await Admin.create({
        name,
        email,
        passwordHash,
        role: 'admin',
        isActive: true
      });
      console.log(`✅ Primary administrator account created for "${email}".`);
    }

    console.log('   Default initial email: admin@reikivaastuworld.com');
    console.log('   (Be sure to update your password after first login).');
  } catch (error) {
    console.error('❌ Failed to seed administrator account:', error.message);
    process.exit(1);
  } finally {
    await disconnectDB();
  }
}

seedAdmin();
