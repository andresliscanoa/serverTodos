require( 'dotenv' ).config()
const express = require( 'express' )
const bodyParser = require( 'body-parser' )
const morgan = require( 'morgan' )
process.env.NODE_ENV = 'test'
process.env.URL_DB = process.env.URL_DB_TEST
process.env.NAME_DB = process.env.NAME_DB_TEST
process.env.SERVER_NAME = process.env.SERVER_NAME_TEST
process.env.JSON_PWD = process.env.JSON_PWD_TEST
const app = express()
app.use( bodyParser.urlencoded( { extended: true } ) )
app.use( bodyParser.json() )
app.use( morgan( 'dev' ) )
app.use( function ( req, res, next ) {
    res.header( 'Access-Control-Allow-Origin', '*' )
    res.header( 'Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE' )
    res.header( 'Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-auth-token' )
    next()
} )
app.set( 'trust proxy', 1 )
require( '../../src/loaders/routes' )( app )
module.exports = app
