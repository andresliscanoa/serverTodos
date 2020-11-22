const mongoose = require( 'mongoose' )
const ObjectId = require( 'mongoose' ).Types.ObjectId

const todoSchema = new mongoose.Schema( {
    title      : {
        type    : String,
        min     : 1,
        max     : 255,
        trim    : true,
        required: true
    },
    description: {
        type: String,
        min : 1,
        max : 255,
        trim: true
    },
    category   : {
        type    : mongoose.Schema.Types.ObjectId,
        ref     : 'Categories',
        required: true
    },
    start      : {
        type: String,
        min : 1,
        max : 255,
        trim: true
    },
    deadline   : {
        type: String,
        min : 1,
        max : 255,
        trim: true
    },
    status     : {
        type   : String,
        min    : 1,
        max    : 255,
        trim   : true,
        default: 'Pending',
        enum   : [ 'Pending', 'Overdue', 'Finished' ]
    },
    user       : {
        type    : mongoose.Schema.Types.ObjectId,
        ref     : 'Users',
        required: true
    }
}, { timestamps: true } )

todoSchema.methods.getTodosGroupByStatus = async user =>
    await mongoose.model( 'Todos', todoSchema, 'Todos' )
        .aggregate(
            [
                { $match: { user: { $eq: ObjectId( user ) } } },
                { $group: { _id: '$status', count: { $sum: 1 } } }
            ]
        )

todoSchema.methods.getTodosByFilters = async ( params, limit, skip ) => {
    let filter = {}
    if ( params.user ) filter.user = ObjectId( params.user )
    if ( params.category ) filter.category = ObjectId( params.category )
    if ( params.status ) filter.status = params.status
    if ( params.start ) filter.createdAt = {
        $gte: new Date( new Date( params.start ).setHours( 0, 0, 0 ) )
    }
    if ( params.end ) filter.createdAt = {
        $lte: new Date( new Date( params.end ).setHours( 23, 59, 59 ) )
    }
    if ( params.start && params.end ) filter.createdAt = {
        $gte: new Date( new Date( params.start ).setHours( 0, 0, 0 ) ),
        $lte: new Date( new Date( params.end ).setHours( 23, 59, 59 ) )
    }
    const total = await mongoose.model( 'Todos', todoSchema, 'Todos' )
        .find(
            filter
        )
        .countDocuments()
    const data = await mongoose.model( 'Todos', todoSchema, 'Todos' )
        .find(
            filter,
            {
                __v: 0
            }
        )
        .sort(
            {
                createdAt: 'desc'
            }
        )
        .skip( skip )
        .limit( limit )
        .populate(
            {
                path  : 'category',
                select: '_id name'
            }
        )
        .populate(
            {
                path  : 'user',
                select: '_id email'
            }
        )
    const pagination = { total, perPage: limit, pages: Math.ceil( total / limit ) }
    return { pagination, data }
}
todoSchema.methods.getTodosById = async ( id, user ) =>
    await mongoose.model( 'Todos', todoSchema, 'Todos' )
        .findOne(
            {
                _id : { $eq: ObjectId( id ) },
                user: { $eq: ObjectId( user ) }
            },
            {
                updatedAt: 0, __v: 0
            }
        )
        .populate(
            {
                path  : 'category',
                select: '_id name'
            }
        )
        .populate(
            {
                path  : 'user',
                select: '_id email'
            }
        )
todoSchema.methods.updateTodosByIdByUserId =
    async ( id, user, title, description, category, start, deadline, status ) =>
        await mongoose.model( 'Todos', todoSchema, 'Todos' )
            .updateOne(
                {
                    _id : ObjectId( id ),
                    user: ObjectId( user )
                },
                {
                    title, description, category, start, deadline, status
                }
            )
todoSchema.methods.updateTodosStatusByIdByUserId = async ( id, user, status ) =>
    await mongoose.model( 'Todos', todoSchema, 'Todos' )
        .updateOne(
            {
                _id : ObjectId( id ),
                user: ObjectId( user )
            },
            {
                status
            }
        )
todoSchema.methods.deleteTodosByIdByUserId = async ( id, user ) =>
    await mongoose.model( 'Todos', todoSchema, 'Todos' )
        .deleteOne(
            {
                _id : ObjectId( id ),
                user: ObjectId( user )
            }
        )

const Todos = mongoose.model( 'Todos', todoSchema, 'Todos' )
module.exports = Todos
