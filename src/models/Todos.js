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
        default: 'pending',
        enum   : [ 'pending', 'overdue', 'finished' ]
    },
    user       : {
        type    : mongoose.Schema.Types.ObjectId,
        ref     : 'Users',
        required: true
    }
}, { timestamps: true } )

todoSchema.methods.getTodosByUserId = async ( id, limit, skip ) => {
    const total = await mongoose.model( 'Todos', todoSchema, 'Todos' )
        .find(
            {
                user: ObjectId( id )
            }
        )
        .countDocuments()
    const data = await mongoose.model( 'Todos', todoSchema, 'Todos' )
        .find(
            {
                user: ObjectId( id )
            },
            {
                user: 0, __v: 0
            }
        )
        .skip( skip )
        .limit( limit )
    const pagination = { total, perPage: limit, pages: Math.ceil( total / limit ) }
    return { pagination, data }
}

todoSchema.methods.getTodosByUserIdByStatus = async ( id, status, limit, skip ) => {
    const total = await mongoose.model( 'Todos', todoSchema, 'Todos' )
        .find(
            {
                user: ObjectId( id ),
                status
            }
        )
        .countDocuments()
    const data = await mongoose.model( 'Todos', todoSchema, 'Todos' )
        .find(
            {
                user: ObjectId( id ),
                status
            },
            {
                user: 0, __v: 0
            }
        )
        .skip( skip )
        .limit( limit )
    const pagination = { total, perPage: limit, pages: Math.ceil( total / limit ) }
    return { pagination, data }
}

todoSchema.methods.getTodosByUserIdByDateRange = async ( id, start, end, limit, skip ) => {
    const total = await mongoose.model( 'Todos', todoSchema, 'Todos' )
        .find(
            {
                user      : ObjectId( id ),
                created_at: {
                    $gte: start,
                    $lte: end
                }
            }
        )
        .countDocuments()
    const data = await mongoose.model( 'Todos', todoSchema, 'Todos' )
        .find(
            {
                user      : ObjectId( id ),
                created_at: {
                    $gte: start,
                    $lte: end
                }
            },
            {
                user: 0, __v: 0
            }
        )
        .skip( skip )
        .limit( limit )
    const pagination = { total, perPage: limit, pages: Math.ceil( total / limit ) }
    return { pagination, data }
}

todoSchema.methods.getTodosByUserIdByCategoryId = async ( id, category, limit, skip ) => {
    const total = await mongoose.model( 'Todos', todoSchema, 'Todos' )
        .find(
            {
                user    : ObjectId( id ),
                category: ObjectId( category )
            }
        )
        .countDocuments()
    const data = await mongoose.model( 'Todos', todoSchema, 'Todos' )
        .find(
            {
                user    : ObjectId( id ),
                category: ObjectId( category )
            },
            {
                user: 0, __v: 0
            }
        )
        .skip( skip )
        .limit( limit )
    const pagination = { total, perPage: limit, pages: Math.ceil( total / limit ) }
    return { pagination, data }
}

todoSchema.methods.updateTodosByIdByUserId =
    async ( id, user, title, description, category, start, deadline, status ) =>
        await mongoose.model( 'Todos', todoSchema, 'Todos' )
            .updateOne(
                {
                    _id : ObjectId( id ),
                    user: ObjectId( id )
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
                user: ObjectId( id )
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
                user: ObjectId( id )
            }
        )


const Todos = new mongoose.model( 'Todos', todoSchema, 'Todos' )
module.exports = Todos
