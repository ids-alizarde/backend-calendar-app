const { response } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../model/User');
const { generateJWT } = require('../helpers/jwt');

const createUser = async ( req, resp = response ) => {

    const { name, email, password } = req.body;

    try {

        let user = await User.findOne({ email });

        if ( user ) {

            return resp.status( 400 ).json({
                ok: false ,
                msg: 'El Usuario ya existe'
            });
        }
        
        user = new User( req.body );

        // Encryptar Contraseña
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync( password, salt );

        await user.save();

        // Generar JWT
        const token = await generateJWT( user.id, user.name );

        resp.status( 201 ).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        });

    } catch (error) {
        
        console.log(error);
        resp.status( 500 ).json({
            ok: false,
            msg: 'Operativa Temporalmente no Disponible'
        });
    }

}

const loginUser = async ( req, resp = response ) => {

    const { email, password } = req.body;

    try {

        const user = await User.findOne({ email });

        if ( !user ) {

            return resp.status( 400 ).json({
                ok: false ,
                msg: 'El Usuario no existe'
            });
        }

        // Confirmar los passwords
        const validPassword = bcrypt.compareSync( password, user.password );

        if ( !validPassword ) {

            return resp.status( 400 ).json({
                ok: false ,
                msg: 'Password no valido'
            });
        }

        // Generar JWT
        const token = await generateJWT( user.id, user.name );

        resp.json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        });
        
    } catch (error) {
        
        console.log(error);
        resp.status( 500 ).json({
            ok: false,
            msg: 'Operativa Temporalmente no Disponible'
        });
    }
}

const renovateToken = async ( req, resp = response ) => {

    const { uid, name } = req;
    
    // Generar JWT
    const token = await generateJWT( uid, name );

    resp.json({
        ok: true,
        uid,
        name,
        token,
    });
}

module.exports = {
    createUser,
    loginUser,
    renovateToken
}