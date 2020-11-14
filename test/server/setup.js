const { seedDatabase } = require( '../seeds/index' )
const mongoose = require( 'mongoose' )
mongoose.promise = global.Promise

async function removeAllCollections() {
    const collections = Object.keys( mongoose.connection.collections )
    for ( const collectionName of collections ) {
        const collection = mongoose.connection.collections[collectionName]
        await collection.deleteMany()
    }
}

async function dropDatabase() {
    try {
        await mongoose.connection.db.dropDatabase()
    } catch ( err ) {
        console.error( err.stack )
    }
}

module.exports = {
    async setup() {
        // Connect to Mongoose
        beforeAll( async ( done ) => {
            const options = {
                useNewUrlParser   : true,
                useUnifiedTopology: true,
                useFindAndModify  : false,
                poolSize          : 50,
                wtimeout          : 2500,
                w                 : 2,
                useCreateIndex    : true
            }
            await mongoose.connect( process.env.URL_DB_TEST, options )
            await seedDatabase()
            done()
        } )

        // Disconnect Mongoose
        afterAll( async ( done ) => {
            await removeAllCollections()
            await dropDatabase()
            await mongoose.connection.close()
            done()
        } )
    }
}
