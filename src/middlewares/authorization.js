const Logger = require( '../loaders/logger' )
const logger = new Logger( 'Authorization' )

async function authorization( req, res, next ) {
    if ( !req.user ) {
        await logger.warn( 'No user request object', { ...req.info } )
        return res.status( 401 ).send( {
            status : 'error',
            message: 'Unauthorized access'
        } )
    }
    if ( req.user.rol === 'users' || 'admin' ) return next()
    return res.status( 403 ).send( {
        status : 'error',
        message: 'Forbidden access'
    } )
}

module.exports = authorization
