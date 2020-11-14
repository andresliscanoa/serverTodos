const Users                                                              = require( '../models/Users' ), Categories                   = require( '../models/Categories' ),
      user = new Users(), category = new Categories(), schemaValidations = {}

schemaValidations.isUniqueUserEmail = async ( email, id = 'none' ) => user.uniqueUserEmail( email, id )
schemaValidations.isUniqueCategoryName = async ( name, id = 'none' ) => category.uniqueCategoryName( name, id )

module.exports = schemaValidations
