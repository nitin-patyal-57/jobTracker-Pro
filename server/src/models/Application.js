import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    email: { type: String, trim: true },
    role: { type: String, trim: true },
    phone: { type: String, trim: true }
  },
  { _id: false }
);

const linkSchema = new mongoose.Schema(
  {
    label: { type: String, trim: true },
    url: { type: String, trim: true }
  },
  { _id: false }
);

const applicationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    company: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["Applied", "Interview", "Offer", "Rejected"],
      default: "Applied"
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium"
    },
    workMode: {
      type: String,
      enum: ["Remote", "Hybrid", "Onsite"],
      default: "Remote"
    },
    source: { type: String, trim: true },
    salaryRange: { type: String, trim: true },
    location: { type: String, trim: true },
    appliedDate: { type: Date },
    nextInterviewDate: { type: Date },
    followUpDate: { type: Date },
    notes: { type: String, trim: true },
    contacts: [contactSchema],
    links: [linkSchema]
  },
  { timestamps: true }
);

export default mongoose.model("Application", applicationSchema);
