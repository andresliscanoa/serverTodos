const express = require( 'express' )
const router = express.Router()
const authentication = require( '../middlewares/authentication' )
const authorization = require( '../middlewares/authorization' )
const { query, body } = require( 'express-validator' )
const { isUniqueCategoryName } = require( '../validations/schema' )
const { uniqueCategoriesName, getCategoriesByIdUser, getCategoriesByNameByIdUser, createCategory, updateCategoriesByIdByUser, updateCategoriesStatusByIdByUser } = require( '../controllers/Categories' )

router.get( '/unique/name', [ authentication, authorization ], [
    query( 'value' )
        .exists( { checkNull: true, checkFalsy: true } ).withMessage( 'Mandatory field' )
        .trim()
        .isLength( { min: 1, max: 100 } ).withMessage( 'Must be between one and 100 characters' )
], uniqueCategoriesName )
router.get( '', [ authentication, authorization ], [
    query( 'items' )
        .exists( { checkNull: true, checkFalsy: true } ).withMessage( 'Mandatory field' )
        .isInt( { min: 10, max: 100 } ).withMessage( 'Must be numeric between 10 and 100' ),
    query( 'page' )
        .exists( { checkNull: true, checkFalsy: true } ).withMessage( 'Mandatory field' )
        .isInt( { min: 1 } ).withMessage( 'Must be numeric greater or equal to one' )
], getCategoriesByIdUser )
router.get( '/name', [ authentication, authorization ], [
    query( 'items' )
        .exists( { checkNull: true, checkFalsy: true } ).withMessage( 'Mandatory field' )
        .isInt( { min: 10, max: 100 } ).withMessage( 'Must be numeric between 10 and 100' ),
    query( 'page' )
        .exists( { checkNull: true, checkFalsy: true } ).withMessage( 'Mandatory field' )
        .isInt( { min: 1 } ).withMessage( 'Must be numeric greater or equal to one' ),
    query( 'search' )
        .exists( { checkNull: true, checkFalsy: true } ).withMessage( 'Mandatory field' )
        .trim()
        .isLength( { min: 1, max: 100 } ).withMessage( 'Must be between one and 100 characters' )
], getCategoriesByNameByIdUser )
router.post( '', [ authentication, authorization ], [
    body( 'name' )
        .exists( { checkNull: true, checkFalsy: true } ).withMessage( 'Mandatory field' )
        .trim()
        .isLength( { min: 1, max: 100 } ).withMessage( 'Must be between one and 100 characters' )
        .custom( async ( value, { req } ) => { if ( !await isUniqueCategoryName( value, 'none', req.user._id ) ) return Promise.reject() } ).withMessage( 'Name must be unique' )
], createCategory )
router.put( '', [ authentication, authorization ], [
    body( 'id' )
        .exists( { checkNull: true, checkFalsy: true } ).withMessage( 'Mandatory field' )
        .trim()
        .isMongoId().withMessage( 'Not a valid ID' ),
    body( 'name' )
        .exists( { checkNull: true, checkFalsy: true } ).withMessage( 'Mandatory field' )
        .trim()
        .isLength( { min: 1, max: 100 } ).withMessage( 'Must be between one and 100 characters' )
        .custom( async ( value, { req } ) => { if ( !await isUniqueCategoryName( value, req.body.id, req.user._id ) ) return Promise.reject() } ).withMessage( 'Name must be unique' ),
    body( 'status' )
        .exists( { checkNull: true, checkFalsy: true } ).withMessage( 'Mandatory field' )
        .isBoolean().withMessage( 'Is not a valid boolean value' )
], updateCategoriesByIdByUser )
router.put( '/status', [ authentication, authorization ], [
    body( 'id' )
        .exists( { checkNull: true, checkFalsy: true } ).withMessage( 'Mandatory field' )
        .trim()
        .isMongoId().withMessage( 'Not a valid ID' ),
    body( 'status' )
        .exists( { checkNull: true, checkFalsy: true } ).withMessage( 'Mandatory field' )
        .isBoolean().withMessage( 'Is not a valid boolean value' )
], updateCategoriesStatusByIdByUser )

module.exports = router
