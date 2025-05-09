import mongoose from 'mongoose';

const UnverifiedUserSchema = new mongoose.Schema({
  password: String,
  dob: Date,
  gender: String,
  email: String,
  username: String,
  verification_token: String,
  verification_token_expires_at: Date,
  created_at: { type: Date, default: Date.now }
});

UnverifiedUserSchema.index(
    { verification_token_expires_at: 1 },
    { expireAfterSeconds: 0 }
  );

const UnverifiedUser = mongoose.model('UnverifiedUser', UnverifiedUserSchema);

export default UnverifiedUser