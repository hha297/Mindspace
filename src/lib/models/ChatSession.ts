import mongoose, { type Document, Schema } from 'mongoose';

export interface IMessage {
        id: string;
        content: string;
        role: 'user' | 'assistant';
        timestamp: Date;
}

export interface IChatSession extends Document {
        userId: mongoose.Types.ObjectId;
        title: string;
        lastMessage: string;
        messages: IMessage[];
        createdAt: Date;
        updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>({
        id: {
                type: String,
                required: true,
        },
        content: {
                type: String,
                required: true,
        },
        role: {
                type: String,
                enum: ['user', 'assistant'],
                required: true,
        },
        timestamp: {
                type: Date,
                required: true,
        },
});

const ChatSessionSchema = new Schema<IChatSession>(
        {
                userId: {
                        type: Schema.Types.ObjectId,
                        ref: 'User',
                        required: true,
                },
                title: {
                        type: String,
                        required: true,
                        trim: true,
                        default: 'New Chat',
                },
                lastMessage: {
                        type: String,
                        required: true,
                        trim: true,
                },
                messages: [MessageSchema],
        },
        {
                timestamps: true,
        },
);

// Create indexes for better performance
ChatSessionSchema.index({ userId: 1, createdAt: -1 });
ChatSessionSchema.index({ createdAt: -1 });

export default mongoose.models.ChatSession || mongoose.model<IChatSession>('ChatSession', ChatSessionSchema);
