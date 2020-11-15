const { validationResult } = require( 'express-validator' )
const Logger = require( '../loaders/logger' )
const logger = new Logger( 'Users' )
const Categories = require( '../models/Categories' )
const category = new Categories()
const categoriesController = {}

categoriesController.uniqueCategoriesName = async ( req, res ) => {
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
        const { value } = req.query
        const id = req.query.id || 'none'
        const message = await category.uniqueCategoryName( value, id, user ) ? 'Available value' : 'Duplicate value'
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
categoriesController.getCategoriesByIdUser = async ( req, res ) => {
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
        const { pagination, data } = await category.getCategoriesByUserId( user, limit, skip )
        return res.status( 200 ).send( {
            status  : 'success',
            message : 'Categories list',
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
categoriesController.getCategoriesByNameByIdUser = async ( req, res ) => {
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
        const { page, items, search } = req.query
        const limit = parseInt( items )
        const skip = (parseInt( page ) - 1) * parseInt( items )
        const { pagination, data } = await category.getCategoriesByUserIdByName( user, search, limit, skip )
        return res.status( 200 ).send( {
            status  : 'success',
            message : 'Categories list by name',
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
categoriesController.createCategory = async ( req, res ) => {
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
        const { name } = req.body
        const user = req.user._id
        await new Categories( { name, user } ).save()
        return res.status( 200 ).send( {
            status : 'success',
            message: 'Category created successfully'
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
categoriesController.updateCategoriesByIdByUser = async ( req, res ) => {
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
        const { id, name, status } = req.body
        const { nModified } = await category.updateCategoryByIdByUserId( id, user, name, status )
        if ( !nModified ) return res.status( 400 ).send( {
            status : 'error',
            message: 'Data does not match our records'
        } )
        return res.status( 200 ).send( {
            status : 'success',
            message: 'Category updated successfully'
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
categoriesController.updateCategoriesStatusByIdByUser = async ( req, res ) => {
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
        const { id, status } = req.body
        const { nModified } = await category.updateCategoryStatusByIdByUserId( id, user, status )
        if ( !nModified ) return res.status( 400 ).send( {
            status : 'error',
            message: 'Data does not match our records'
        } )
        return res.status( 200 ).send( {
            status : 'success',
            message: 'Category updated successfully'
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

module.exports = categoriesController
