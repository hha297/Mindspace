import mongoose, { type Document, Schema } from 'mongoose';

export interface IUser extends Document {
        name: string;
        email: string;
        password?: string;
        provider: 'email' | 'google' | 'github';
        image?: string;
        role: 'user' | 'admin';
        streakCount: number;
        badges: string[];
        lastMoodLog?: Date;
        createdAt: Date;
        updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
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
                        select: false, // Don't include password in queries by default
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

// Create indexes for better performance
UserSchema.index({ email: 1 });
UserSchema.index({ provider: 1 });
UserSchema.index({ createdAt: -1 });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
