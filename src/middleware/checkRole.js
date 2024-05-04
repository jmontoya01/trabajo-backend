function checkRole(role) {
    return function(req, res, next) {
        if (req.isAuthenticated() && req.session.role === role) {
            next();
        } else {
            res.status(403).send('Acceso denegado, no tienes permiso para entrar a esta ruta');
        }
    }
}

module.exports = checkRole;