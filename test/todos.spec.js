const app = require( './server/index' )
const supertest = require( 'supertest' )
const faker = require( 'faker' )
const request = supertest( app )
const { setup } = require( './server/setup' )
setup().then()
const url = '/api/todos'
let token, id
const adminID = '5f2f7389899672386846c550', userID = '5f2f7389899672386846c551',
      adminCategory = '5f2f7389899672386846c570', userCategory = '5f2f7389899672386846c566'
describe( 'TEST TODOS', () => {
    describe( 'ADMIN USER', () => {
        it( 'Should login admin user successfully', async done => {
            const res = await request.post( '/api/users/sing/in' )
                .send( {
                    email   : 'admin@todos.com',
                    password: '123456789'
                } )
            expect( res.body.token ).toBeTruthy()
            token = res.body.token
            done()
        } )
        describe( 'GET /api/todos', () => {
            it( 'Should return http 401 at no Authorization', async done => {
                const res = await request.get( `${ url }` )
                    .set( 'Authorization', null )
                    .query( {
                        items: 10,
                        page : 1
                    } )
                expect( res.status ).toBe( 401 )
                expect( res.body.message ).toBe( 'Unauthorized access' )
                done()
            } )
            it( 'Should return http 400 at invalid query params', async done => {
                const res = await request.get( `${ url }` )
                    .set( 'Authorization', token )
                    .query( {
                        items: null,
                        page : 'algo ahi'
                    } )
                expect( res.status ).toBe( 400 )
                expect( res.body.message ).toBe( 'Data integrity error' )
                done()
            } )
            it( 'Should return http 200 at valid query params', async done => {
                const res = await request.get( `${ url }` )
                    .set( 'Authorization', token )
                    .query( {
                        items: 10,
                        page : 1
                    } )
                expect( res.status ).toBe( 200 )
                expect( res.body.message ).toBe( 'Todos list' )
                expect( res.body.response.pagination ).toBeTruthy()
                expect( res.body.response.data ).toBeTruthy()
                expect( res.body.response.data ).toHaveLength( 8 )
                done()
            } )
        } )
        describe( 'GET /api/todos/user/:user [Admin]', () => {
            it( 'Should return http 401 at no Authorization', async done => {
                const res = await request.get( `${ url }/user/${ adminID }` )
                    .set( 'Authorization', null )
                    .query( {
                        items: 10,
                        page : 1
                    } )
                expect( res.status ).toBe( 401 )
                expect( res.body.message ).toBe( 'Unauthorized access' )
                done()
            } )
            it( 'Should return http 400 at invalid query params', async done => {
                const res = await request.get( `${ url }/user/${ adminID }` )
                    .set( 'Authorization', token )
                    .query( {
                        items: null,
                        page : 'algo ahi'
                    } )
                expect( res.status ).toBe( 400 )
                expect( res.body.message ).toBe( 'Data integrity error' )
                done()
            } )
            it( 'Should return http 400 at invalid path params', async done => {
                const res = await request.get( `${ url }/user/sdfawfsadad54654gd6f` )
                    .set( 'Authorization', token )
                    .query( {
                        items: 10,
                        page : 1
                    } )
                expect( res.status ).toBe( 400 )
                expect( res.body.message ).toBe( 'Data integrity error' )
                done()
            } )
            it( 'Should return http 200 at valid params', async done => {
                const res = await request.get( `${ url }/user/${ adminID }` )
                    .set( 'Authorization', token )
                    .query( {
                        items: 10,
                        page : 1
                    } )
                expect( res.status ).toBe( 200 )
                expect( res.body.message ).toBe( 'Todos list' )
                expect( res.body.response.pagination ).toBeTruthy()
                expect( res.body.response.data ).toBeTruthy()
                expect( res.body.response.data ).toHaveLength( 4 )
                done()
            } )
        } )
        describe( 'GET /api/todos/user/:user [User]', () => {
            it( 'Should return http 401 at no Authorization', async done => {
                const res = await request.get( `${ url }/user/${ userID }` )
                    .set( 'Authorization', null )
                    .query( {
                        items: 10,
                        page : 1
                    } )
                expect( res.status ).toBe( 401 )
                expect( res.body.message ).toBe( 'Unauthorized access' )
                done()
            } )
            it( 'Should return http 400 at invalid query params', async done => {
                const res = await request.get( `${ url }/user/${ userID }` )
                    .set( 'Authorization', token )
                    .query( {
                        items: null,
                        page : 'algo ahi'
                    } )
                expect( res.status ).toBe( 400 )
                expect( res.body.message ).toBe( 'Data integrity error' )
                done()
            } )
            it( 'Should return http 400 at invalid path params', async done => {
                const res = await request.get( `${ url }/user/sdfawfsadad54654gd6f` )
                    .set( 'Authorization', token )
                    .query( {
                        items: 10,
                        page : 1
                    } )
                expect( res.status ).toBe( 400 )
                expect( res.body.message ).toBe( 'Data integrity error' )
                done()
            } )
            it( 'Should return http 200 at valid params', async done => {
                const res = await request.get( `${ url }/user/${ userID }` )
                    .set( 'Authorization', token )
                    .query( {
                        items: 10,
                        page : 1
                    } )
                expect( res.status ).toBe( 200 )
                expect( res.body.message ).toBe( 'Todos list' )
                expect( res.body.response.pagination ).toBeTruthy()
                expect( res.body.response.data ).toBeTruthy()
                expect( res.body.response.data ).toHaveLength( 4 )
                done()
            } )
        } )
        describe( 'GET /api/todos/category/:category', () => {
            it( 'Should return http 401 at no Authorization', async done => {
                const res = await request.get( `${ url }/category/${ adminCategory }` )
                    .set( 'Authorization', null )
                    .query( {
                        items: 10,
                        page : 1
                    } )
                expect( res.status ).toBe( 401 )
                expect( res.body.message ).toBe( 'Unauthorized access' )
                done()
            } )
            it( 'Should return http 400 at invalid query params', async done => {
                const res = await request.get( `${ url }/category/${ adminCategory }` )
                    .set( 'Authorization', token )
                    .query( {
                        items: null,
                        page : 'algo ahi'
                    } )
                expect( res.status ).toBe( 400 )
                expect( res.body.message ).toBe( 'Data integrity error' )
                done()
            } )
            it( 'Should return http 400 at invalid path params', async done => {
                const res = await request.get( `${ url }/category/sf546dfds5fg4dgd` )
                    .set( 'Authorization', token )
                    .query( {
                        items: 10,
                        page : 1
                    } )
                expect( res.status ).toBe( 400 )
                expect( res.body.message ).toBe( 'Data integrity error' )
                done()
            } )
            it( 'Should return http 200 at valid params', async done => {
                const res = await request.get( `${ url }/category/${ adminCategory }` )
                    .set( 'Authorization', token )
                    .query( {
                        items: 10,
                        page : 1
                    } )
                expect( res.status ).toBe( 200 )
                expect( res.body.message ).toBe( 'Todos list by category' )
                expect( res.body.response.pagination ).toBeTruthy()
                expect( res.body.response.data ).toBeTruthy()
                expect( res.body.response.data ).toHaveLength( 2 )
                done()
            } )
        } )
        describe( 'GET /api/todos/status/:status', () => {
            it( 'Should return http 401 at no Authorization', async done => {
                const res = await request.get( `${ url }/status/Pending` )
                    .set( 'Authorization', null )
                    .query( {
                        items: 10,
                        page : 1
                    } )
                expect( res.status ).toBe( 401 )
                expect( res.body.message ).toBe( 'Unauthorized access' )
                done()
            } )
            it( 'Should return http 400 at invalid query params', async done => {
                const res = await request.get( `${ url }/status/Pending` )
                    .set( 'Authorization', token )
                    .query( {
                        items: null,
                        page : 'algo ahi'
                    } )
                expect( res.status ).toBe( 400 )
                expect( res.body.message ).toBe( 'Data integrity error' )
                done()
            } )
            it( 'Should return http 400 at invalid path params', async done => {
                const res = await request.get( `${ url }/status/sf546dfds5fg4dgd` )
                    .set( 'Authorization', token )
                    .query( {
                        items: 10,
                        page : 1
                    } )
                expect( res.status ).toBe( 400 )
                expect( res.body.message ).toBe( 'Data integrity error' )
                done()
            } )
            it( 'Should return http 200 at valid params [Pending]', async done => {
                const res = await request.get( `${ url }/status/Pending` )
                    .set( 'Authorization', token )
                    .query( {
                        items: 10,
                        page : 1
                    } )
                expect( res.status ).toBe( 200 )
                expect( res.body.message ).toBe( 'Todos list by status Pending' )
                expect( res.body.response.pagination ).toBeTruthy()
                expect( res.body.response.data ).toBeTruthy()
                expect( res.body.response.data ).toHaveLength( 2 )
                done()
            } )
            it( 'Should return http 200 at valid params [Overdue]', async done => {
                const res = await request.get( `${ url }/status/Overdue` )
                    .set( 'Authorization', token )
                    .query( {
                        items: 10,
                        page : 1
                    } )
                expect( res.status ).toBe( 200 )
                expect( res.body.message ).toBe( 'Todos list by status Overdue' )
                expect( res.body.response.pagination ).toBeTruthy()
                expect( res.body.response.data ).toBeTruthy()
                expect( res.body.response.data ).toHaveLength( 1 )
                done()
            } )
            it( 'Should return http 200 at valid params [Finished]', async done => {
                const res = await request.get( `${ url }/status/Finished` )
                    .set( 'Authorization', token )
                    .query( {
                        items: 10,
                        page : 1
                    } )
                expect( res.status ).toBe( 200 )
                expect( res.body.message ).toBe( 'Todos list by status Finished' )
                expect( res.body.response.pagination ).toBeTruthy()
                expect( res.body.response.data ).toBeTruthy()
                expect( res.body.response.data ).toHaveLength( 1 )
                done()
            } )
        } )
        describe( 'GET /api/todos/date', () => {
            it( 'Should return http 401 at no Authorization', async done => {
                const res = await request.get( `${ url }/date` )
                    .set( 'Authorization', null )
                    .query( {
                        items: 10,
                        page : 1
                    } )
                    .send( {
                        start: new Date().toISOString().substr( 0, 10 )
                    } )
                expect( res.status ).toBe( 401 )
                expect( res.body.message ).toBe( 'Unauthorized access' )
                done()
            } )
            it( 'Should return http 400 at invalid query params', async done => {
                const res = await request.get( `${ url }/date` )
                    .set( 'Authorization', token )
                    .query( {
                        items: null,
                        page : 'algo ahi'
                    } )
                    .send( {
                        start: new Date().toISOString().substr( 0, 10 )
                    } )
                expect( res.status ).toBe( 400 )
                expect( res.body.message ).toBe( 'Data integrity error' )
                done()
            } )
            it( 'Should return http 400 at invalid body', async done => {
                const res = await request.get( `${ url }/date` )
                    .set( 'Authorization', token )
                    .query( {
                        items: 10,
                        page : 1
                    } )
                    .send( {
                        start: null
                    } )
                expect( res.status ).toBe( 400 )
                expect( res.body.message ).toBe( 'Data integrity error' )
                done()
            } )
            it( 'Should return http 400 at invalid date range', async done => {
                const res = await request.get( `${ url }/date` )
                    .set( 'Authorization', token )
                    .query( {
                        items: 10,
                        page : 1
                    } )
                    .send( {
                        start: new Date().toISOString().substr( 0, 10 ),
                        end  : '1990-10-01'
                    } )
                expect( res.status ).toBe( 400 )
                expect( res.body.message ).toBe( 'Data integrity error' )
                done()
            } )
            it( 'Should return http 200 at valid body', async done => {
                const res = await request.get( `${ url }/date` )
                    .set( 'Authorization', token )
                    .query( {
                        items: 10,
                        page : 1
                    } )
                    .send( {
                        start: new Date().toISOString().substr( 0, 10 ),
                        end  : `${ new Date().getFullYear() }` + '-' + (`${ new Date().getMonth() + 1 }` < 10 ? `0${ new Date().getMonth() + 1 }` : `${ new Date().getMonth() + 1 }`) + '-' + (`${ new Date().getDate() + 1 }` < 10 ? `0${ new Date().getDate() + 1 }` : `${ new Date().getDate() + 1 }`)
                    } )
                expect( res.status ).toBe( 200 )
                expect( res.body.message ).toBe( 'Todos list by dates' )
                expect( res.body.response.pagination ).toBeTruthy()
                expect( res.body.response.data ).toBeTruthy()
                expect( res.body.response.data ).toHaveLength( 4 )
                done()
            } )
        } )
        describe( 'POST /api/todos', () => {
            it( 'Should return http 401 at no Authorization', async done => {
                const res = await request.post( `${ url }` )
                    .set( 'Authorization', null )
                    .send( {
                        title   : faker.random.word( 'String' ),
                        category: adminCategory
                    } )
                expect( res.status ).toBe( 401 )
                expect( res.body.message ).toBe( 'Unauthorized access' )
                done()
            } )
            it( 'Should return http 400 at invalid body', async done => {
                const res = await request.post( `${ url }` )
                    .set( 'Authorization', token )
                    .send( {
                        title   : null,
                        category: 'asdasfsa5456789799899898798798798797'
                    } )
                expect( res.status ).toBe( 400 )
                expect( res.body.message ).toBe( 'Data integrity error' )
                done()
            } )
            it( 'Should return http 200 at valid body', async done => {
                const res = await request.post( `${ url }` )
                    .set( 'Authorization', token )
                    .send( {
                        title   : faker.random.word( 'String' ),
                        category: adminCategory
                    } )
                expect( res.status ).toBe( 200 )
                expect( res.body.message ).toBe( 'Todo created successfully' )
                done()
            } )
            it( 'Should return http 200 at valid params and new todo created', async done => {
                const res = await request.get( `${ url }/user/${ adminID }` )
                    .set( 'Authorization', token )
                    .query( {
                        items: 10,
                        page : 1
                    } )
                expect( res.status ).toBe( 200 )
                expect( res.body.message ).toBe( 'Todos list' )
                expect( res.body.response.pagination ).toBeTruthy()
                expect( res.body.response.data ).toBeTruthy()
                expect( res.body.response.data ).toHaveLength( 5 )
                id = res.body.response.data[4]._id
                done()
            } )
        } )
        describe( 'PUT /api/todos', () => {
            it( 'Should return http 401 at no Authorization', async done => {
                const res = await request.put( `${ url }` )
                    .set( 'Authorization', null )
                    .send( {
                        id,
                        title   : faker.random.word( 'String' ),
                        category: adminCategory,
                        status  : 'Pending'
                    } )
                expect( res.status ).toBe( 401 )
                expect( res.body.message ).toBe( 'Unauthorized access' )
                done()
            } )
            it( 'Should return http 400 at invalid body', async done => {
                const res = await request.put( `${ url }` )
                    .set( 'Authorization', token )
                    .send( {
                        id      : null,
                        title   : null,
                        category: null,
                        status  : null
                    } )
                expect( res.status ).toBe( 400 )
                expect( res.body.message ).toBe( 'Data integrity error' )
                done()
            } )
            it( 'Should return http 200 at valid body', async done => {
                const res = await request.put( `${ url }` )
                    .set( 'Authorization', token )
                    .send( {
                        id,
                        title   : faker.random.word( 'String' ),
                        category: adminCategory,
                        status  : 'Pending'
                    } )
                expect( res.status ).toBe( 200 )
                expect( res.body.message ).toBe( 'Todo updated successfully' )
                done()
            } )
        } )
        describe( 'PUT /api/todos/status', () => {
            it( 'Should return http 401 at no Authorization', async done => {
                const res = await request.put( `${ url }/status` )
                    .set( 'Authorization', null )
                    .send( {
                        id,
                        status: 'Overdue'
                    } )
                expect( res.status ).toBe( 401 )
                expect( res.body.message ).toBe( 'Unauthorized access' )
                done()
            } )
            it( 'Should return http 400 at invalid body', async done => {
                const res = await request.put( `${ url }/status` )
                    .set( 'Authorization', token )
                    .send( {
                        id    : null,
                        status: null
                    } )
                expect( res.status ).toBe( 400 )
                expect( res.body.message ).toBe( 'Data integrity error' )
                done()
            } )
            it( 'Should return http 200 at valid body [Overdue]', async done => {
                const res = await request.put( `${ url }/status` )
                    .set( 'Authorization', token )
                    .send( {
                        id,
                        status: 'Overdue'
                    } )
                expect( res.status ).toBe( 200 )
                expect( res.body.message ).toBe( 'Todo updated successfully' )
                done()
            } )
            it( 'Should return http 200 at valid body [Finished]', async done => {
                const res = await request.put( `${ url }/status` )
                    .set( 'Authorization', token )
                    .send( {
                        id,
                        status: 'Finished'
                    } )
                expect( res.status ).toBe( 200 )
                expect( res.body.message ).toBe( 'Todo updated successfully' )
                done()
            } )
        } )
        describe( 'DELETE /api/todos/status', () => {
            it( 'Should return http 401 at no Authorization', async done => {
                const res = await request.delete( `${ url }` )
                    .set( 'Authorization', null )
                    .send( {
                        id
                    } )
                expect( res.status ).toBe( 401 )
                expect( res.body.message ).toBe( 'Unauthorized access' )
                done()
            } )
            it( 'Should return http 400 at invalid body', async done => {
                const res = await request.delete( `${ url }` )
                    .set( 'Authorization', token )
                    .send( {
                        id: null
                    } )
                expect( res.status ).toBe( 400 )
                expect( res.body.message ).toBe( 'Data integrity error' )
                done()
            } )
            it( 'Should return http 200 at valid body [Overdue]', async done => {
                const res = await request.delete( `${ url }` )
                    .set( 'Authorization', token )
                    .send( {
                        id
                    } )
                expect( res.status ).toBe( 200 )
                expect( res.body.message ).toBe( 'Todo deleted successfully' )
                done()
            } )
        } )
    } )
    describe( 'ANY USER', () => {
        it( 'Should login admin user successfully', async done => {
            const res = await request.post( '/api/users/sing/in' )
                .send( {
                    email   : 'user1@todos.com',
                    password: '123456789'
                } )
            expect( res.body.token ).toBeTruthy()
            token = res.body.token
            done()
        } )
        describe( 'GET /api/todos', () => {
            it( 'Should return http 401 at no Authorization', async done => {
                const res = await request.get( `${ url }` )
                    .set( 'Authorization', null )
                    .query( {
                        items: 10,
                        page : 1
                    } )
                expect( res.status ).toBe( 401 )
                expect( res.body.message ).toBe( 'Unauthorized access' )
                done()
            } )
            it( 'Should return http 403 at valid rol', async done => {
                const res = await request.get( `${ url }` )
                    .set( 'Authorization', token )
                    .query( {
                        items: 10,
                        page : 1
                    } )
                expect( res.status ).toBe( 403 )
                expect( res.body.message ).toBe( 'Forbidden access' )
                done()
            } )
        } )
        describe( 'GET /api/todos/user/:user [Admin]', () => {
            it( 'Should return http 401 at no Authorization', async done => {
                const res = await request.get( `${ url }/user/${ adminID }` )
                    .set( 'Authorization', null )
                    .query( {
                        items: 10,
                        page : 1
                    } )
                expect( res.status ).toBe( 401 )
                expect( res.body.message ).toBe( 'Unauthorized access' )
                done()
            } )
            it( 'Should return http 400 at invalid query params', async done => {
                const res = await request.get( `${ url }/user/${ adminID }` )
                    .set( 'Authorization', token )
                    .query( {
                        items: null,
                        page : 'algo ahi'
                    } )
                expect( res.status ).toBe( 400 )
                expect( res.body.message ).toBe( 'Data integrity error' )
                done()
            } )
            it( 'Should return http 400 at invalid path params', async done => {
                const res = await request.get( `${ url }/user/sdfawfsadad54654gd6f` )
                    .set( 'Authorization', token )
                    .query( {
                        items: 10,
                        page : 1
                    } )
                expect( res.status ).toBe( 400 )
                expect( res.body.message ).toBe( 'Data integrity error' )
                done()
            } )
            it( 'Should return http 403 at user task admin', async done => {
                const res = await request.get( `${ url }/user/${ adminID }` )
                    .set( 'Authorization', token )
                    .query( {
                        items: 10,
                        page : 1
                    } )
                expect( res.status ).toBe( 403 )
                expect( res.body.message ).toBe( 'Forbidden access' )
                done()
            } )
        } )
        describe( 'GET /api/todos/user/:user [User]', () => {
            it( 'Should return http 401 at no Authorization', async done => {
                const res = await request.get( `${ url }/user/${ userID }` )
                    .set( 'Authorization', null )
                    .query( {
                        items: 10,
                        page : 1
                    } )
                expect( res.status ).toBe( 401 )
                expect( res.body.message ).toBe( 'Unauthorized access' )
                done()
            } )
            it( 'Should return http 400 at invalid query params', async done => {
                const res = await request.get( `${ url }/user/${ userID }` )
                    .set( 'Authorization', token )
                    .query( {
                        items: null,
                        page : 'algo ahi'
                    } )
                expect( res.status ).toBe( 400 )
                expect( res.body.message ).toBe( 'Data integrity error' )
                done()
            } )
            it( 'Should return http 400 at invalid path params', async done => {
                const res = await request.get( `${ url }/user/sdfawfsadad54654gd6f` )
                    .set( 'Authorization', token )
                    .query( {
                        items: 10,
                        page : 1
                    } )
                expect( res.status ).toBe( 400 )
                expect( res.body.message ).toBe( 'Data integrity error' )
                done()
            } )
            it( 'Should return http 200 at valid params', async done => {
                const res = await request.get( `${ url }/user/${ userID }` )
                    .set( 'Authorization', token )
                    .query( {
                        items: 10,
                        page : 1
                    } )
                expect( res.status ).toBe( 200 )
                expect( res.body.message ).toBe( 'Todos list' )
                expect( res.body.response.pagination ).toBeTruthy()
                expect( res.body.response.data ).toBeTruthy()
                expect( res.body.response.data ).toHaveLength( 4 )
                done()
            } )
        } )
        describe( 'GET /api/todos/category/:category', () => {
            it( 'Should return http 401 at no Authorization', async done => {
                const res = await request.get( `${ url }/category/${ userCategory }` )
                    .set( 'Authorization', null )
                    .query( {
                        items: 10,
                        page : 1
                    } )
                expect( res.status ).toBe( 401 )
                expect( res.body.message ).toBe( 'Unauthorized access' )
                done()
            } )
            it( 'Should return http 400 at invalid query params', async done => {
                const res = await request.get( `${ url }/category/${ userCategory }` )
                    .set( 'Authorization', token )
                    .query( {
                        items: null,
                        page : 'algo ahi'
                    } )
                expect( res.status ).toBe( 400 )
                expect( res.body.message ).toBe( 'Data integrity error' )
                done()
            } )
            it( 'Should return http 400 at invalid path params', async done => {
                const res = await request.get( `${ url }/category/sf546dfds5fg4dgd` )
                    .set( 'Authorization', token )
                    .query( {
                        items: 10,
                        page : 1
                    } )
                expect( res.status ).toBe( 400 )
                expect( res.body.message ).toBe( 'Data integrity error' )
                done()
            } )
            it( 'Should return http 200 at valid params', async done => {
                const res = await request.get( `${ url }/category/${ userCategory }` )
                    .set( 'Authorization', token )
                    .query( {
                        items: 10,
                        page : 1
                    } )
                expect( res.status ).toBe( 200 )
                expect( res.body.message ).toBe( 'Todos list by category' )
                expect( res.body.response.pagination ).toBeTruthy()
                expect( res.body.response.data ).toBeTruthy()
                expect( res.body.response.data ).toHaveLength( 1 )
                done()
            } )
        } )
        describe( 'GET /api/todos/status/:status', () => {
            it( 'Should return http 401 at no Authorization', async done => {
                const res = await request.get( `${ url }/status/Pending` )
                    .set( 'Authorization', null )
                    .query( {
                        items: 10,
                        page : 1
                    } )
                expect( res.status ).toBe( 401 )
                expect( res.body.message ).toBe( 'Unauthorized access' )
                done()
            } )
            it( 'Should return http 400 at invalid query params', async done => {
                const res = await request.get( `${ url }/status/Pending` )
                    .set( 'Authorization', token )
                    .query( {
                        items: null,
                        page : 'algo ahi'
                    } )
                expect( res.status ).toBe( 400 )
                expect( res.body.message ).toBe( 'Data integrity error' )
                done()
            } )
            it( 'Should return http 400 at invalid path params', async done => {
                const res = await request.get( `${ url }/status/sf546dfds5fg4dgd` )
                    .set( 'Authorization', token )
                    .query( {
                        items: 10,
                        page : 1
                    } )
                expect( res.status ).toBe( 400 )
                expect( res.body.message ).toBe( 'Data integrity error' )
                done()
            } )
            it( 'Should return http 200 at valid params [Pending]', async done => {
                const res = await request.get( `${ url }/status/Pending` )
                    .set( 'Authorization', token )
                    .query( {
                        items: 10,
                        page : 1
                    } )
                expect( res.status ).toBe( 200 )
                expect( res.body.message ).toBe( 'Todos list by status Pending' )
                expect( res.body.response.pagination ).toBeTruthy()
                expect( res.body.response.data ).toBeTruthy()
                expect( res.body.response.data ).toHaveLength( 2 )
                done()
            } )
            it( 'Should return http 200 at valid params [Overdue]', async done => {
                const res = await request.get( `${ url }/status/Overdue` )
                    .set( 'Authorization', token )
                    .query( {
                        items: 10,
                        page : 1
                    } )
                expect( res.status ).toBe( 200 )
                expect( res.body.message ).toBe( 'Todos list by status Overdue' )
                expect( res.body.response.pagination ).toBeTruthy()
                expect( res.body.response.data ).toBeTruthy()
                expect( res.body.response.data ).toHaveLength( 1 )
                done()
            } )
            it( 'Should return http 200 at valid params [Finished]', async done => {
                const res = await request.get( `${ url }/status/Finished` )
                    .set( 'Authorization', token )
                    .query( {
                        items: 10,
                        page : 1
                    } )
                expect( res.status ).toBe( 200 )
                expect( res.body.message ).toBe( 'Todos list by status Finished' )
                expect( res.body.response.pagination ).toBeTruthy()
                expect( res.body.response.data ).toBeTruthy()
                expect( res.body.response.data ).toHaveLength( 1 )
                done()
            } )
        } )
        describe( 'GET /api/todos/date', () => {
            it( 'Should return http 401 at no Authorization', async done => {
                const res = await request.get( `${ url }/date` )
                    .set( 'Authorization', null )
                    .query( {
                        items: 10,
                        page : 1
                    } )
                    .send( {
                        start: new Date().toISOString().substr( 0, 10 )
                    } )
                expect( res.status ).toBe( 401 )
                expect( res.body.message ).toBe( 'Unauthorized access' )
                done()
            } )
            it( 'Should return http 400 at invalid query params', async done => {
                const res = await request.get( `${ url }/date` )
                    .set( 'Authorization', token )
                    .query( {
                        items: null,
                        page : 'algo ahi'
                    } )
                    .send( {
                        start: new Date().toISOString().substr( 0, 10 )
                    } )
                expect( res.status ).toBe( 400 )
                expect( res.body.message ).toBe( 'Data integrity error' )
                done()
            } )
            it( 'Should return http 400 at invalid body', async done => {
                const res = await request.get( `${ url }/date` )
                    .set( 'Authorization', token )
                    .query( {
                        items: 10,
                        page : 1
                    } )
                    .send( {
                        start: null
                    } )
                expect( res.status ).toBe( 400 )
                expect( res.body.message ).toBe( 'Data integrity error' )
                done()
            } )
            it( 'Should return http 400 at invalid date range', async done => {
                const res = await request.get( `${ url }/date` )
                    .set( 'Authorization', token )
                    .query( {
                        items: 10,
                        page : 1
                    } )
                    .send( {
                        start: new Date().toISOString().substr( 0, 10 ),
                        end  : '1990-10-01'
                    } )
                expect( res.status ).toBe( 400 )
                expect( res.body.message ).toBe( 'Data integrity error' )
                done()
            } )
            it( 'Should return http 200 at valid body', async done => {
                const res = await request.get( `${ url }/date` )
                    .set( 'Authorization', token )
                    .query( {
                        items: 10,
                        page : 1
                    } )
                    .send( {
                        start: new Date().toISOString().substr( 0, 10 ),
                        end  : `${ new Date().getFullYear() }` + '-' + (`${ new Date().getMonth() + 1 }` < 10 ? `0${ new Date().getMonth() + 1 }` : `${ new Date().getMonth() + 1 }`) + '-' + (`${ new Date().getDate() + 1 }` < 10 ? `0${ new Date().getDate() + 1 }` : `${ new Date().getDate() + 1 }`)
                    } )
                expect( res.status ).toBe( 200 )
                expect( res.body.message ).toBe( 'Todos list by dates' )
                expect( res.body.response.pagination ).toBeTruthy()
                expect( res.body.response.data ).toBeTruthy()
                expect( res.body.response.data ).toHaveLength( 4 )
                done()
            } )
        } )
        describe( 'POST /api/todos', () => {
            it( 'Should return http 401 at no Authorization', async done => {
                const res = await request.post( `${ url }` )
                    .set( 'Authorization', null )
                    .send( {
                        title   : faker.random.word( 'String' ),
                        category: adminCategory
                    } )
                expect( res.status ).toBe( 401 )
                expect( res.body.message ).toBe( 'Unauthorized access' )
                done()
            } )
            it( 'Should return http 400 at invalid body', async done => {
                const res = await request.post( `${ url }` )
                    .set( 'Authorization', token )
                    .send( {
                        title   : null,
                        category: 'asdasfsa5456789799899898798798798797'
                    } )
                expect( res.status ).toBe( 400 )
                expect( res.body.message ).toBe( 'Data integrity error' )
                done()
            } )
            it( 'Should return http 200 at valid body', async done => {
                const res = await request.post( `${ url }` )
                    .set( 'Authorization', token )
                    .send( {
                        title   : faker.random.word( 'String' ),
                        category: adminCategory
                    } )
                expect( res.status ).toBe( 200 )
                expect( res.body.message ).toBe( 'Todo created successfully' )
                done()
            } )
            it( 'Should return http 200 at valid params and new todo created', async done => {
                const res = await request.get( `${ url }/user/${ userID }` )
                    .set( 'Authorization', token )
                    .query( {
                        items: 10,
                        page : 1
                    } )
                expect( res.status ).toBe( 200 )
                expect( res.body.message ).toBe( 'Todos list' )
                expect( res.body.response.pagination ).toBeTruthy()
                expect( res.body.response.data ).toBeTruthy()
                expect( res.body.response.data ).toHaveLength( 5 )
                id = res.body.response.data[4]._id
                done()
            } )
        } )
        describe( 'PUT /api/todos', () => {
            it( 'Should return http 401 at no Authorization', async done => {
                const res = await request.put( `${ url }` )
                    .set( 'Authorization', null )
                    .send( {
                        id,
                        title   : faker.random.word( 'String' ),
                        category: userCategory,
                        status  : 'Pending'
                    } )
                expect( res.status ).toBe( 401 )
                expect( res.body.message ).toBe( 'Unauthorized access' )
                done()
            } )
            it( 'Should return http 400 at invalid body', async done => {
                const res = await request.put( `${ url }` )
                    .set( 'Authorization', token )
                    .send( {
                        id      : null,
                        title   : null,
                        category: null,
                        status  : null
                    } )
                expect( res.status ).toBe( 400 )
                expect( res.body.message ).toBe( 'Data integrity error' )
                done()
            } )
            it( 'Should return http 200 at valid body', async done => {
                const res = await request.put( `${ url }` )
                    .set( 'Authorization', token )
                    .send( {
                        id,
                        title   : faker.random.word( 'String' ),
                        category: userCategory,
                        status  : 'Pending'
                    } )
                expect( res.status ).toBe( 200 )
                expect( res.body.message ).toBe( 'Todo updated successfully' )
                done()
            } )
        } )
        describe( 'PUT /api/todos/status', () => {
            it( 'Should return http 401 at no Authorization', async done => {
                const res = await request.put( `${ url }/status` )
                    .set( 'Authorization', null )
                    .send( {
                        id,
                        status: 'Overdue'
                    } )
                expect( res.status ).toBe( 401 )
                expect( res.body.message ).toBe( 'Unauthorized access' )
                done()
            } )
            it( 'Should return http 400 at invalid body', async done => {
                const res = await request.put( `${ url }/status` )
                    .set( 'Authorization', token )
                    .send( {
                        id    : null,
                        status: null
                    } )
                expect( res.status ).toBe( 400 )
                expect( res.body.message ).toBe( 'Data integrity error' )
                done()
            } )
            it( 'Should return http 200 at valid body [Overdue]', async done => {
                const res = await request.put( `${ url }/status` )
                    .set( 'Authorization', token )
                    .send( {
                        id,
                        status: 'Overdue'
                    } )
                expect( res.status ).toBe( 200 )
                expect( res.body.message ).toBe( 'Todo updated successfully' )
                done()
            } )
            it( 'Should return http 200 at valid body [Finished]', async done => {
                const res = await request.put( `${ url }/status` )
                    .set( 'Authorization', token )
                    .send( {
                        id,
                        status: 'Finished'
                    } )
                expect( res.status ).toBe( 200 )
                expect( res.body.message ).toBe( 'Todo updated successfully' )
                done()
            } )
        } )
        describe( 'DELETE /api/todos/status', () => {
            it( 'Should return http 401 at no Authorization', async done => {
                const res = await request.delete( `${ url }` )
                    .set( 'Authorization', null )
                    .send( {
                        id
                    } )
                expect( res.status ).toBe( 401 )
                expect( res.body.message ).toBe( 'Unauthorized access' )
                done()
            } )
            it( 'Should return http 400 at invalid body', async done => {
                const res = await request.delete( `${ url }` )
                    .set( 'Authorization', token )
                    .send( {
                        id: null
                    } )
                expect( res.status ).toBe( 400 )
                expect( res.body.message ).toBe( 'Data integrity error' )
                done()
            } )
            it( 'Should return http 200 at valid body [Overdue]', async done => {
                const res = await request.delete( `${ url }` )
                    .set( 'Authorization', token )
                    .send( {
                        id
                    } )
                expect( res.status ).toBe( 200 )
                expect( res.body.message ).toBe( 'Todo deleted successfully' )
                done()
            } )
        } )
    } )
} )
