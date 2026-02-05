import Application from "../models/Application.js";

const parsePagination = (req) => {
  const page = Math.max(parseInt(req.query.page || "1", 10), 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit || "20", 10), 1), 100);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

const buildFilters = (req) => {
  const filters = { user: req.user.id };
  const { status, company, search, from, to } = req.query;

  if (status) filters.status = status;
  if (company) filters.company = new RegExp(company, "i");
  if (search) {
    filters.$or = [
      { company: new RegExp(search, "i") },
      { role: new RegExp(search, "i") }
    ];
  }
  if (from || to) {
    filters.appliedDate = {};
    if (from) filters.appliedDate.$gte = new Date(from);
    if (to) filters.appliedDate.$lte = new Date(to);
  }

  return filters;
};

const allowedStatuses = ["Applied", "Interview", "Offer", "Rejected"];

const isValidDate = (value) => {
  if (!value) return true;
  const date = new Date(value);
  return !Number.isNaN(date.getTime());
};

const validatePayload = (payload) => {
  if (payload.status && !allowedStatuses.includes(payload.status)) {
    return "Invalid status value";
  }
  if (!isValidDate(payload.appliedDate)) return "Invalid applied date";
  if (!isValidDate(payload.nextInterviewDate)) return "Invalid next interview date";
  if (!isValidDate(payload.followUpDate)) return "Invalid follow-up date";
  return null;
};

export const createApplication = async (req, res) => {
  try {
    const { company, role } = req.body;
    if (!company || !role) {
      return res.status(400).json({ message: "Company and role are required" });
    }

    const validationError = validatePayload(req.body);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const application = await Application.create({
      ...req.body,
      user: req.user.id
    });

    return res.status(201).json(application);
  } catch (error) {
    return res.status(500).json({ message: "Failed to create application" });
  }
};

export const getApplications = async (req, res) => {
  try {
    const filters = buildFilters(req);
    const { page, limit, skip } = parsePagination(req);

    const [items, total] = await Promise.all([
      Application.find(filters).sort({ updatedAt: -1 }).skip(skip).limit(limit),
      Application.countDocuments(filters)
    ]);

    return res.json({
      items,
      page,
      totalPages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to load applications" });
  }
};

export const getApplication = async (req, res) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    return res.json(application);
  } catch (error) {
    return res.status(500).json({ message: "Failed to load application" });
  }
};

export const updateApplication = async (req, res) => {
  try {
    const updates = { ...req.body };
    delete updates.user;

    const validationError = validatePayload(updates);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const application = await Application.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      updates,
      { new: true, runValidators: true }
    );

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    return res.json(application);
  } catch (error) {
    return res.status(500).json({ message: "Failed to update application" });
  }
};

export const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    return res.json({ message: "Application deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete application" });
  }
};
