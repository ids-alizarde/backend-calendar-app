const { response } = require('express');
const Event = require('../model/Event')

const getEvents = async ( req, resp = response ) => {

    const events = await Event.find()
                            .populate( 'user', 'name' );

    resp.json({
        ok: true,
        events
    });
}

const createEvent = async ( req, resp = response ) => {

    const event = new Event( req.body );
    
    try {

        event.user = req.uid;

        const eventDB = await event.save();

        resp.json({
            ok: true,
            event: eventDB
        });
        
    } catch (error) {
        
        console.log(error);
        resp.status( 500 ).json({
            ok: false,
            msg: 'Operativa no Disponible'
        });
    }
}

const updateEvent = async ( req, resp = response ) => {

    const eventID = req.params.id;

    try {

        const event = await Event.findById( eventID );

        if ( !event ) {

            return resp.status( 404 ).json({
                ok: true,
                msg: 'El evento no existe'
            });
        }

        if ( event.user.toString() !== req.uid ) {

            return resp.status( 401 ).json({
                ok: true,
                msg: 'No tienes los privilegios suficientes'
            });
        }

        const newEvent = {
            ...req.body,
            user: req.uid
        }

        const updatedEvent = await Event.findByIdAndUpdate( eventID, newEvent, { new: true } );

        resp.json({
            ok: true,
            event: updatedEvent
        });

    } catch (error) {
        
        console.log(error);
        resp.status( 500 ).json({
            ok: true,
            msg: 'Operativa no disponible'
        });
    }
}

const DeleteEvent = async ( req, resp = response ) => {


    const eventID = req.params.id;

    try {

        const event = await Event.findById( eventID );

        if ( !event ) {

            return resp.status( 404 ).json({
                ok: true,
                msg: 'El evento no existe'
            });
        }

        if ( event.user.toString() !== req.uid ) {

            return resp.status( 401 ).json({
                ok: true,
                msg: 'No tienes los privilegios suficientes'
            });
        }
        
        const deletedEvent = await Event.findByIdAndDelete( eventID );

        resp.json({
            ok: true,
            event: deletedEvent
        });

    } catch (error) {
        
        console.log(error);
        resp.status( 500 ).json({
            ok: true,
            msg: 'Operativa no disponible'
        });
    }
}


module.exports = {
    getEvents,
    createEvent,
    updateEvent,
    DeleteEvent
}