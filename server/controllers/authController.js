import dotenv from "dotenv";
dotenv.config();

export const adminLogin = (req, res) => {
  const { password } = req.body;

  if (password === process.env.ADMIN_PASSWORD) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, message: "Access Denied" });
  }
};
