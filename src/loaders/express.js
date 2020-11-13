require( 'dotenv' ).config()
const express = require( 'express' )
const cors = require( 'cors' )
const requestIp = require( 'request-ip' )
const bodyParser = require( 'body-parser' )
const { v4: uuidv4 } = require( 'uuid' )
const rateLimit = require( 'express-rate-limit' )
const helmet = require( 'helmet' )
const morgan = require( 'morgan' )
const Logger = require( './logger' )
const logger = new Logger( 'server' )

const app = express()
app.use( bodyParser.urlencoded( { extended: true } ) )
app.use( bodyParser.json() )
app.use( helmet() )
app.use( function ( req, res, next ) {
    req.info = {
        id: uuidv4(),
        ip: requestIp.getClientIp( req ).split( ':' )[3]
    }
    next()
} )
const whitelist = [ process.env.SERVER_NAME, 'http://localhost:3000', 'http://devbatchrecord.us-east-1.elasticbeanstalk.com', 'https://devbatchrecord.us-east-1.elasticbeanstalk.com', /elasticbeanstalk\.com$/ ]
let corsOptions = {
    origin: function ( origin, callback ) {
        if ( whitelist.indexOf( origin ) !== -1 || !origin ) {
            callback( null, true )
        } else {
            logger.warn( `Origin not allow ${ origin }` )
            callback( new Error( 'Not allowed by CORS' ) )
        }
    }
}
app.use( function ( req, res, next ) {
    res.header( 'Access-Control-Allow-Origin', '*' )
    res.header( 'Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE' )
    res.header( 'Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-auth-token, Authorization' )
    next()
} )
app.set( 'trust proxy', 1 )
const apiLimiter = rateLimit( {
    windowMs: 60 * 1000, //Abrimos una ventana de un minuto
    max     : 25, // Limitamos a 50 peticiones a las API
    message : 'Demasiadas peticiones desde esta misma IP',
    handler : function ( req, res ) {
        const fs = require( 'fs' )
        const text = requestIp.getClientIp( req ).split( ':' )[3]
        fs.appendFile( './files/ipBlackList.txt', '"' + text + '", ', 'utf-8', ( err ) => {
            if ( err ) return null
        } )
        logger.warn( `La IP ${ text } ha sido bloqueada` )
        return res.status( 429 ).send( {
            success     : false,
            httpCode    : 429,
            internalCode: '000',
            msg         : 'La IP ha sido bloqueada por exceder el máximo de peticiones, intenta nuevamente en una hora'
        } )
    }
} )
app.use( apiLimiter )
app.use( cors( corsOptions ) )
app.use( morgan( process.env.NODE_ENV === 'development' ? 'dev' : 'short' ) )

module.exports = app
