import mongoose, { type Document, Schema } from 'mongoose';

export interface IResource extends Document {
        title: string;
        description: string;
        content: string;
        category: 'anxiety' | 'depression' | 'stress' | 'self-care' | 'academic' | 'relationships' | 'crisis';
        type: 'article' | 'video' | 'audio' | 'exercise' | 'tool' | 'external';
        url?: string;
        isPublished: boolean;
        createdBy: mongoose.Types.ObjectId;
        views: number;
        likes: number;
        createdAt: Date;
        updatedAt: Date;
}

const ResourceSchema = new Schema<IResource>(
        {
                title: {
                        type: String,
                        required: true,
                        trim: true,
                        maxlength: 200,
                },
                description: {
                        type: String,
                        required: true,
                        trim: true,
                        maxlength: 500,
                },
                content: {
                        type: String,
                        required: true,
                },
                category: {
                        type: String,
                        required: true,
                        enum: ['anxiety', 'depression', 'stress', 'self-care', 'academic', 'relationships', 'crisis'],
                },
                type: {
                        type: String,
                        required: true,
                        enum: ['article', 'video', 'audio', 'exercise', 'tool', 'external'],
                },
                url: {
                        type: String,
                        validate: {
                                validator: (v: string) => {
                                        if (!v) return true; // URL is optional
                                        return /^https?:\/\/.+/.test(v);
                                },
                                message: 'URL must be a valid HTTP/HTTPS URL',
                        },
                },
                isPublished: {
                        type: Boolean,
                        default: false,
                },
                createdBy: {
                        type: Schema.Types.ObjectId,
                        ref: 'User',
                        required: true,
                },
                views: {
                        type: Number,
                        default: 0,
                },
                likes: {
                        type: Number,
                        default: 0,
                },
        },
        {
                timestamps: true,
        },
);

// Create indexes for better performance
ResourceSchema.index({ category: 1, isPublished: 1 });
ResourceSchema.index({ type: 1, isPublished: 1 });
ResourceSchema.index({ createdBy: 1 });
ResourceSchema.index({ createdAt: -1 });
ResourceSchema.index({ isPublished: 1, createdAt: -1 });

export default mongoose.models.Resource || mongoose.model<IResource>('Resource', ResourceSchema);
