const express = require( 'express' )
const router = express.Router()
const authentication = require( '../middlewares/authentication' )
const admin = require( '../middlewares/admin' )
const { findAllRoles } = require( '../controllers/Roles' )

router.get( '', [ authentication, admin ], findAllRoles )

module.exports = router
