var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

// ========================================
// Verificar toke
// ========================================
exports.verificaToken = function(req,res,next) {

    var token = rea.query.token;
    jwt.verify(token, SEED, (err, deocded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'token incorrecto',
                errors: err
            });
        }

        req.usuario = deocde.usuario;
        next();
        // res.status(200).json({
        //     ok:true,
        //     deocded
        // });

    });
}

