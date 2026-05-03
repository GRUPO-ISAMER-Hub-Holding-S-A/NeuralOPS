import jwt from "jsonwebtoken";

export const verificarToken = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ error: "No autorizado" });
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || "secreto123"
        );

        req.user = decoded.user; 
        next();

    } catch (error) {
        return res.status(403).json({ error: "Token inválido" });
    }
};