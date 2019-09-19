// Requires
var express = require('express');
const fileUpload = require('express-fileupload');
var fs = require('fs');
var app = express();

// default options
app.use(fileUpload());

var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');

// Inicializar variables

// Rutas
app.put('/:tipo/:id', function (req, res) {

    var tipo = req.params.tipo;
    var id = req.params.id;

    // tipos de colecciones
    var tiposValidos = ['hospitales','medicos','usuarios'];
    if( tiposValidos.indexOf(tipo) < 0 ) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de coleccion no es válida',
            errors: { message: 'Debe de seleccionar una imagen' }
        });
    }

    if (!req.files) {
        return res.status(400).json({
            ok:false,
            mensaje:'No seleeciono nada',
            errors: {message: 'Debe de seleccionar una imagen'}
        });
    }
    // Obtener nombre del archivo
    var archivo = req.files.imagen;
    var nombreCortado =  archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length -1];

    // Solo estas extensiones aceptamos

    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if( extensionesValidas.indexOf(extensionArchivo)< 0 ){
        return res.status(400).json({
            ok: false,
            mensaje: 'Extgension no valida',
            errors: { message: 'las extensiones validas son ' + extensionesValidas.join(', ') }
        });
    }

    // Nombre de archivo personalizado 
    var nombreArchivo = `${ id }-${ new Date().getMilliseconds()}.${extensionArchivo}`;

    // Mover el archivo del temporal a un path
    var path = `./uploads/${tipo}/${ nombreArchivo }`;

    archivo.mv(path, (err) => {
        if ( err ) {
            return res.status(500).json({
                ok:false,
                mensaje:'Error al mover el archivo',
                errors: err
            });
        }

        subirPorTipo(tipo, id, nombreArchivo, res);

        // res.status(200).json({
        //     ok: true,
        //     mensaje: 'Archivo movido correctamente',
        //     extensionArchivo
        // });

    });

    
});

function subirPorTipo( tipo, id, nombreArchivo, res ){
    switch (tipo) {
        case 'usuarios':
            Usuario.findById(id, (err, usuario)=> {

                if( !usuario) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Usuario no Existe',
                        errors: { message: 'Usuario no existe' }
                    });
                }

                var pathViejo = './uploads/usuarios/'+usuario.img;
                // Si existe elimina la imagen anterior
                if ( fs.existsSync(pathViejo)){
                    fs.unlinkSync(pathViejo);
                }
                usuario.img = nombreArchivo;

                usuario.save((err, usuarioActualizado) => {
                    usuarioActualizado.password = ':)';
                    return res.status(200).json({
                        ok:true,
                        mensaje: 'Imagen de usuario actualizada',
                        usuario: usuarioActualizado
                    });
                });

            });
            break;
        case 'hospitales':
            Hospital.findById(id, (err, hospital) => {
                if (!hospital) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Hospital no Existe',
                        errors: { message: 'Hospital no existe' }
                    });
                }
                var pathViejo = './uploads/hospitales/' + hospital.img;
                // Si existe elimina la imagen anterior
                if (fs.existsSync(pathViejo)) {
                    fs.unlinkSync(pathViejo);
                }
                hospital.img = nombreArchivo;

                hospital.save((err, hospitalActualizado) => {
                    return res.status(200).json({
                        ok: true,
                        mensaje: 'Imagen de hospital actualizada',
                        hospital: hospitalActualizado
                    });
                });

            });
            break;
        case 'medicos':
            Medico.findById(id, (err, medico) => {
                if (!medico) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Medico no Existe',
                        errors: { message: 'Medico no existe' }
                    });
                }
                var pathViejo = './uploads/medicos/' + medico.img;
                // Si existe elimina la imagen anterior
                if (fs.existsSync(pathViejo)) {
                    fs.unlinkSync(pathViejo);
                }
                medico.img = nombreArchivo;

                medico.save((err, medicoActualizado) => {
                    return res.status(200).json({
                        ok: true,
                        mensaje: 'Imagen de medico actualizada',
                        medico: medicoActualizado
                    });
                });

            });
            break;
        default:
            break;
    }
}


module.exports = app;