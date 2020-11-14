const mongoose = require( 'mongoose' )
const ObjectId = require( 'mongoose' ).Types.ObjectId

const rolSchema = new mongoose.Schema( {
    name  : {
        type     : String,
        min      : 1,
        max      : 255,
        lowercase: true,
        trim     : true,
        required : true
    },
    status: {
        type   : Boolean,
        default: true
    }
}, { timestamps: true } )

rolSchema.methods.getRoles = async () =>
    await mongoose.model( 'Roles', rolSchema, 'Roles' )
        .find(
            {},
            { _id: 1, name: 1, status: 1 }
        )

const Roles = mongoose.model( 'Roles', rolSchema, 'Roles' )
module.exports = Roles
