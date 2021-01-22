const { request, response } = require('express');
const jwt = require('jsonwebtoken');


const validateJWT = ( req = request, resp = response, next ) => {

    // x-token Headers
    const token = req.header( 'x-token' );
    
    if ( !token ) {
        return resp.status( 401 ).json({
            ok: false,
            msg: 'No existe token'
        });
    }

    try {

        const { id, name } = jwt.verify(
            token,
            process.env.SECRET_JWT_SEED
        );

        req.uid = id;
        req.name = name;
            
    } catch (error) {
        
        console.log(error);
        return resp.status( 401 ).json({
            ok: false,
            msg: 'Token ha expirado'
        });
    }

    next();
}

module.exports = {
    validateJWT
}