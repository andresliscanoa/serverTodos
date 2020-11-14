const Logger = require( '../loaders/logger' )
const logger = new Logger( 'Roles' )
const Roles = require( '../models/Roles' )
const rol = new Roles()
const rolesController = {}

rolesController.findAllRoles = async ( req, res ) => {
    try {
        const data = await rol.getRoles()
        return res.status( 200 ).send( {
            status  : 'success',
            message : 'Roles list',
            response: data
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

module.exports = rolesController
