import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    resumeUrl: { type: String },
    headline: { type: String, trim: true },
    dailyFocus: [{ type: String, trim: true }],
    preferences: {
      workModeDefault: { type: String, trim: true },
      targetSalary: { type: String, trim: true },
      notifications: {
        weeklyDigest: { type: Boolean, default: true },
        interviewReminders: { type: Boolean, default: true },
        applicationReminders: { type: Boolean, default: true }
      },
      privacy: {
        publicProfile: { type: Boolean, default: false },
        monthlyExport: { type: Boolean, default: false }
      }
    },
    resetTokenHash: { type: String },
    resetTokenExpires: { type: Date }
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);
