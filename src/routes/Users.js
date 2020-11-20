const express = require( 'express' )
const router = express.Router()
const { param, query, body } = require( 'express-validator' )
const { isUniqueUserEmail } = require( '../validations/schema' )
const { uniqueUsersEmails, listAllUsers, findUserById, createUser, singIn, updateUsersById, updateUsersPasswordById, updateUsersRoleById } = require( '../controllers/Users' )
const authentication = require( '../middlewares/authentication' )
const authorization = require( '../middlewares/authorization' )
const admin = require( '../middlewares/admin' )

router.get( '/unique/email', [ authentication, admin ], [
    query( 'value' )
        .isEmail().withMessage( 'Is not a valid email format' )
        .exists( { checkNull: true, checkFalsy: true } ).withMessage( 'Mandatory field' )
        .trim()
        .isLength( { min: 6, max: 100 } ).withMessage( 'Must be between six and 100 characters' )
        .custom( value => !/\s/.test( value ) ).withMessage( 'No white spaces allowed' )
], uniqueUsersEmails )
router.get( '', [ authentication, admin ], [
    query( 'items' )
        .exists( { checkNull: true, checkFalsy: true } ).withMessage( 'Mandatory field' )
        .isInt( { min: 10, max: 100 } ).withMessage( 'Must be numeric between 10 and 100' ),
    query( 'page' )
        .exists( { checkNull: true, checkFalsy: true } ).withMessage( 'Mandatory field' )
        .isInt( { min: 1 } ).withMessage( 'Must be numeric greater or equal to one' )
], listAllUsers )
router.get( '/:id', [ authentication, authorization ], [
    param( 'id' )
        .exists( { checkNull: true, checkFalsy: true } ).withMessage( 'Mandatory field' )
        .trim()
        .isMongoId().withMessage( 'Not a valid ID' )
], findUserById )
router.post( '/sing/in', [
    body( 'email' )
        .isEmail().withMessage( 'Is not a valid email format' )
        .exists( { checkNull: true, checkFalsy: true } ).withMessage( 'Mandatory field' )
        .trim()
        .isLength( { min: 6, max: 100 } ).withMessage( 'Must be between six and 100 characters' )
        .custom( value => !/\s/.test( value ) ).withMessage( 'No white spaces allowed' ),
    body( 'password' )
        .exists( { checkNull: true, checkFalsy: true } ).withMessage( 'Mandatory field' )
        .isLength( { min: 6, max: 20 } ).withMessage( 'Must be between six and 20 characters' )
        .trim()
        .custom( value => !/\s/.test( value ) ).withMessage( 'No white spaces allowed' )
], singIn )
router.post( '', [ authentication, admin ], [
    body( 'name.first' )
        .exists( { checkNull: true, checkFalsy: true } ).withMessage( 'Mandatory field' )
        .trim()
        .isLength( { min: 1, max: 255 } ).withMessage( 'Maximum 255 characters' ),
    body( 'name.last' ).optional()
        .trim()
        .isLength( { min: 1, max: 255 } ).withMessage( 'Maximum 255 characters' ),
    body( 'lastname.first' )
        .exists( { checkNull: true, checkFalsy: true } ).withMessage( 'Mandatory field' )
        .trim()
        .isLength( { min: 1, max: 255 } ).withMessage( 'Maximum 255 characters' ),
    body( 'lastname.last' ).optional()
        .trim()
        .isLength( { min: 1, max: 255 } ).withMessage( 'Maximum 255 characters' ),
    body( 'email' )
        .isEmail().withMessage( 'Is not a valid email format' )
        .exists( { checkNull: true, checkFalsy: true } ).withMessage( 'Mandatory field' )
        .trim()
        .isLength( { min: 6, max: 100 } ).withMessage( 'Must be between six and 100 characters' )
        .custom( value => !/\s/.test( value ) ).withMessage( 'No white spaces allowed' )
        .custom( async value => { if ( !await isUniqueUserEmail( value ) ) return Promise.reject() } ).withMessage( 'Email must be unique' ),
    body( 'password' )
        .exists( { checkNull: true, checkFalsy: true } ).withMessage( 'Mandatory field' )
        .isLength( { min: 6, max: 20 } ).withMessage( 'Must be between six and 20 characters' )
        .trim()
        .custom( value => !/\s/.test( value ) ).withMessage( 'No white spaces allowed' ),
    body( 'rol' )
        .exists( { checkNull: true, checkFalsy: true } ).withMessage( 'Mandatory field' )
        .trim()
        .isMongoId().withMessage( 'Not a valid ID' )
], createUser )
router.put( '/:id', [ authentication, admin ], [
    param( 'id' )
        .exists( { checkNull: true, checkFalsy: true } ).withMessage( 'Mandatory field' )
        .trim()
        .isMongoId().withMessage( 'Not a valid ID' ),
    body( 'name.first' )
        .exists( { checkNull: true, checkFalsy: true } ).withMessage( 'Mandatory field' )
        .trim()
        .isLength( { min: 1, max: 255 } ).withMessage( 'Maximum 255 characters' ),
    body( 'name.last' ).optional()
        .trim()
        .isLength( { min: 1, max: 255 } ).withMessage( 'Maximum 255 characters' ),
    body( 'lastname.first' )
        .exists( { checkNull: true, checkFalsy: true } ).withMessage( 'Mandatory field' )
        .trim()
        .isLength( { min: 1, max: 255 } ).withMessage( 'Maximum 255 characters' ),
    body( 'lastname.last' ).optional()
        .trim()
        .isLength( { min: 1, max: 255 } ).withMessage( 'Maximum 255 characters' ),
    body( 'email' )
        .isEmail().withMessage( 'Is not a valid email format' )
        .exists( { checkNull: true, checkFalsy: true } ).withMessage( 'Mandatory field' )
        .trim()
        .isLength( { min: 6, max: 100 } ).withMessage( 'Must be between six and 100 characters' )
        .custom( value => !/\s/.test( value ) ).withMessage( 'No white spaces allowed' )
        .custom( async ( value, { req } ) => { if ( !await isUniqueUserEmail( value, req.params.id ) ) return Promise.reject() } ).withMessage( 'Email must be unique' ),
    body( 'rol' )
        .exists( { checkNull: true, checkFalsy: true } ).withMessage( 'Mandatory field' )
        .trim()
        .isMongoId().withMessage( 'Not a valid ID' )
], updateUsersById )
router.put( '/set/password', [ authentication, admin ], [
    body( 'id' )
        .exists( { checkNull: true, checkFalsy: true } ).withMessage( 'Mandatory field' )
        .trim()
        .isMongoId().withMessage( 'Not a valid ID' ),
    body( 'password' )
        .exists( { checkNull: true, checkFalsy: true } ).withMessage( 'Mandatory field' )
        .isLength( { min: 6, max: 20 } ).withMessage( 'Must be between six and 20 characters' )
        .trim()
        .custom( value => !/\s/.test( value ) ).withMessage( 'No white spaces allowed' )
], updateUsersPasswordById )
router.put( '/set/rol', [ authentication, admin ], [
    body( 'id' )
        .exists( { checkNull: true, checkFalsy: true } ).withMessage( 'Mandatory field' )
        .trim()
        .isMongoId().withMessage( 'Not a valid ID' ),
    body( 'rol' )
        .exists( { checkNull: true, checkFalsy: true } ).withMessage( 'Mandatory field' )
        .trim()
        .isMongoId().withMessage( 'Not a valid ID' )
], updateUsersRoleById )

module.exports = router
