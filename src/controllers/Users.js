const { validationResult } = require( 'express-validator' )
const Logger = require( '../loaders/logger' )
const logger = new Logger( 'Users' )
const Users = require( '../models/Users' )
const user = new Users()
const usersController = {}

usersController.uniqueUsersEmails = async ( req, res ) => {
    const errors = validationResult( req )
    if ( !errors.isEmpty() ) {
        const e = errors.array().map( e => {
            return {
                message: e.msg,
                param  : e.param
            }
        } )
        await logger.warn( 'Data integrity error', { ...e, ...req.info, user: req.user.email } )
        return res.status( 400 ).send( {
            status  : 'error',
            message : 'Data integrity error',
            response: { e, ...req.info }
        } )
    }
    try {
        const { value } = req.query
        const id = req.query.id || 'none'
        const message = await user.uniqueUserEmail( value, id ) ? 'Available value' : 'Duplicate value'
        return res.status( 200 ).send( {
            status: 'success',
            message
        } )
    } catch ( err ) {
        const { code, message, stack } = err
        await logger.error( 'Ops, something went wrong', { code, message, stack, ...req.info, user: req.user.email } )
        return res.status( 400 ).send( {
            status  : 'error',
            message : 'Ops, something went wrong',
            response: { message, ...req.info }
        } )
    }
}
usersController.listAllUsers = async ( req, res ) => {
    const errors = validationResult( req )
    if ( !errors.isEmpty() ) {
        const e = errors.array().map( e => {
            return {
                message: e.msg,
                param  : e.param
            }
        } )
        await logger.warn( 'Data integrity error', { ...e, ...req.info, user: req.user.email } )
        return res.status( 400 ).send( {
            status  : 'error',
            message : 'Data integrity error',
            response: { e, ...req.info }
        } )
    }
    try {
        const id = req.user._id
        const { items, page } = req.query
        const limit = parseInt( items )
        const skip = (parseInt( page ) - 1) * parseInt( items )
        const { pagination, data } = await user.getUsers( id, limit, skip )
        return res.status( 200 ).send( {
            status  : 'success',
            message : 'Users list',
            response: { pagination, data }
        } )
    } catch ( err ) {
        const { code, message, stack } = err
        await logger.error( 'Ops, something went wrong', { code, message, stack, ...req.info, user: req.user.email } )
        return res.status( 400 ).send( {
            status  : 'error',
            message : 'Ops, something went wrong',
            response: { message, ...req.info }
        } )
    }
}
usersController.findUserById = async ( req, res ) => {
    const errors = validationResult( req )
    if ( !errors.isEmpty() ) {
        const e = errors.array().map( e => {
            return {
                message: e.msg,
                param  : e.param
            }
        } )
        await logger.warn( 'Data integrity error', { ...e, ...req.info, user: req.user.email } )
        return res.status( 400 ).send( {
            status  : 'error',
            message : 'Data integrity error',
            response: { e, ...req.info }
        } )
    }
    try {
        const { id } = req.params
        const response = await user.getUserById( id )
        return res.status( 200 ).send( {
            status : 'success',
            message: 'User',
            response
        } )
    } catch ( err ) {
        const { code, message, stack } = err
        await logger.error( 'Ops, something went wrong', { code, message, stack, ...req.info, user: req.user.email } )
        return res.status( 400 ).send( {
            status  : 'error',
            message : 'Ops, something went wrong',
            response: { message, ...req.info }
        } )
    }
}
usersController.createUser = async ( req, res ) => {
    const errors = validationResult( req )
    if ( !errors.isEmpty() ) {
        const e = errors.array().map( e => {
            return {
                message: e.msg,
                param  : e.param
            }
        } )
        await logger.warn( 'Data integrity error', { ...e, ...req.info, user: req.user.email } )
        return res.status( 400 ).send( {
            status  : 'error',
            message : 'Data integrity error',
            response: { e, ...req.info }
        } )
    }
    try {
        const { name, lastname, email, password, rol } = req.body
        await new Users( { name, lastname, email, password, rol } ).save()
        return res.status( 200 ).send( {
            status : 'success',
            message: 'User created successfully'
        } )
    } catch ( err ) {
        const { code, message, stack } = err
        await logger.error( 'Ops, something went wrong', { code, message, stack, ...req.info, user: req.user.email } )
        return res.status( 400 ).send( {
            status  : 'error',
            message : 'Ops, something went wrong',
            response: { message, ...req.info }
        } )
    }
}
usersController.singIn = async ( req, res ) => {
    const errors = validationResult( req )
    if ( !errors.isEmpty() ) {
        const e = errors.array().map( e => {
            return {
                message: e.msg,
                param  : e.param
            }
        } )
        await logger.warn( 'Data integrity error', { ...e, ...req.info, user: req.body.email } )
        return res.status( 400 ).send( {
            status  : 'error',
            message : 'Data integrity error',
            response: { e, ...req.info }
        } )
    }
    try {
        const { email, password } = req.body
        const userFound = await Users.findOne(
            {
                email
            },
            {
                createdAt: 0,
                updatedAt: 0,
                __v: 0
            }
        )
            .populate( {
                path  : 'rol',
                select: 'name'
            } )
        const match = await user.comparePasswords( password, userFound.password )
        if ( match ) {
            const token = await userFound.generateJwt()
            const user = {
                name    : userFound.name,
                lastname: userFound.lastname,
                email   : userFound.email,
                rol     : userFound.rol
            }
            return res.header( 'Authorization', `Bearer ${ token }` ).status( 200 ).send( {
                status  : 'success',
                message : 'User authorized',
                response: {
                    user,
                    token: `Bearer ${ token }`
                }
            } )
        }
        return res.status( 400 ).send( {
            status : 'error',
            message: 'The credentials are not correct'
        } )
    } catch ( err ) {
        const { code, message, stack } = err
        await logger.error( 'Ops, something went wrong', { code, message, stack, ...req.info, user: req.body.email } )
        return res.status( 400 ).send( {
            status  : 'error',
            message : 'Ops, something went wrong',
            response: { message, ...req.info }
        } )
    }
}
usersController.updateUsersById = async ( req, res ) => {
    const errors = validationResult( req )
    if ( !errors.isEmpty() ) {
        const e = errors.array().map( e => {
            return {
                message: e.msg,
                param  : e.param
            }
        } )
        await logger.warn( 'Data integrity error', { ...e, ...req.info, user: req.user.email } )
        return res.status( 400 ).send( {
            status  : 'error',
            message : 'Data integrity error',
            response: { e, ...req.info }
        } )
    }
    try {
        const { id } = req.params
        const { name, lastname, email, rol } = req.body
        const { nModified } = await user.updateUserById( id, name, lastname, email, rol )
        if ( !nModified ) return res.status( 400 ).send( {
            status : 'error',
            message: 'Data does not match our records'
        } )
        return res.status( 200 ).send( {
            status : 'success',
            message: 'User updated successfully'
        } )
    } catch ( err ) {
        const { code, message, stack } = err
        await logger.error( 'Ops, something went wrong', { code, message, stack, ...req.info, user: req.user.email } )
        return res.status( 400 ).send( {
            status  : 'error',
            message : 'Ops, something went wrong',
            response: { message, ...req.info }
        } )
    }
}
usersController.updateUsersPasswordById = async ( req, res ) => {
    const errors = validationResult( req )
    if ( !errors.isEmpty() ) {
        const e = errors.array().map( e => {
            return {
                message: e.msg,
                param  : e.param
            }
        } )
        await logger.warn( 'Data integrity error', { ...e, ...req.info, user: req.user.email } )
        return res.status( 400 ).send( {
            status  : 'error',
            message : 'Data integrity error',
            response: { e, ...req.info }
        } )
    }
    try {
        const { id, password } = req.body
        const hash = await user.hashPassword( password )
        const { nModified } = await user.updateUserPasswordByIdUser( id, hash )
        if ( !nModified ) return res.status( 400 ).send( {
            status : 'error',
            message: 'Data does not match our records'
        } )
        return res.status( 200 ).send( {
            status : 'success',
            message: 'Password updated successfully'
        } )
    } catch ( err ) {
        const { code, message, stack } = err
        await logger.error( 'Ops, something went wrong', { code, message, stack, ...req.info, user: req.user.email } )
        return res.status( 400 ).send( {
            status  : 'error',
            message : 'Ops, something went wrong',
            response: { message, ...req.info }
        } )
    }
}
usersController.updateUsersRoleById = async ( req, res ) => {
    const errors = validationResult( req )
    if ( !errors.isEmpty() ) {
        const e = errors.array().map( e => {
            return {
                message: e.msg,
                param  : e.param
            }
        } )
        await logger.warn( 'Data integrity error', { ...e, ...req.info, user: req.user.email } )
        return res.status( 400 ).send( {
            status  : 'error',
            message : 'Data integrity error',
            response: { e, ...req.info }
        } )
    }
    try {
        const { id, rol } = req.body
        const { nModified } = await user.updateUserRoleByIdUser( id, rol )
        if ( !nModified ) return res.status( 400 ).send( {
            status : 'error',
            message: 'Data does not match our records'
        } )
        return res.status( 200 ).send( {
            status : 'success',
            message: 'Rol updated successfully'
        } )
    } catch ( err ) {
        const { code, message, stack } = err
        await logger.error( 'Ops, something went wrong', { code, message, stack, ...req.info, user: req.user.email } )
        return res.status( 400 ).send( {
            status  : 'error',
            message : 'Ops, something went wrong',
            response: { message, ...req.info }
        } )
    }
}

module.exports = usersController
