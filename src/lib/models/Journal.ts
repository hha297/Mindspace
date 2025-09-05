import mongoose, { type Document, Schema } from 'mongoose';

export interface IJournal extends Document {
        userId: string;
        content: string;
        prompt?: string;
        category: 'reflection' | 'gratitude' | 'goals' | 'emotions' | 'free-write';
        mood?: number; // 1-5 scale
        tags?: string[];
        isPrivate: boolean;

        createdAt: Date;
        updatedAt: Date;
}

const JournalSchema = new Schema<IJournal>(
        {
                userId: {
                        type: String,
                        required: true,
                        trim: true,
                },
                content: {
                        type: String,
                        required: true,
                        trim: true,
                        maxlength: 10000,
                },
                prompt: {
                        type: String,
                        trim: true,
                        maxlength: 500,
                },
                category: {
                        type: String,
                        required: true,
                        enum: ['reflection', 'gratitude', 'goals', 'emotions', 'free-write'],
                        default: 'free-write',
                },
                mood: {
                        type: Number,
                        min: 1,
                        max: 5,
                },
                tags: [
                        {
                                type: String,
                                trim: true,
                        },
                ],
                isPrivate: {
                        type: Boolean,
                        default: true,
                },
        },
        {
                timestamps: true,
        },
);

// Create indexes for better performance
JournalSchema.index({ userId: 1, createdAt: -1 });
JournalSchema.index({ category: 1 });
JournalSchema.index({ createdAt: -1 });
JournalSchema.index({ isPrivate: 1 });

export default mongoose.models.Journal || mongoose.model<IJournal>('Journal', JournalSchema);
