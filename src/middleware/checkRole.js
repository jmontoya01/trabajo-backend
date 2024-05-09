const passport = require("passport");

function checkRole(allowedRoles) {
    return function (req, res, next) {
        // Verifica si el usuario está autenticado
        if (!passport.authenticate()) {
            return res.status(401).send('User not authenticated');
        }

        // Verifica si el rol del usuario está dentro de los roles permitidos
        const userRole = req.session.user.role;
        if (allowedRoles.includes(userRole)) {
            next();
        } else {
            res.status(403).send('Acceso denegado: no tienes los permisos requeridos');
        }
    };
}

module.exports = checkRole;