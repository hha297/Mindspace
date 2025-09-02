import mongoose, { type Document, Schema } from 'mongoose';

export interface IResource extends Document {
        title: string;
        description: string;
        category: string;
        type: 'article' | 'video' | 'exercise' | 'meditation' | 'tool';
        duration: number; // in minutes
        url?: string;
        content?: string;
        tags: string[];
        featured: boolean;

        createdAt: Date;
        updatedAt: Date;
}

const ResourceSchema = new Schema<IResource>(
        {
                title: {
                        type: String,
                        required: true,
                        trim: true,
                },
                description: {
                        type: String,
                        required: true,
                        trim: true,
                        maxlength: 1000,
                },
                category: {
                        type: String,
                        required: true,
                        enum: [
                                'Stress Management',
                                'Anxiety Support',
                                'Depression Help',
                                'Self-Care',
                                'Academic Pressure',
                                'Relationships',
                        ],
                },
                type: {
                        type: String,
                        required: true,
                        enum: ['article', 'video', 'exercise', 'meditation', 'tool'],
                },
                duration: {
                        type: Number,
                        default: 5,
                        min: 1,
                },
                url: {
                        type: String,
                        trim: true,
                },
                content: {
                        type: String,
                        trim: true,
                        maxlength: 10000,
                },
                tags: [
                        {
                                type: String,
                                trim: true,
                        },
                ],
                featured: {
                        type: Boolean,
                        default: false,
                },
        },
        {
                timestamps: true,
        },
);

// Create indexes for better performance
ResourceSchema.index({ category: 1 });
ResourceSchema.index({ featured: 1 });
ResourceSchema.index({ type: 1 });
ResourceSchema.index({ createdAt: -1 });

export default mongoose.models.Resource || mongoose.model<IResource>('Resource', ResourceSchema);
