const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mindspace');

// Define User schema (same as in the app)
const userSchema = new mongoose.Schema(
        {
                name: {
                        type: String,
                        required: true,
                        trim: true,
                },
                email: {
                        type: String,
                        required: true,
                        unique: true,
                        lowercase: true,
                        trim: true,
                },
                password: {
                        type: String,
                        select: false,
                },
                provider: {
                        type: String,
                        enum: ['email', 'google', 'github'],
                        default: 'email',
                },
                role: {
                        type: String,
                        enum: ['user', 'admin'],
                        default: 'user',
                },
                image: {
                        type: String,
                },
                streakCount: {
                        type: Number,
                        default: 0,
                },
                badges: [
                        {
                                type: String,
                        },
                ],
                lastMoodLog: {
                        type: Date,
                },
        },
        {
                timestamps: true,
        },
);

const User = mongoose.model('User', userSchema);

async function migrateUsers() {
        try {
                console.log('Migrating users to add role field...');

                // Find users without role field
                const usersWithoutRole = await User.find({ role: { $exists: false } });

                console.log(`Found ${usersWithoutRole.length} users without role field`);

                if (usersWithoutRole.length > 0) {
                        // Update all users to have role field
                        const result = await User.updateMany({ role: { $exists: false } }, { $set: { role: 'user' } });

                        console.log(`Updated ${result.modifiedCount} users with role field`);
                } else {
                        console.log('All users already have role field');
                }

                // Verify the migration
                const allUsers = await User.find({});
                console.log(`\nTotal users in database: ${allUsers.length}`);

                allUsers.forEach((user, index) => {
                        console.log(`User ${index + 1}: ${user.email} - Role: ${user.role}`);
                });
        } catch (error) {
                console.error('Error migrating users:', error);
        } finally {
                mongoose.disconnect();
        }
}

migrateUsers();
