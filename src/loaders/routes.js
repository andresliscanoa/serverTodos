const usersRoute = require( '../routes/Users' )
const rolesRoute = require( '../routes/Roles' )
module.exports = function ( app ) {
    app.use( '/api/users', usersRoute )
    app.use( '/api/roles', rolesRoute )
}
