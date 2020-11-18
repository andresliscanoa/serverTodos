const express = require( 'express' )
const router = express.Router()
const authentication = require( '../middlewares/authentication' )
const authorization = require( '../middlewares/authorization' )
const { query, param, body } = require( 'express-validator' )
const { getAllTodos, getTodosByCategory, getTodosByDates, getTodosByStatus, createTodo, updateTodoById, updateTodoStatusById, deleteTodoById } = require( '../controllers/Todos' )

router.get( '', [ authentication, authorization ], [
    query( 'items' )
        .exists( { checkNull: true, checkFalsy: true } ).withMessage( 'Mandatory field' )
        .isInt( { min: 10, max: 100 } ).withMessage( 'Must be numeric between 10 and 100' ),
    query( 'page' )
        .exists( { checkNull: true, checkFalsy: true } ).withMessage( 'Mandatory field' )
        .isInt( { min: 1 } ).withMessage( 'Must be numeric greater or equal to one' )
], getAllTodos )
router.get( '/category/:category', [ authentication, authorization ], [
    query( 'items' )
        .exists( { checkNull: true, checkFalsy: true } ).withMessage( 'Mandatory field' )
        .isInt( { min: 10, max: 100 } ).withMessage( 'Must be numeric between 10 and 100' ),
    query( 'page' )
        .exists( { checkNull: true, checkFalsy: true } ).withMessage( 'Mandatory field' )
        .isInt( { min: 1 } ).withMessage( 'Must be numeric greater or equal to one' ),
    param( 'category' )
        .exists( { checkNull: true, checkFalsy: true } ).withMessage( 'Mandatory field' )
        .trim()
        .isMongoId().withMessage( 'Not a valid ID' )
], getTodosByCategory )
router.get( '/status/:status', [ authentication, authorization ], [
    query( 'items' )
        .exists( { checkNull: true, checkFalsy: true } ).withMessage( 'Mandatory field' )
        .isInt( { min: 10, max: 100 } ).withMessage( 'Must be numeric between 10 and 100' ),
    query( 'page' )
        .exists( { checkNull: true, checkFalsy: true } ).withMessage( 'Mandatory field' )
        .isInt( { min: 1 } ).withMessage( 'Must be numeric greater or equal to one' ),
    param( 'status' )
        .exists( { checkNull: true, checkFalsy: true } ).withMessage( 'Mandatory field' )
        .trim()
        .isIn( [ 'Pending', 'Overdue', 'Finished' ] ).withMessage( 'Not a valid value' )
], getTodosByStatus )
router.get( '/date', [ authentication, authorization ], [
    query( 'items' )
        .exists( { checkNull: true, checkFalsy: true } ).withMessage( 'Mandatory field' )
        .isInt( { min: 10, max: 100 } ).withMessage( 'Must be numeric between 10 and 100' ),
    query( 'page' )
        .exists( { checkNull: true, checkFalsy: true } ).withMessage( 'Mandatory field' )
        .isInt( { min: 1 } ).withMessage( 'Must be numeric greater or equal to one' ),
    body( 'start' )
        .exists( { checkNull: true, checkFalsy: true } ).withMessage( 'Mandatory field' )
        .trim()
        .isLength( { min: 10, max: 10 } ).withMessage( 'Must be 10 characters long' ),
    body( 'end' ).optional()
        .trim()
        .isLength( { min: 10, max: 10 } ).withMessage( 'Must be 10 characters long' )
], getTodosByDates )
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
    body( 'status' ).optional()
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
