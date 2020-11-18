const { validationResult } = require( 'express-validator' )
const Logger = require( '../loaders/logger' )
const logger = new Logger( 'Users' )
const tomorrow = require( '../functions/tomorrow' )
const Todos = require( '../models/Todos' )
const todos = new Todos()
const todosController = {}
todosController.getAllTodos = async ( req, res ) => {
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
        const user = req.user._id
        const { page, items } = req.query
        const limit = parseInt( items )
        const skip = (parseInt( page ) - 1) * parseInt( items )
        const { pagination, data } = await todos.getTodosByUserId( user, limit, skip )
        return res.status( 200 ).send( {
            status  : 'success',
            message : 'Todos list',
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
todosController.getTodosByStatus = async ( req, res ) => {
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
        const user = req.user._id
        const { page, items } = req.query
        const { status } = req.params
        const limit = parseInt( items )
        const skip = (parseInt( page ) - 1) * parseInt( items )
        const { pagination, data } = await todos.getTodosByUserIdByStatus( user, status, limit, skip )
        return res.status( 200 ).send( {
            status  : 'success',
            message : `Todos list by status ${ status }`,
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
todosController.getTodosByDates = async ( req, res ) => {
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
        const user = req.user._id
        const { page, items } = req.query
        let { start, end } = req.body
        const limit = parseInt( items )
        const skip = (parseInt( page ) - 1) * parseInt( items )
        end = end || tomorrow()
        const { pagination, data } = await todos.getTodosByUserIdByDateRange( user, start, end, limit, skip )
        return res.status( 200 ).send( {
            status  : 'success',
            message : `Todos list by dates`,
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
todosController.getTodosByCategory = async ( req, res ) => {
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
        const user = req.user._id
        const { page, items } = req.query
        const { category } = req.params
        const limit = parseInt( items )
        const skip = (parseInt( page ) - 1) * parseInt( items )
        const { pagination, data } = await todos.getTodosByUserIdByCategoryId( user, category, limit, skip )
        return res.status( 200 ).send( {
            status  : 'success',
            message : `Todos list by category`,
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
todosController.createTodo = async ( req, res ) => {
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
        await logger.error( 'Ops, something went wrong', { code, message, stack, ...req.info, user: req.user.email } )
        return res.status( 400 ).send( {
            status  : 'error',
            message : 'Ops, something went wrong',
            response: { message, ...req.info }
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
        await logger.warn( 'Data integrity error', { ...e, ...req.info, user: req.user.email } )
        return res.status( 400 ).send( {
            status  : 'error',
            message : 'Data integrity error',
            response: { e, ...req.info }
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
        await logger.error( 'Ops, something went wrong', { code, message, stack, ...req.info, user: req.user.email } )
        return res.status( 400 ).send( {
            status  : 'error',
            message : 'Ops, something went wrong',
            response: { message, ...req.info }
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
        await logger.warn( 'Data integrity error', { ...e, ...req.info, user: req.user.email } )
        return res.status( 400 ).send( {
            status  : 'error',
            message : 'Data integrity error',
            response: { e, ...req.info }
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
        await logger.error( 'Ops, something went wrong', { code, message, stack, ...req.info, user: req.user.email } )
        return res.status( 400 ).send( {
            status  : 'error',
            message : 'Ops, something went wrong',
            response: { message, ...req.info }
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
        await logger.warn( 'Data integrity error', { ...e, ...req.info, user: req.user.email } )
        return res.status( 400 ).send( {
            status  : 'error',
            message : 'Data integrity error',
            response: { e, ...req.info }
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
        await logger.error( 'Ops, something went wrong', { code, message, stack, ...req.info, user: req.user.email } )
        return res.status( 400 ).send( {
            status  : 'error',
            message : 'Ops, something went wrong',
            response: { message, ...req.info }
        } )
    }
}

module.exports = todosController
