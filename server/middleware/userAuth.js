const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
    try {
        let token;

        // ✅ Check for token in Authorization header
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }
        // ✅ Check for token in cookies (fallback)
        else if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }

        // ❌ No token found
        if (!token) {
            return res.status(401).json({ success: false, message: "Not Authorized, login again" });
        }

        // ✅ Verify token
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ success: false, message: "Session expired, login again" });
            }
            req.body.userId = decoded.id;
            next();
        });

    } catch (error) {
        res.status(401).json({ success: false, message: "Invalid Token, login again" });
    }
};

module.exports = userAuth;
