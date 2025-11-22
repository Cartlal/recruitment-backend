// backend/models/User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
  },
  { timestamps: true } // adds createdAt and updatedAt
);

// Export default so `import User from "./models/User.js"` works
export default mongoose.model("User", UserSchema);
