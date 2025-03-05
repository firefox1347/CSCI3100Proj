import mongoose from "mongoose";
const profileSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  bio: {
    type: String,
    default: null,
  },
  dob: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
    required: true,
  },
});
const Profile = mongoose.model("Profile", profileSchema);

export default Profile;
