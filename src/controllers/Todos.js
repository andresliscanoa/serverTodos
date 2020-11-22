const { validationResult } = require( 'express-validator' )
const Logger = require( '../loaders/logger' )
const logger = new Logger( 'Users' )
const Todos = require( '../models/Todos' )
const todos = new Todos()
const todosController = {}

todosController.getTodosTotalByStatus = async ( req, res ) => {
    const errors = validationResult( req )
    if ( !errors.isEmpty() ) {
        const e = errors.array().map( e => {
            return {
                message: e.msg,
                param  : e.param
            }
        } )
        await logger.warn( 'Data integrity error', { err: e, info: req.info, user: req.user.email } )
        return res.status( 400 ).send( {
            status  : 'error',
            message : 'Data integrity error',
            response: { err: e, info: req.info }
        } )
    }
    try {
        const { user } = req.query
        if ( req.user.rol !== 'admin' && user !== req.user._id ) {
            return res.status( 403 ).send( {
                status : 'error',
                message: 'Forbidden access'
            } )
        }
        const data = await todos.getTodosGroupByStatus( user )
        return res.status( 200 ).send( {
            status  : 'success',
            message : 'Todos dashboard',
            response: data
        } )
    } catch ( err ) {
        const { code, message, stack } = err
        await logger.error( 'Ops, something went wrong', {
            code,
            message,
            stack,
            info: req.info,
            user: req.user.email
        } )
        return res.status( 400 ).send( {
            status  : 'error',
            message : 'Ops, something went wrong',
            response: { err: message, info: req.info }
        } )
    }
}
todosController.getTodos = async ( req, res ) => {
    const errors = validationResult( req )
    if ( !errors.isEmpty() ) {
        const e = errors.array().map( e => {
            return {
                message: e.msg,
                param  : e.param
            }
        } )
        await logger.warn( 'Data integrity error', { err: e, info: req.info, user: req.user.email } )
        return res.status( 400 ).send( {
            status  : 'error',
            message : 'Data integrity error',
            response: { err: e, info: req.info }
        } )
    }
    try {
        const { page, items } = req.query
        const limit = parseInt( items )
        const skip = (parseInt( page ) - 1) * parseInt( items )
        const params = {}
        params.user = req.query && req.query.user
        params.category = req.query && req.query.category
        params.status = req.query && req.query.status
        params.start = req.query && req.query.start
        params.end = req.query && req.query.end
        if ( req.user.rol !== 'admin' && params.user !== req.user._id ) {
            return res.status( 403 ).send( {
                status : 'error',
                message: 'Forbidden access'
            } )
        }
        if ( req.user.rol !== 'admin' && !req.query.user ) {
            return res.status( 403 ).send( {
                status : 'error',
                message: 'Forbidden access'
            } )
        }
        const { pagination, data } = await todos.getTodosByFilters( params, limit, skip )
        return res.status( 200 ).send( {
            status  : 'success',
            message : 'Todos list by filters',
            response: { pagination, data }
        } )
    } catch ( err ) {
        const { code, message, stack } = err
        await logger.error( 'Ops, something went wrong', {
            code,
            message,
            stack,
            info: req.info,
            user: req.user.email
        } )
        return res.status( 400 ).send( {
            status  : 'error',
            message : 'Ops, something went wrong',
            response: { err: message, info: req.info }
        } )
    }
}
todosController.getTodoById = async ( req, res ) => {
    const errors = validationResult( req )
    if ( !errors.isEmpty() ) {
        const e = errors.array().map( e => {
            return {
                message: e.msg,
                param  : e.param
            }
        } )
        await logger.warn( 'Data integrity error', { err: e, info: req.info, user: req.user.email } )
        return res.status( 400 ).send( {
            status  : 'error',
            message : 'Data integrity error',
            response: { err: e, info: req.info }
        } )
    }
    try {
        const { id } = req.params
        const { user } = req.query
        if ( req.user.rol !== 'admin' && user !== req.user._id ) {
            return res.status( 403 ).send( {
                status : 'error',
                message: 'Forbidden access'
            } )
        }
        const data = await todos.getTodosById( id, user )
        return res.status( 200 ).send( {
            status  : 'success',
            message : 'Todos list by filters',
            response: data
        } )
    } catch ( err ) {
        const { code, message, stack } = err
        await logger.error( 'Ops, something went wrong', {
            code,
            message,
            stack,
            info: req.info,
            user: req.user.email
        } )
        return res.status( 400 ).send( {
            status  : 'error',
            message : 'Ops, something went wrong',
            response: { err: message, info: req.info }
        } )
    }
}
todosController.createTodo = async ( req, res ) => {
    const errors = validationResult( req )
    if ( !errors.isEmpty() ) {
        const e = errors.array().map( e => {
            return {
                message: e.msg,
                param  : e.param
            }
        } )
        await logger.warn( 'Data integrity error', { err: e, info: req.info, user: req.user.email } )
        return res.status( 400 ).send( {
            status  : 'error',
            message : 'Data integrity error',
            response: { err: e, info: req.info }
        } )
    }
    try {
        let { title, description, category, start, deadline, status } = req.body
        const user = req.user._id
        description = description || ''
        start = start || ''
        deadline = deadline || ''
        status = status || 'Pending'
        await new Todos( { title, description, category, start, deadline, status, user } ).save()
        return res.status( 200 ).send( {
            status : 'success',
            message: 'Todo created successfully'
        } )
    } catch ( err ) {
        const { code, message, stack } = err
        await logger.error( 'Ops, something went wrong', {
            code,
            message,
            stack,
            info: req.info,
            user: req.user.email
        } )
        return res.status( 400 ).send( {
            status  : 'error',
            message : 'Ops, something went wrong',
            response: { err: message, info: req.info }
        } )
    }
}
todosController.updateTodoById = async ( req, res ) => {
    const errors = validationResult( req )
    if ( !errors.isEmpty() ) {
        const e = errors.array().map( e => {
            return {
                message: e.msg,
                param  : e.param
            }
        } )
        await logger.warn( 'Data integrity error', { err: e, info: req.info, user: req.user.email } )
        return res.status( 400 ).send( {
            status  : 'error',
            message : 'Data integrity error',
            response: { err: e, info: req.info }
        } )
    }
    try {
        const { id, title, description, category, start, deadline, status } = req.body
        const user = req.user._id
        const { nModified } = await todos.updateTodosByIdByUserId( id, user, title, description, category, start, deadline, status )
        if ( !nModified ) return res.status( 400 ).send( {
            status : 'error',
            message: 'Data does not match our records'
        } )
        return res.status( 200 ).send( {
            status : 'success',
            message: 'Todo updated successfully'
        } )
    } catch ( err ) {
        const { code, message, stack } = err
        await logger.error( 'Ops, something went wrong', {
            code,
            message,
            stack,
            info: req.info,
            user: req.user.email
        } )
        return res.status( 400 ).send( {
            status  : 'error',
            message : 'Ops, something went wrong',
            response: { err: message, info: req.info }
        } )
    }
}
todosController.updateTodoStatusById = async ( req, res ) => {
    const errors = validationResult( req )
    if ( !errors.isEmpty() ) {
        const e = errors.array().map( e => {
            return {
                message: e.msg,
                param  : e.param
            }
        } )
        await logger.warn( 'Data integrity error', { err: e, info: req.info, user: req.user.email } )
        return res.status( 400 ).send( {
            status  : 'error',
            message : 'Data integrity error',
            response: { err: e, info: req.info }
        } )
    }
    try {
        const { id, status } = req.body
        const user = req.user._id
        const { nModified } = await todos.updateTodosStatusByIdByUserId( id, user, status )
        if ( !nModified ) return res.status( 400 ).send( {
            status : 'error',
            message: 'Data does not match our records'
        } )
        return res.status( 200 ).send( {
            status : 'success',
            message: 'Todo updated successfully'
        } )
    } catch ( err ) {
        const { code, message, stack } = err
        await logger.error( 'Ops, something went wrong', {
            code,
            message,
            stack,
            info: req.info,
            user: req.user.email
        } )
        return res.status( 400 ).send( {
            status  : 'error',
            message : 'Ops, something went wrong',
            response: { err: message, info: req.info }
        } )
    }
}
todosController.deleteTodoById = async ( req, res ) => {
    const errors = validationResult( req )
    if ( !errors.isEmpty() ) {
        const e = errors.array().map( e => {
            return {
                message: e.msg,
                param  : e.param
            }
        } )
        await logger.warn( 'Data integrity error', { err: e, info: req.info, user: req.user.email } )
        return res.status( 400 ).send( {
            status  : 'error',
            message : 'Data integrity error',
            response: { err: e, info: req.info }
        } )
    }
    try {
        const { id } = req.body
        const user = req.user._id
        const { deletedCount } = await todos.deleteTodosByIdByUserId( id, user )
        if ( !deletedCount ) return res.status( 400 ).send( {
            status : 'error',
            message: 'Data does not match our records'
        } )
        return res.status( 200 ).send( {
            status : 'success',
            message: 'Todo deleted successfully'
        } )
    } catch ( err ) {
        const { code, message, stack } = err
        await logger.error( 'Ops, something went wrong', {
            code,
            message,
            stack,
            info: req.info,
            user: req.user.email
        } )
        return res.status( 400 ).send( {
            status  : 'error',
            message : 'Ops, something went wrong',
            response: { err: message, info: req.info }
        } )
    }
}

module.exports = todosController
