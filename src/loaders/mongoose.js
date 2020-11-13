require( 'dotenv' ).config()
const mongoose = require( 'mongoose' )
const db_options = {
    useNewUrlParser   : true,
    useUnifiedTopology: true,
    useFindAndModify  : false,
    poolSize          : 50,
    wtimeout          : 2500,
    w                 : 2,
    useCreateIndex    : true
}
module.exports = async ( database ) => {
    await mongoose.connect( process.env.URL_DB, db_options )
}
