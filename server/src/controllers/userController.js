import User from "../models/User.js";

const pick = (obj, keys) =>
  keys.reduce((acc, key) => {
    if (obj[key] !== undefined) acc[key] = obj[key];
    return acc;
  }, {});

export const updateMe = async (req, res) => {
  try {
    const allowed = ["name", "email", "headline", "dailyFocus", "preferences"];
    const updates = pick(req.body, allowed);

    if (updates.email) {
      const exists = await User.findOne({ email: updates.email, _id: { $ne: req.user.id } });
      if (exists) {
        return res.status(409).json({ message: "Email already in use" });
      }
    }

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true
    }).select("-password");

    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: "Failed to update profile" });
  }
};
