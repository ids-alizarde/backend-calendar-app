/*
    Rutas de Usuario / Auth
    host + /api/auth
 */

const express = require('express');
const router = express.Router();
const { createUser, loginUser, renovateToken } = require('../controllers/auth');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validateFields');
const { validateJWT } = require('../middlewares/validateJWT');

// router.get('/', ( req, resp ) => {

//     resp.json({
//         ok: true
//     });
// });

router.post( '/register',
    [ //Middlewares
        check( 'name', 'El nombre es obligatorio').notEmpty(),
        check( 'email', 'El email es obligatorio').isEmail(),
        check( 'password', 'La contraseña debe tener entre 6 y 10 caracteres').isLength({ min: 6, max: 10 }),
        validateFields
    ], 
    createUser 
);

router.post( '/', 
    [ //Middlewares
        check( 'email', 'El email es obligatorio').isEmail(),
        check( 'password', 'El campo contraseña es obligatorio').not().isEmpty(),
        check( 'password', 'La contraseña debe tener entre 6 y 10 caracteres').isLength({ min: 6 }),
        validateFields
    ], 
    loginUser 
);

router.get( '/renovate', validateJWT, renovateToken );

module.exports = router;