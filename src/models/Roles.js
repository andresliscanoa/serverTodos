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

rolSchema.methods.uniqueRoleName = async ( name, id = 'none' ) => {
    const data = id === 'none' ? await mongoose.model( 'Roles', rolSchema, 'Roles' )
        .find( {
            name
        } )
        .countDocuments() : await mongoose.model( 'Roles', rolSchema, 'Roles' )
        .find( {
            _id: { $ne: ObjectId( id ) },
            name
        } )
        .countDocuments()
    return !data
}

rolSchema.methods.getRolesByStatus = async ( status ) =>
    await mongoose.model( 'Roles', rolSchema, 'Roles' )
        .find(
            {
                status
            }
        )

rolSchema.methods.updateRolStatus = async ( id, status ) =>
    await mongoose.model( 'Roles', rolSchema, 'Roles' )
        .updateOne(
            {
                _id : ObjectId( id ),
                name: { $ne: 'ADMIN' }
            },
            {
                status
            }
        )

const Roles = mongoose.model( 'Roles', rolSchema, 'Roles' )
module.exports = Roles
