import jwt from "jsonwebtoken";

export const verificarToken = (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            error: "No autorizado"
        });
    }

    // 👉 sacar Bearer
    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            error: "Token inválido"
        });
    }

    try {

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || "secreto123"
        );

        req.user = decoded.user;

        next();

    } catch (error) {

        return res.status(403).json({
            error: "Sesión expirada"
        });

    }

};