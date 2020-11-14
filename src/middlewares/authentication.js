require( 'dotenv' ).config()
const jwt = require( 'jsonwebtoken' )
const Logger = require( '../loaders/logger' )
const logger = new Logger( 'Authentication' )

async function authentication( req, res, next ) {
    const token = req.header( 'Authorization' ) ? req.header( 'Authorization' ).split( ' ' )[1] : false
    if ( !token ) {
        await logger.warn( 'Unauthorized access', { ...req.info } )
        return res.status( 401 ).send( {
            status : 'error',
            message: 'Unauthorized access'
        } )
    }
    try {
        await jwt.verify( token, process.env.JSON_PWD, async ( err, result ) => {
            if ( err ) {
                const { code, message, stack } = err
                await logger.error( 'Ops, something went wrong', { code, message, stack, ...req.info } )
                return res.status( 401 ).send( {
                    status : 'error',
                    message: 'Unauthorized access'
                } )
            }
            req.user = result
            return next()
        } )
    } catch ( err ) {
        const { code, message, stack } = err
        await logger.error( 'Error en el servidor', { code, message, stack, ...req.info } )
        return res.status( 400 ).send( {
            status : 'error',
            message: 'Ops, something went wrong'
        } )
    }
}

module.exports = authentication
