const express = require( 'express' )
const router = express.Router()
const authentication = require( '../middlewares/authentication' )
const authorization = require( '../middlewares/authorization' )
const { query, body } = require( 'express-validator' )
const { getTodos, createTodo, updateTodoById, updateTodoStatusById, deleteTodoById } = require( '../controllers/Todos' )

router.get( '', [ authentication, authorization ], [
    query( 'items' )
        .exists( { checkNull: true, checkFalsy: true } ).withMessage( 'Mandatory field' )
        .isInt( { min: 10, max: 100 } ).withMessage( 'Must be numeric between 10 and 100' ),
    query( 'page' )
        .exists( { checkNull: true, checkFalsy: true } ).withMessage( 'Mandatory field' )
        .isInt( { min: 1 } ).withMessage( 'Must be numeric greater or equal to one' ),
    query( 'user' ).optional()
        .trim()
        .isMongoId().withMessage( 'Not a valid ID' ),
    query( 'start' ).optional()
        .trim()
        .isLength( { min: 10, max: 10 } ).withMessage( 'Must be 10 characters long' ),
    query( 'end' ).optional()
        .trim()
        .isLength( { min: 10, max: 10 } ).withMessage( 'Must be 10 characters long' )
        .custom( ( value, { req } ) => {
            if ( value < req.body.start ) {
                return Promise.reject()
            } else {
                return Promise.resolve()
            }
        } ).withMessage( 'End Date can\'t be less than start Date' ),
    query( 'status' ).optional()
        .trim()
        .isIn( [ 'Pending', 'Overdue', 'Finished' ] ).withMessage( 'Not a valid value' ),
    query( 'category' ).optional()
        .trim()
        .isMongoId().withMessage( 'Not a valid ID' )
], getTodos )
router.post( '', [ authentication, authorization ], [
    body( 'title' )
        .exists( { checkNull: true, checkFalsy: true } ).withMessage( 'Mandatory field' )
        .trim()
        .isLength( { min: 1, max: 255 } ).withMessage( 'Must be 255 characters long' ),
    body( 'description' ).optional()
        .trim()
        .isLength( { max: 255 } ).withMessage( 'Must be 255 characters long' ),
    body( 'category' )
        .exists( { checkNull: true, checkFalsy: true } ).withMessage( 'Mandatory field' )
        .trim()
        .isMongoId().withMessage( 'Not a valid ID' ),
    body( 'start' ).optional()
        .trim()
        .isLength( { max: 10 } ).withMessage( 'Must be 10 characters long' ),
    body( 'deadline' ).optional()
        .trim()
        .isLength( { max: 10 } ).withMessage( 'Must be 10 characters long' ),
    body( 'status' ).optional()
        .trim()
        .isIn( [ 'Pending', 'Overdue', 'Finished' ] ).withMessage( 'Not a valid value' )
], createTodo )
router.put( '', [ authentication, authorization ], [
    body( 'id' )
        .exists( { checkNull: true, checkFalsy: true } ).withMessage( 'Mandatory field' )
        .trim()
        .isMongoId().withMessage( 'Not a valid ID' ),
    body( 'title' )
        .exists( { checkNull: true, checkFalsy: true } ).withMessage( 'Mandatory field' )
        .trim()
        .isLength( { min: 1, max: 255 } ).withMessage( 'Must be 255 characters long' ),
    body( 'description' ).optional()
        .trim()
        .isLength( { max: 255 } ).withMessage( 'Must be 255 characters long' ),
    body( 'category' )
        .exists( { checkNull: true, checkFalsy: true } ).withMessage( 'Mandatory field' )
        .trim()
        .isMongoId().withMessage( 'Not a valid ID' ),
    body( 'start' ).optional()
        .trim()
        .isLength( { max: 10 } ).withMessage( 'Must be 10 characters long' ),
    body( 'deadline' ).optional()
        .trim()
        .isLength( { max: 10 } ).withMessage( 'Must be 10 characters long' ),
    body( 'status' )
        .trim()
        .isIn( [ 'Pending', 'Overdue', 'Finished' ] ).withMessage( 'Not a valid value' )
], updateTodoById )
router.put( '/status', [ authentication, authorization ], [
    body( 'id' )
        .exists( { checkNull: true, checkFalsy: true } ).withMessage( 'Mandatory field' )
        .trim()
        .isMongoId().withMessage( 'Not a valid ID' ),
    body( 'status' )
        .exists( { checkNull: true, checkFalsy: true } ).withMessage( 'Mandatory field' )
        .trim()
        .isIn( [ 'Pending', 'Overdue', 'Finished' ] ).withMessage( 'Not a valid value' )
], updateTodoStatusById )
router.delete( '', [ authentication, authorization ], [
    body( 'id' )
        .exists( { checkNull: true, checkFalsy: true } ).withMessage( 'Mandatory field' )
        .trim()
        .isMongoId().withMessage( 'Not a valid ID' )
], deleteTodoById )
module.exports = router
