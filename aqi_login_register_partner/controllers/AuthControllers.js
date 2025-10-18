import Organization from "../models/organizationModel.js";
import GstRecord from "../models/GstRecordModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// ✅ Generate JWT Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// ✅ Register Organization
export const registerOrganization = async (req, res) => {
  try {
    const { organizationName, email, password, gstNumber, mobileNumber } = req.body;

    // 1️⃣ Validate required fields
    if (!organizationName || !email || !password || !gstNumber || !mobileNumber) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 2️⃣ Check GST number in gst_records table
    const gstExists = await GstRecord.findOne({ where: { gst_number: gstNumber } });
    if (!gstExists) {
      return res.status(400).json({ message: "Invalid GST number. Not found in records." });
    }

    // 3️⃣ Check duplicate email
    const existingOrg = await Organization.findOne({ where: { email } });
    if (existingOrg) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // 4️⃣ Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5️⃣ Create organization entry
    const org = await Organization.create({
      organizationName,
      email,
      password: hashedPassword,
      gstNumber,
      mobileNumber, // ✅ Added here
    });

    // 6️⃣ Generate token
    const token = generateToken(org.id, org.role);

    res.status(201).json({
      message: "Organization registered successfully",
      data: {
        id: org.id,
        organizationName: org.organizationName,
        email: org.email,
        mobileNumber: org.mobileNumber,
        gstNumber: org.gstNumber,
        role: org.role,
        token,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ GST Verification
export const verifyGst = async (req, res) => {
  try {
    const { gstNumber } = req.params;
    const gstExists = await GstRecord.findOne({ where: { gst_number: gstNumber } });

    res.json({ valid: !!gstExists }); // true if found, false if not
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Login Organization
export const loginOrganization = async (req, res) => {
  try {
    const { email, password } = req.body;
    const org = await Organization.findOne({ where: { email } });

    if (!org) {
      return res.status(404).json({ message: "Organization not found" });
    }

    // Compare password using bcrypt
    const isMatch = await bcrypt.compare(password, org.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate token
    const token = generateToken(org.id, org.role);

    res.json({
      message: "Login successful",
      token,
      role: org.role,
      data: {
        id: org.id,
        organizationName: org.organizationName,
        email: org.email,
        mobileNumber: org.mobileNumber,
        gstNumber: org.gstNumber,
        role: org.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
