/*
    Event Routes / Events
    host + /api/events
 */

const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { getEvents, createEvent, updateEvent, DeleteEvent } = require('../controllers/events');
const { validateJWT } = require('../middlewares/validateJWT');
const { validateFields } = require('../middlewares/validateFields');
const { isDate } = require('../helpers/isDate');


// Todas las peticiones tienen que pasar por la validacion del JWT
router.use( validateJWT );

// Obtener eventos
router.get( '/', getEvents );

// Crear un nuevo evento
router.post( '/', 
    [
        check( 'title', 'El titulo es obligatorio' ).notEmpty(),
        check( 'start', 'La fecha inicial es requerida' ).custom( isDate ),
        check( 'end', 'La fecha de termino es requerida' ).custom( isDate ),
        validateFields

    ], createEvent );

// Actualizar evento
router.put( '/:id', updateEvent );

// Borrar evento
router.delete( '/:id', DeleteEvent );

module.exports = router;