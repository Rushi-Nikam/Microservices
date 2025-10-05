const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const User = require("../models/userModel");

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD // Use Gmail App Password
  }
});

// Register
const register = async (req, res) => {
  try {
    const { username, email, mobile, password ,role } = req.body;
    if (!username || !email || !mobile || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ message: "Email already in use" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(20).toString("hex");

    await User.create({
      username,
      email,
      mobile,
      password: hashedPassword,
      role:role||"Customer",
      verificationToken
    });

    const verifyUrl = `http://localhost:5000/api/auth/verify/${verificationToken}`;

      try {
        const info = await transporter.sendMail({
          from: process.env.GMAIL_USER,
          to: email,
          subject: "Verify your email",
          html: `<p>Please click the link below to verify your email:</p>
                 <a href="${verifyUrl}">Verify Email</a>`
        });
        console.log("Email sent:", info.response);
      } catch (emailErr) {
        console.error("Nodemailer error:", emailErr);
        return res.status(500).json({ message: "Email sending failed", error: emailErr.message });
      }

    return res.status(201).json({ message: "Registration successful. Please check your email." });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Verify email
const verifyEmail = async (req, res) => {
  try {
    const token = req.headers['x-verification-token'] || req.query.token || req.params.token;
    if (!token) return res.status(400).json({ message: "Verification token missing" });

    const user = await User.findOne({ where: { verificationToken: token } });
    if (!user) return res.status(400).json({ message: "Invalid token" });

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    return res.send("<h2>Email verified successfully. You can now log in.</h2>");
  } catch (err) {
    console.error("Email verification error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "All fields are required" });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    if (!user.isVerified) return res.status(400).json({ message: "Please verify your email first" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({ message: "Login successful", token, role: user.role });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin protected route
const adminRoute = async (req, res) => {
  if (req.user.role !== "Admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  res.json({ message: "Welcome Admin!" });
};

module.exports = { register, verifyEmail, login, adminRoute };
