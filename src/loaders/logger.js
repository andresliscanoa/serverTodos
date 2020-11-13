require( 'dotenv' ).config()
const winston = require( 'winston' )
require( 'winston-mongodb' )
const dateFormat = () => {
    return new Date().toLocaleString( 'es-CO', {
        weekday     : 'long',
        year        : 'numeric',
        month       : 'long',
        day         : 'numeric',
        hour        : '2-digit',
        minute      : '2-digit',
        second      : '2-digit',
        timeZone    : 'UTC',
        timeZoneName: 'short'
    } )
}

class Logger {
    constructor( route ) {
        this._route = route
        this.logger = winston.createLogger( {
            transports: [
                new winston.transports.Console(),
                new winston.transports.File( {
                    filename: `./logs/${ route }.log`,
                    maxsize : 10000000
                } ),
                process.env.NODE_ENV === 'test' ? new winston.transports.File( {
                    filename: `./logs/test.log`,
                    maxsize : 1000000
                } ) : new winston.transports.MongoDB( {
                    options   : { useUnifiedTopology: true },
                    db        : process.env.URL_DB,
                    collection: 'logs',
                    storeHost : true,
                    format    : winston.format.json(),
                    metaKey   : 'meta',
                    level     : 'error'
                } )
            ],
            format    : winston.format.printf( ( info ) => {
                let message = `| ${ dateFormat() } | ${ info.level.toUpperCase() } | ${ route }.log | ${ info.message } |`
                message = info.meta ? message + ` data:${ JSON.stringify( info.meta ) } | ` : message
                return message
            } )
        } )
    }

    get_route() {
        return this._route
    }

    async info( message, obj ) {
        this.logger.log( { level: 'info', message, meta: { route: this.get_route(), ...obj } } )
    }

    async error( message, obj ) {
        this.logger.log( { level: 'error', message, meta: { route: this.get_route(), ...obj } } )
    }

    async warn( message, obj ) {
        this.logger.log( { level: 'warn', message, meta: { route: this.get_route(), ...obj } } )
    }
}

module.exports = Logger
