import { model, Schema } from 'mongoose';

const sessionSchema = new Schema(
  {
    // userId (через використання Schema.Types.ObjectId) --> посилання на документ з колекції "users" --> тобто поле "userId" зберігатиме значення _id типу ObjectId iз моделі UsersCollection
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'users', // посилання на модель UsersCollection
      required: true,
    },
    accessToken: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
    accessTokenValidUntil: {
      type: Date,
      required: true,
    },
    refreshTokenValidUntil: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const SessionsCollection = model('sessions', sessionSchema);
