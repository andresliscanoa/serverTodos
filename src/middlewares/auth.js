require( 'dotenv' ).config()
const jwt = require( 'jsonwebtoken' )
const Logger = require( '../loaders/logger' )
const logger = new Logger( 'auth' )

async function auth( req, res, next ) {
    const token = req.header( 'Authorization' ) ? req.header( 'Authorization' ).split( ' ' )[1] : false
    if ( !token ) {
        logger.warn( 'Acceso no autorizado', { ...req.info } )
        return res.status( 401 ).send( {
            success     : false,
            httpCode    : 401,
            internalCode: '000',
            msg         : 'Acceso no autorizado'
        } )
    }
    try {
        await jwt.verify( token, process.env.JSON_PWD, async ( err, result ) => {
            if ( err ) {
                const { code, message, stack } = err
                await logger.error( 'Error en el servidor', { code, message, stack, ...req.info } )
                return res.status( 401 ).send( {
                    success     : false,
                    httpCode    : 401,
                    internalCode: '000',
                    msg         : 'Acceso no autorizado'
                } )
            }
            req.user = result
            return next()
        } )
    } catch ( err ) {
        const { code, message, stack } = err
        await logger.error( 'Error en el servidor', { code, message, stack, ...req.info } )
        return res.status( 400 ).send( {
            success     : false,
            httpCode    : 400,
            internalCode: code,
            msg         : 'Ops, algo ha salido mal'
        } )
    }
}

module.exports = auth
