require( 'dotenv' ).config()
const jwt = require( 'jsonwebtoken' )
const bcrypt = require( 'bcrypt' )
const mongoose = require( 'mongoose' )
const ObjectId = require( 'mongoose' ).Types.ObjectId
const jwtPwd = process.env.JSON_PWD

const userSchema = new mongoose.Schema( {
    name    : {
        first: {
            type     : String,
            min      : 1,
            max      : 255,
            lowercase: true,
            trim     : true,
            required : true
        },
        last : {
            type     : String,
            min      : 1,
            max      : 255,
            lowercase: true,
            trim     : true
        }
    },
    lastname: {
        first: {
            type     : String,
            min      : 1,
            max      : 255,
            lowercase: true,
            trim     : true,
            required : true
        },
        last : {
            type     : String,
            min      : 1,
            max      : 255,
            lowercase: true,
            trim     : true
        }
    },
    email   : {
        type     : String,
        min      : 1,
        max      : 255,
        required : true,
        lowercase: true,
        trim     : true
    },
    password: {
        type    : String,
        min     : 1,
        max     : 255,
        trim    : true,
        required: true
    },
    rol: {
        type    : mongoose.Schema.Types.ObjectId,
        ref     : 'Roles',
        required: true
    }
}, { timestamps: true } )

userSchema.methods.generateJwt = async function () {
    return jwt.sign( {
        _id     : this._id,
        name    : this.name,
        lastname: this.lastname,
        rol     : this.rol.name
    }, jwtPwd, { expiresIn: '3h' } )
}

userSchema.methods.uniqueUserEmail = async ( email, id = 'none' ) => {
    const data = id === 'none' ? await mongoose.model( 'Users', userSchema, 'Users' )
        .find( {
            email
        } )
        .countDocuments() : await mongoose.model( 'Users', userSchema, 'Users' )
        .find( {
            _id: { $ne: ObjectId( id ) },
            email
        } )
        .countDocuments()
    return !data
}

userSchema.pre( 'save', async function ( next ) {
    if ( !this.isModified( 'password' ) ) return next()
    const salt = await bcrypt.genSalt( 10 )
    this.password = await bcrypt.hash( this.password, salt )
    return next()
} )
userSchema.methods.hashPassword = async ( password ) => {
    const salt = await bcrypt.genSalt( 10 )
    return await bcrypt.hash( password, salt )
}
userSchema.methods.comparePasswords = async ( a, b ) => await bcrypt.compare( a, b )
userSchema.methods.getUsers = async ( id, limit = 10, skip = 0 ) => {
    const total = await mongoose.model( 'Users', userSchema, 'Users' )
        .find(
            {
                _id: { $ne: ObjectId( id ) }
            }
        )
        .countDocuments()
    const data = await mongoose.model( 'Users', userSchema, 'Users' )
        .find(
            {
                _id: { $ne: ObjectId( id ) }
            },
            {
                _id: 1, name: 1, lastname: 1, email: 1, rol: 1, createdAt: 1, updatedAt: 1
            }
        )
        .skip( skip )
        .limit( limit )
        .populate( {
            path  : 'rol',
            select: '_id name'
        } )
    const pagination = {
        total, perPage: limit, pages: Math.ceil( total / limit )
    }
    return { pagination, data }
}
userSchema.methods.getUserById = async ( id ) =>
    await mongoose.model( 'Users', userSchema, 'Users' )
        .findOne(
            { _id: ObjectId( id ) },
            {
                password: 0, __v: 0
            }
        )
        .populate( {
            path  : 'rol',
            select: 'name'
        } )
userSchema.methods.updateUserById = async ( id, name, lastname, email, rol ) =>
    await mongoose.model( 'Users', userSchema, 'Users' )
        .updateOne(
            {
                _id: ObjectId( id )
            },
            {
                name, lastname, email, rol: ObjectId( rol )
            }
        )
userSchema.methods.updateUserPasswordByIdUser = async ( id, password ) =>
    await mongoose.model( 'Users', userSchema, 'Users' )
        .updateOne(
            {
                _id: ObjectId( id )
            },
            {
                password
            }
        )
userSchema.methods.updateUserRoleByIdUser = async ( id, rol ) =>
    await mongoose.model( 'Users', userSchema, 'Users' )
        .updateOne(
            {
                _id: ObjectId( id )
            },
            {
                rol: ObjectId( rol )
            }
        )


const Users = mongoose.model( 'Users', userSchema, 'Users' )
module.exports = Users
