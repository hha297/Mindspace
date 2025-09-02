import mongoose, { type Document, Schema } from 'mongoose';

export interface IMoodLog extends Document {
        userId: mongoose.Types.ObjectId;
        mood: 1 | 2 | 3 | 4 | 5;
        moodLabel: 'very-sad' | 'sad' | 'neutral' | 'happy' | 'very-happy';
        notes?: string;
        tags: string[];
        createdAt: Date;
        updatedAt: Date;
}

const MoodLogSchema = new Schema<IMoodLog>(
        {
                userId: {
                        type: Schema.Types.ObjectId,
                        ref: 'User',
                        required: true,
                },
                mood: {
                        type: Number,
                        required: true,
                        min: 1,
                        max: 5,
                },
                moodLabel: {
                        type: String,
                        required: true,
                        enum: ['very-sad', 'sad', 'neutral', 'happy', 'very-happy'],
                },
                notes: {
                        type: String,
                        maxlength: 500,
                },
                tags: [
                        {
                                type: String,
                                trim: true,
                        },
                ],
        },
        {
                timestamps: true,
        },
);

// Create indexes for better performance
MoodLogSchema.index({ userId: 1, createdAt: -1 });
MoodLogSchema.index({ mood: 1 });
MoodLogSchema.index({ createdAt: -1 });

export default mongoose.models.MoodLog || mongoose.model<IMoodLog>('MoodLog', MoodLogSchema);
