import mongoose from 'mongoose';

const stressAssessmentSchema = new mongoose.Schema(
        {
                userId: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'User',
                        required: true,
                },
                score: {
                        type: Number,
                        required: true,
                        min: 0,
                        max: 50,
                },
                level: {
                        type: String,
                        enum: ['Low Stress', 'Moderate Stress', 'High Stress'],
                        required: true,
                },
                questions: [
                        {
                                questionId: String,
                                question: String,
                                answer: Number,
                                options: [
                                        {
                                                value: Number,
                                                label: String,
                                        },
                                ],
                        },
                ],
                completedAt: {
                        type: Date,
                        default: Date.now,
                },
        },
        {
                timestamps: true,
        },
);

// Index for efficient queries
stressAssessmentSchema.index({ userId: 1, completedAt: -1 });
stressAssessmentSchema.index({ level: 1 });
stressAssessmentSchema.index({ completedAt: -1 });

export const StressAssessment =
        mongoose.models.StressAssessment || mongoose.model('StressAssessment', stressAssessmentSchema);
