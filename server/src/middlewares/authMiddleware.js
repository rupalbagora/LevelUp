import jwt from "jsonwebtoken";

const protect = (req, res, next) => {
  console.log("----- PROTECT -----");
  console.log("URL:", req.originalUrl);
  console.log("cookies:", req.cookies);
  console.log("headers:", req.headers.cookie);
  let token = req.cookies.token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      message: "Not authorized, no token",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded.id;

    next();
  } catch (error) {
    console.error("JWT VERIFY ERROR:", error.message);

    return res.status(401).json({
      message: "Not authorized, invalid token",
    });
  }
};

export default protect;
