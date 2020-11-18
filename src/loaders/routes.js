const categoriesRoute = require( '../routes/Categories' )
const rolesRoute = require( '../routes/Roles' )
const todosRoute = require( '../routes/Todos' )
const usersRoute = require( '../routes/Users' )
module.exports = function ( app ) {
    app.use( '/api/categories', categoriesRoute )
    app.use( '/api/roles', rolesRoute )
    app.use( '/api/todos', todosRoute )
    app.use( '/api/users', usersRoute )
}
