require( 'dotenv' ).config()
const swaggerUI = require( 'swagger-ui-express' )
const YAML = require( 'yamljs' )
const index = require( './src/loaders/express' )
const database = require( './src/loaders/mongoose' )
const Logger = require( './src/loaders/logger' )
const logger = new Logger( 'server' )
//Configuramos el puerto segun la variable de entorno
const port = process.env.PORT || 3000
try {
    database().then()
    index.listen( port, () => {
        logger.info( 'Server connnected to MongoDB' )
        logger.info( `Server listening on port: ${ port } in mode ${ process.env.NODE_ENV }` )
    } )
} catch ( err ) {
    const { code, message, stack } = err
    logger.error( 'Error de inicialización de servidor', { code, message, stack } )
}
const swaggerOptions = {
    customSiteTitle: 'API docs',
    customCss      : `.topbar { display: none }
    .swagger-ui { color: white !important }
    .swagger-ui .btn { color: white !important}
    .swagger-ui table thead tr th { color: white !important}
    .swagger-ui .parameter__type { color: white !important}
    .swagger-ui .parameter__in { color: white !important}
    .swagger-ui .response-col_description { color: white !important}
    .swagger-ui table.headers td { color: white !important}
    .swagger-ui .tab li { color: white !important}
    .models { display: none !important } 
    body { background-color: black !important } 
    .scheme-container { background: black !important } 
    .servers-title { color: white} 
    .response-col_links { display: none } 
    .modal-ux { background: black !important } 
    .response-col_status { color: white !important }
    .title { color: white !important } 
    .unlocked { fill: white !important }
    .close-modal { fill: white !important }
    .expand-operation { fill: white !important }
    .btn-done { color: white !important }
    .opblock-tag { color: white !important }
    h3 { color: white !important }
    h4 { color: white !important }
    p { color: white !important }
    small { color: white !important }
    .opblock-summary-path { color: white !important }
    .opblock-summary-description { color: white !important }
    .opblock-section-header {background: hsla(0, 0%, 0%, 0.8) !important}
    .parameter__name { color: white !important }`
}
const swaggerDoc = YAML.load( './src/swagger/index.yaml' )
index.use( '/docs', swaggerUI.serve, swaggerUI.setup( swaggerDoc, swaggerOptions ) )
index.get( '/api/status', ( req, res ) => {
    return res.status( 200 ).send( { status: 'OK' } )
} )
index.get( '/', ( req, res ) => {
    res.redirect( '/docs' )
} )


require( './src/loaders/routes' )( index )
