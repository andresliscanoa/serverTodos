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
            expect( res.body.response.token ).toBeTruthy()
            token = res.body.response.token
            done()
        } )
        describe( 'GET /api/todos/dash [Admin]', () => {
            it( 'Should return http 401 at no Authorization', async done => {
                const res = await request.get( `${ url }/dash` )
                    .set( 'Authorization', null )
                    .query( {
                        user: adminID
                    } )
                expect( res.status ).toBe( 401 )
                expect( res.body.message ).toBe( 'Unauthorized access' )
                done()
            } )
            it( 'Should return http 400 at invalid query params', async done => {
                const res = await request.get( `${ url }/dash` )
                    .set( 'Authorization', token )
                    .query( {
                        user: 'askjjk'
                    } )
                expect( res.status ).toBe( 400 )
                expect( res.body.message ).toBe( 'Data integrity error' )
                done()
            } )
            it( 'Should return http 200 at valid query params', async done => {
                const res = await request.get( `${ url }/dash` )
                    .set( 'Authorization', token )
                    .query( {
                        user: adminID
                    } )
                expect( res.status ).toBe( 200 )
                expect( res.body.message ).toBe( 'Todos dashboard' )
                expect( res.body.response ).toBeTruthy()
                expect( res.body.response ).toHaveLength( 3 )
                done()
            } )
        } )
        describe( 'GET /api/todos/dash [User]', () => {
            it( 'Should return http 401 at no Authorization', async done => {
                const res = await request.get( `${ url }/dash` )
                    .set( 'Authorization', null )
                    .query( {
                        user: userID
                    } )
                expect( res.status ).toBe( 401 )
                expect( res.body.message ).toBe( 'Unauthorized access' )
                done()
            } )
            it( 'Should return http 400 at invalid query params', async done => {
                const res = await request.get( `${ url }/dash` )
                    .set( 'Authorization', token )
                    .query( {
                        user: 'askjjk'
                    } )
                expect( res.status ).toBe( 400 )
                expect( res.body.message ).toBe( 'Data integrity error' )
                done()
            } )
            it( 'Should return http 200 at valid query params', async done => {
                const res = await request.get( `${ url }/dash` )
                    .set( 'Authorization', token )
                    .query( {
                        user: userID
                    } )
                expect( res.status ).toBe( 200 )
                expect( res.body.message ).toBe( 'Todos dashboard' )
                expect( res.body.response ).toBeTruthy()
                expect( res.body.response ).toHaveLength( 3 )
                done()
            } )
        } )
        describe( 'GET /api/todos [items, page]', () => {
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
                expect( res.body.message ).toBe( 'Todos list by filters' )
                expect( res.body.response.pagination ).toBeTruthy()
                expect( res.body.response.data ).toBeTruthy()
                expect( res.body.response.data ).toHaveLength( 8 )
                done()
            } )
        } )
        describe( 'GET /api/todos [items, page, user - Admin]', () => {
            it( 'Should return http 401 at no Authorization', async done => {
                const res = await request.get( `${ url }` )
                    .set( 'Authorization', null )
                    .query( {
                        items: 10,
                        page : 1,
                        user : adminID
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
                        page : 'algo ahi',
                        user : '54654sdsdsadassafasfasfase54654'
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
                        page : 1,
                        user : adminID
                    } )
                expect( res.status ).toBe( 200 )
                expect( res.body.message ).toBe( 'Todos list by filters' )
                expect( res.body.response.pagination ).toBeTruthy()
                expect( res.body.response.data ).toBeTruthy()
                expect( res.body.response.data ).toHaveLength( 4 )
                done()
            } )
        } )
        describe( 'GET /api/todos [items, page, user - User]', () => {
            it( 'Should return http 401 at no Authorization', async done => {
                const res = await request.get( `${ url }` )
                    .set( 'Authorization', null )
                    .query( {
                        items: 10,
                        page : 1,
                        user : userID
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
                        page : 'algo ahi',
                        user : '54654sdsdsadassafasfasfase54654'
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
                        page : 1,
                        user : userID
                    } )
                expect( res.status ).toBe( 200 )
                expect( res.body.message ).toBe( 'Todos list by filters' )
                expect( res.body.response.pagination ).toBeTruthy()
                expect( res.body.response.data ).toBeTruthy()
                expect( res.body.response.data ).toHaveLength( 4 )
                done()
            } )
        } )
        describe( 'GET /api/todos [items, page, category - Admin]', () => {
            it( 'Should return http 401 at no Authorization', async done => {
                const res = await request.get( `${ url }` )
                    .set( 'Authorization', null )
                    .query( {
                        items   : 10,
                        page    : 1,
                        category: adminCategory
                    } )
                expect( res.status ).toBe( 401 )
                expect( res.body.message ).toBe( 'Unauthorized access' )
                done()
            } )
            it( 'Should return http 400 at invalid query params', async done => {
                const res = await request.get( `${ url }` )
                    .set( 'Authorization', token )
                    .query( {
                        items   : null,
                        page    : 'algo ahi',
                        category: '54654sdsdsadassafasfasfase54654'
                    } )
                expect( res.status ).toBe( 400 )
                expect( res.body.message ).toBe( 'Data integrity error' )
                done()
            } )
            it( 'Should return http 200 at valid query params', async done => {
                const res = await request.get( `${ url }` )
                    .set( 'Authorization', token )
                    .query( {
                        items   : 10,
                        page    : 1,
                        category: adminCategory
                    } )
                expect( res.status ).toBe( 200 )
                expect( res.body.message ).toBe( 'Todos list by filters' )
                expect( res.body.response.pagination ).toBeTruthy()
                expect( res.body.response.data ).toBeTruthy()
                expect( res.body.response.data ).toHaveLength( 2 )
                done()
            } )
        } )
        describe( 'GET /api/todos [items, page, category - User]', () => {
            it( 'Should return http 401 at no Authorization', async done => {
                const res = await request.get( `${ url }` )
                    .set( 'Authorization', null )
                    .query( {
                        items   : 10,
                        page    : 1,
                        category: userCategory
                    } )
                expect( res.status ).toBe( 401 )
                expect( res.body.message ).toBe( 'Unauthorized access' )
                done()
            } )
            it( 'Should return http 400 at invalid query params', async done => {
                const res = await request.get( `${ url }` )
                    .set( 'Authorization', token )
                    .query( {
                        items   : null,
                        page    : 'algo ahi',
                        category: '54654sdsdsadassafasfasfase54654'
                    } )
                expect( res.status ).toBe( 400 )
                expect( res.body.message ).toBe( 'Data integrity error' )
                done()
            } )
            it( 'Should return http 200 at valid query params', async done => {
                const res = await request.get( `${ url }` )
                    .set( 'Authorization', token )
                    .query( {
                        items   : 10,
                        page    : 1,
                        category: userCategory
                    } )
                expect( res.status ).toBe( 200 )
                expect( res.body.message ).toBe( 'Todos list by filters' )
                expect( res.body.response.pagination ).toBeTruthy()
                expect( res.body.response.data ).toBeTruthy()
                expect( res.body.response.data ).toHaveLength( 1 )
                done()
            } )
        } )
        describe( 'GET /api/todos [items, page, status - Pending]', () => {
            it( 'Should return http 401 at no Authorization', async done => {
                const res = await request.get( `${ url }` )
                    .set( 'Authorization', null )
                    .query( {
                        items : 10,
                        page  : 1,
                        status: 'Pending'
                    } )
                expect( res.status ).toBe( 401 )
                expect( res.body.message ).toBe( 'Unauthorized access' )
                done()
            } )
            it( 'Should return http 400 at invalid query params', async done => {
                const res = await request.get( `${ url }` )
                    .set( 'Authorization', token )
                    .query( {
                        items : null,
                        page  : 'algo ahi',
                        status: '54654sdsdsadassafasfasfase54654'
                    } )
                expect( res.status ).toBe( 400 )
                expect( res.body.message ).toBe( 'Data integrity error' )
                done()
            } )
            it( 'Should return http 200 at valid query params', async done => {
                const res = await request.get( `${ url }` )
                    .set( 'Authorization', token )
                    .query( {
                        items : 10,
                        page  : 1,
                        status: 'Pending'
                    } )
                expect( res.status ).toBe( 200 )
                expect( res.body.message ).toBe( 'Todos list by filters' )
                expect( res.body.response.pagination ).toBeTruthy()
                expect( res.body.response.data ).toBeTruthy()
                expect( res.body.response.data ).toHaveLength( 4 )
                done()
            } )
        } )
        describe( 'GET /api/todos [items, page, status - Overdue]', () => {
            it( 'Should return http 401 at no Authorization', async done => {
                const res = await request.get( `${ url }` )
                    .set( 'Authorization', null )
                    .query( {
                        items : 10,
                        page  : 1,
                        status: 'Overdue'
                    } )
                expect( res.status ).toBe( 401 )
                expect( res.body.message ).toBe( 'Unauthorized access' )
                done()
            } )
            it( 'Should return http 400 at invalid query params', async done => {
                const res = await request.get( `${ url }` )
                    .set( 'Authorization', token )
                    .query( {
                        items : null,
                        page  : 'algo ahi',
                        status: '54654sdsdsadassafasfasfase54654'
                    } )
                expect( res.status ).toBe( 400 )
                expect( res.body.message ).toBe( 'Data integrity error' )
                done()
            } )
            it( 'Should return http 200 at valid query params', async done => {
                const res = await request.get( `${ url }` )
                    .set( 'Authorization', token )
                    .query( {
                        items : 10,
                        page  : 1,
                        status: 'Overdue'
                    } )
                expect( res.status ).toBe( 200 )
                expect( res.body.message ).toBe( 'Todos list by filters' )
                expect( res.body.response.pagination ).toBeTruthy()
                expect( res.body.response.data ).toBeTruthy()
                expect( res.body.response.data ).toHaveLength( 2 )
                done()
            } )
        } )
        describe( 'GET /api/todos [items, page, status - Finished]', () => {
            it( 'Should return http 401 at no Authorization', async done => {
                const res = await request.get( `${ url }` )
                    .set( 'Authorization', null )
                    .query( {
                        items : 10,
                        page  : 1,
                        status: 'Finished'
                    } )
                expect( res.status ).toBe( 401 )
                expect( res.body.message ).toBe( 'Unauthorized access' )
                done()
            } )
            it( 'Should return http 400 at invalid query params', async done => {
                const res = await request.get( `${ url }` )
                    .set( 'Authorization', token )
                    .query( {
                        items : null,
                        page  : 'algo ahi',
                        status: '54654sdsdsadassafasfasfase54654'
                    } )
                expect( res.status ).toBe( 400 )
                expect( res.body.message ).toBe( 'Data integrity error' )
                done()
            } )
            it( 'Should return http 200 at valid query params', async done => {
                const res = await request.get( `${ url }` )
                    .set( 'Authorization', token )
                    .query( {
                        items : 10,
                        page  : 1,
                        status: 'Finished'
                    } )
                expect( res.status ).toBe( 200 )
                expect( res.body.message ).toBe( 'Todos list by filters' )
                expect( res.body.response.pagination ).toBeTruthy()
                expect( res.body.response.data ).toBeTruthy()
                expect( res.body.response.data ).toHaveLength( 2 )
                done()
            } )
        } )
        describe( 'GET /api/todos [items, page, start]', () => {
            it( 'Should return http 401 at no Authorization', async done => {
                const res = await request.get( `${ url }` )
                    .set( 'Authorization', null )
                    .query( {
                        items: 10,
                        page : 1,
                        start: new Date().toISOString().substr( 0, 10 )
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
                        page : 'algo ahi',
                        start: null
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
                        page : 1,
                        start: new Date().toISOString().substr( 0, 10 )
                    } )
                expect( res.status ).toBe( 200 )
                expect( res.body.message ).toBe( 'Todos list by filters' )
                expect( res.body.response.pagination ).toBeTruthy()
                expect( res.body.response.data ).toBeTruthy()
                expect( res.body.response.data ).toHaveLength( 8 )
                done()
            } )
        } )
        describe( 'GET /api/todos [items, page, end]', () => {
            it( 'Should return http 401 at no Authorization', async done => {
                const res = await request.get( `${ url }` )
                    .set( 'Authorization', null )
                    .query( {
                        items: 10,
                        page : 1,
                        end  : `${ new Date().getFullYear() }` + '-' + (`${ new Date().getMonth() + 1 }` < 10 ? `0${ new Date().getMonth() + 1 }` : `${ new Date().getMonth() + 1 }`) + '-' + (`${ new Date().getDate() + 1 }` < 10 ? `0${ new Date().getDate() + 1 }` : `${ new Date().getDate() + 1 }`)
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
                        page : 'algo ahi',
                        end  : null
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
                        page : 1,
                        end  : `${ new Date().getFullYear() }` + '-' + (`${ new Date().getMonth() + 1 }` < 10 ? `0${ new Date().getMonth() + 1 }` : `${ new Date().getMonth() + 1 }`) + '-' + (`${ new Date().getDate() + 1 }` < 10 ? `0${ new Date().getDate() + 1 }` : `${ new Date().getDate() + 1 }`)
                    } )
                expect( res.status ).toBe( 200 )
                expect( res.body.message ).toBe( 'Todos list by filters' )
                expect( res.body.response.pagination ).toBeTruthy()
                expect( res.body.response.data ).toBeTruthy()
                expect( res.body.response.data ).toHaveLength( 8 )
                done()
            } )
        } )
        describe( 'GET /api/todos [items, page, start, end]', () => {
            it( 'Should return http 401 at no Authorization', async done => {
                const res = await request.get( `${ url }` )
                    .set( 'Authorization', null )
                    .query( {
                        items: 10,
                        page : 1,
                        start: new Date().toISOString().substr( 0, 10 ),
                        end  : `${ new Date().getFullYear() }` + '-' + (`${ new Date().getMonth() + 1 }` < 10 ? `0${ new Date().getMonth() + 1 }` : `${ new Date().getMonth() + 1 }`) + '-' + (`${ new Date().getDate() + 1 }` < 10 ? `0${ new Date().getDate() + 1 }` : `${ new Date().getDate() + 1 }`)
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
                        page : 'algo ahi',
                        end  : null
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
                        page : 1,
                        start: new Date().toISOString().substr( 0, 10 ),
                        end  : `${ new Date().getFullYear() }` + '-' + (`${ new Date().getMonth() + 1 }` < 10 ? `0${ new Date().getMonth() + 1 }` : `${ new Date().getMonth() + 1 }`) + '-' + (`${ new Date().getDate() + 1 }` < 10 ? `0${ new Date().getDate() + 1 }` : `${ new Date().getDate() + 1 }`)
                    } )
                expect( res.status ).toBe( 200 )
                expect( res.body.message ).toBe( 'Todos list by filters' )
                expect( res.body.response.pagination ).toBeTruthy()
                expect( res.body.response.data ).toBeTruthy()
                expect( res.body.response.data ).toHaveLength( 8 )
                done()
            } )
        } )
        describe( 'GET /api/todos [items, page, user, status, category, start, end]', () => {
            it( 'Should return http 401 at no Authorization', async done => {
                const res = await request.get( `${ url }` )
                    .set( 'Authorization', null )
                    .query( {
                        items   : 10,
                        page    : 1,
                        user    : adminID,
                        category: adminCategory,
                        status  : 'Overdue',
                        start   : new Date().toISOString().substr( 0, 10 ),
                        end     : `${ new Date().getFullYear() }` + '-' + (`${ new Date().getMonth() + 1 }` < 10 ? `0${ new Date().getMonth() + 1 }` : `${ new Date().getMonth() + 1 }`) + '-' + (`${ new Date().getDate() + 1 }` < 10 ? `0${ new Date().getDate() + 1 }` : `${ new Date().getDate() + 1 }`)
                    } )
                expect( res.status ).toBe( 401 )
                expect( res.body.message ).toBe( 'Unauthorized access' )
                done()
            } )
            it( 'Should return http 400 at invalid query params', async done => {
                const res = await request.get( `${ url }` )
                    .set( 'Authorization', token )
                    .query( {
                        items   : null,
                        page    : 'algo ahi',
                        user    : 'sdasfasf',
                        category: 'adsasa',
                        status  : 'algo',
                        start   : null,
                        end     : null
                    } )
                expect( res.status ).toBe( 400 )
                expect( res.body.message ).toBe( 'Data integrity error' )
                done()
            } )
            it( 'Should return http 200 at valid query params', async done => {
                const res = await request.get( `${ url }` )
                    .set( 'Authorization', token )
                    .query( {
                        items   : 10,
                        page    : 1,
                        user    : adminID,
                        category: adminCategory,
                        status  : 'Overdue',
                        start   : new Date().toISOString().substr( 0, 10 ),
                        end     : `${ new Date().getFullYear() }` + '-' + (`${ new Date().getMonth() + 1 }` < 10 ? `0${ new Date().getMonth() + 1 }` : `${ new Date().getMonth() + 1 }`) + '-' + (`${ new Date().getDate() + 1 }` < 10 ? `0${ new Date().getDate() + 1 }` : `${ new Date().getDate() + 1 }`)
                    } )
                expect( res.status ).toBe( 200 )
                expect( res.body.message ).toBe( 'Todos list by filters' )
                expect( res.body.response.pagination ).toBeTruthy()
                expect( res.body.response.data ).toBeTruthy()
                expect( res.body.response.data ).toHaveLength( 1 )
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
                const res = await request.get( `${ url }` )
                    .set( 'Authorization', token )
                    .query( {
                        items: 10,
                        page : 1,
                        user : adminID
                    } )
                expect( res.status ).toBe( 200 )
                expect( res.body.message ).toBe( 'Todos list by filters' )
                expect( res.body.response.pagination ).toBeTruthy()
                expect( res.body.response.data ).toBeTruthy()
                expect( res.body.response.data ).toHaveLength( 5 )
                id = res.body.response.data[4]._id
                done()
            } )
        } )
        describe( 'GET /api/todos/one/:id', () => {
            it( 'Should return http 401 at no Authorization', async done => {
                const res = await request.get( `${ url }/one/${ id }` )
                    .set( 'Authorization', null )
                    .query( {
                        user: adminID
                    } )
                expect( res.status ).toBe( 401 )
                expect( res.body.message ).toBe( 'Unauthorized access' )
                done()
            } )
            it( 'Should return http 400 at invalid path params', async done => {
                const res = await request.get( `${ url }/one/12345` )
                    .set( 'Authorization', token )
                    .query( {
                        user: adminID
                    } )
                expect( res.status ).toBe( 400 )
                expect( res.body.message ).toBe( 'Data integrity error' )
                done()
            } )
            it( 'Should return http 400 at invalid query params', async done => {
                const res = await request.get( `${ url }/one/${ id }` )
                    .set( 'Authorization', token )
                    .query( {
                        user: faker.random.uuid()
                    } )
                expect( res.status ).toBe( 400 )
                expect( res.body.message ).toBe( 'Data integrity error' )
                done()
            } )
            it( 'Should return http 200 at valid params', async done => {
                const res = await request.get( `${ url }/one/${ id }` )
                    .set( 'Authorization', token )
                    .query( {
                        user: adminID
                    } )
                expect( res.status ).toBe( 200 )
                expect( res.body.message ).toBe( 'Todo by Id' )
                expect( res.body.response._id ).toBeTruthy()
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
        describe( 'DELETE /api/todos', () => {
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
            expect( res.body.response.token ).toBeTruthy()
            token = res.body.response.token
            done()
        } )
        describe( 'GET /api/todos [items, page]', () => {
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
            it( 'Should return http 403 at valid query params', async done => {
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
        describe( 'GET /api/todos [items, page, user - Admin]', () => {
            it( 'Should return http 401 at no Authorization', async done => {
                const res = await request.get( `${ url }` )
                    .set( 'Authorization', null )
                    .query( {
                        items: 10,
                        page : 1,
                        user : adminID
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
                        page : 'algo ahi',
                        user : '54654sdsdsadassafasfasfase54654'
                    } )
                expect( res.status ).toBe( 400 )
                expect( res.body.message ).toBe( 'Data integrity error' )
                done()
            } )
            it( 'Should return http 403 at valid query params', async done => {
                const res = await request.get( `${ url }` )
                    .set( 'Authorization', token )
                    .query( {
                        items: 10,
                        page : 1,
                        user : adminID
                    } )
                expect( res.status ).toBe( 403 )
                expect( res.body.message ).toBe( 'Forbidden access' )
                done()
            } )
        } )
        describe( 'GET /api/todos [items, page, user - User]', () => {
            it( 'Should return http 401 at no Authorization', async done => {
                const res = await request.get( `${ url }` )
                    .set( 'Authorization', null )
                    .query( {
                        items: 10,
                        page : 1,
                        user : userID
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
                        page : 'algo ahi',
                        user : '54654sdsdsadassafasfasfase54654'
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
                        page : 1,
                        user : userID
                    } )
                expect( res.status ).toBe( 200 )
                expect( res.body.message ).toBe( 'Todos list by filters' )
                expect( res.body.response.pagination ).toBeTruthy()
                expect( res.body.response.data ).toBeTruthy()
                expect( res.body.response.data ).toHaveLength( 4 )
                done()
            } )
        } )
        describe( 'GET /api/todos [items, page, category - User]', () => {
            it( 'Should return http 401 at no Authorization', async done => {
                const res = await request.get( `${ url }` )
                    .set( 'Authorization', null )
                    .query( {
                        items   : 10,
                        page    : 1,
                        user    : userID,
                        category: userCategory
                    } )
                expect( res.status ).toBe( 401 )
                expect( res.body.message ).toBe( 'Unauthorized access' )
                done()
            } )
            it( 'Should return http 400 at invalid query params', async done => {
                const res = await request.get( `${ url }` )
                    .set( 'Authorization', token )
                    .query( {
                        items   : null,
                        page    : 'algo ahi',
                        user    : 'jsdksjbdks',
                        category: '54654sdsdsadassafasfasfase54654'
                    } )
                expect( res.status ).toBe( 400 )
                expect( res.body.message ).toBe( 'Data integrity error' )
                done()
            } )
            it( 'Should return http 200 at valid query params', async done => {
                const res = await request.get( `${ url }` )
                    .set( 'Authorization', token )
                    .query( {
                        items   : 10,
                        page    : 1,
                        user    : userID,
                        category: userCategory
                    } )
                expect( res.status ).toBe( 200 )
                expect( res.body.message ).toBe( 'Todos list by filters' )
                expect( res.body.response.pagination ).toBeTruthy()
                expect( res.body.response.data ).toBeTruthy()
                expect( res.body.response.data ).toHaveLength( 1 )
                done()
            } )
        } )
        describe( 'GET /api/todos [items, page, status - Pending]', () => {
            it( 'Should return http 401 at no Authorization', async done => {
                const res = await request.get( `${ url }` )
                    .set( 'Authorization', null )
                    .query( {
                        items : 10,
                        page  : 1,
                        user  : userID,
                        status: 'Pending'
                    } )
                expect( res.status ).toBe( 401 )
                expect( res.body.message ).toBe( 'Unauthorized access' )
                done()
            } )
            it( 'Should return http 400 at invalid query params', async done => {
                const res = await request.get( `${ url }` )
                    .set( 'Authorization', token )
                    .query( {
                        items : null,
                        page  : 'algo ahi',
                        user  : 'jsdhksjahd',
                        status: '54654sdsdsadassafasfasfase54654'
                    } )
                expect( res.status ).toBe( 400 )
                expect( res.body.message ).toBe( 'Data integrity error' )
                done()
            } )
            it( 'Should return http 200 at valid query params', async done => {
                const res = await request.get( `${ url }` )
                    .set( 'Authorization', token )
                    .query( {
                        items : 10,
                        page  : 1,
                        user  : userID,
                        status: 'Pending'
                    } )
                expect( res.status ).toBe( 200 )
                expect( res.body.message ).toBe( 'Todos list by filters' )
                expect( res.body.response.pagination ).toBeTruthy()
                expect( res.body.response.data ).toBeTruthy()
                expect( res.body.response.data ).toHaveLength( 2 )
                done()
            } )
        } )
        describe( 'GET /api/todos [items, page, status - Overdue]', () => {
            it( 'Should return http 401 at no Authorization', async done => {
                const res = await request.get( `${ url }` )
                    .set( 'Authorization', null )
                    .query( {
                        items : 10,
                        page  : 1,
                        user  : userID,
                        status: 'Overdue'
                    } )
                expect( res.status ).toBe( 401 )
                expect( res.body.message ).toBe( 'Unauthorized access' )
                done()
            } )
            it( 'Should return http 400 at invalid query params', async done => {
                const res = await request.get( `${ url }` )
                    .set( 'Authorization', token )
                    .query( {
                        items : null,
                        page  : 'algo ahi',
                        user  : 'sudjshfjs',
                        status: '54654sdsdsadassafasfasfase54654'
                    } )
                expect( res.status ).toBe( 400 )
                expect( res.body.message ).toBe( 'Data integrity error' )
                done()
            } )
            it( 'Should return http 200 at valid query params', async done => {
                const res = await request.get( `${ url }` )
                    .set( 'Authorization', token )
                    .query( {
                        items : 10,
                        page  : 1,
                        user  : userID,
                        status: 'Overdue'
                    } )
                expect( res.status ).toBe( 200 )
                expect( res.body.message ).toBe( 'Todos list by filters' )
                expect( res.body.response.pagination ).toBeTruthy()
                expect( res.body.response.data ).toBeTruthy()
                expect( res.body.response.data ).toHaveLength( 1 )
                done()
            } )
        } )
        describe( 'GET /api/todos [items, page, status - Finished]', () => {
            it( 'Should return http 401 at no Authorization', async done => {
                const res = await request.get( `${ url }` )
                    .set( 'Authorization', null )
                    .query( {
                        items : 10,
                        page  : 1,
                        user  : userID,
                        status: 'Finished'
                    } )
                expect( res.status ).toBe( 401 )
                expect( res.body.message ).toBe( 'Unauthorized access' )
                done()
            } )
            it( 'Should return http 400 at invalid query params', async done => {
                const res = await request.get( `${ url }` )
                    .set( 'Authorization', token )
                    .query( {
                        items : null,
                        page  : 'algo ahi',
                        user  : 'dkjfhkdsjfh',
                        status: '54654sdsdsadassafasfasfase54654'
                    } )
                expect( res.status ).toBe( 400 )
                expect( res.body.message ).toBe( 'Data integrity error' )
                done()
            } )
            it( 'Should return http 200 at valid query params', async done => {
                const res = await request.get( `${ url }` )
                    .set( 'Authorization', token )
                    .query( {
                        items : 10,
                        page  : 1,
                        user  : userID,
                        status: 'Finished'
                    } )
                expect( res.status ).toBe( 200 )
                expect( res.body.message ).toBe( 'Todos list by filters' )
                expect( res.body.response.pagination ).toBeTruthy()
                expect( res.body.response.data ).toBeTruthy()
                expect( res.body.response.data ).toHaveLength( 1 )
                done()
            } )
        } )
        describe( 'GET /api/todos [items, page, start]', () => {
            it( 'Should return http 401 at no Authorization', async done => {
                const res = await request.get( `${ url }` )
                    .set( 'Authorization', null )
                    .query( {
                        items: 10,
                        page : 1,
                        user : userID,
                        start: new Date().toISOString().substr( 0, 10 )
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
                        page : 'algo ahi',
                        user : 'kjsdhfkjdsf',
                        start: null
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
                        page : 1,
                        user : userID,
                        start: new Date().toISOString().substr( 0, 10 )
                    } )
                expect( res.status ).toBe( 200 )
                expect( res.body.message ).toBe( 'Todos list by filters' )
                expect( res.body.response.pagination ).toBeTruthy()
                expect( res.body.response.data ).toBeTruthy()
                expect( res.body.response.data ).toHaveLength( 4 )
                done()
            } )
        } )
        describe( 'GET /api/todos [items, page, end]', () => {
            it( 'Should return http 401 at no Authorization', async done => {
                const res = await request.get( `${ url }` )
                    .set( 'Authorization', null )
                    .query( {
                        items: 10,
                        page : 1,
                        user : userID,
                        end  : `${ new Date().getFullYear() }` + '-' + (`${ new Date().getMonth() + 1 }` < 10 ? `0${ new Date().getMonth() + 1 }` : `${ new Date().getMonth() + 1 }`) + '-' + (`${ new Date().getDate() + 1 }` < 10 ? `0${ new Date().getDate() + 1 }` : `${ new Date().getDate() + 1 }`)
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
                        page : 'algo ahi',
                        user : 'lkdfklsdf',
                        end  : null
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
                        page : 1,
                        user : userID,
                        end  : `${ new Date().getFullYear() }` + '-' + (`${ new Date().getMonth() + 1 }` < 10 ? `0${ new Date().getMonth() + 1 }` : `${ new Date().getMonth() + 1 }`) + '-' + (`${ new Date().getDate() + 1 }` < 10 ? `0${ new Date().getDate() + 1 }` : `${ new Date().getDate() + 1 }`)
                    } )
                expect( res.status ).toBe( 200 )
                expect( res.body.message ).toBe( 'Todos list by filters' )
                expect( res.body.response.pagination ).toBeTruthy()
                expect( res.body.response.data ).toBeTruthy()
                expect( res.body.response.data ).toHaveLength( 4 )
                done()
            } )
        } )
        describe( 'GET /api/todos [items, page, start, end]', () => {
            it( 'Should return http 401 at no Authorization', async done => {
                const res = await request.get( `${ url }` )
                    .set( 'Authorization', null )
                    .query( {
                        items: 10,
                        page : 1,
                        user : userID,
                        start: new Date().toISOString().substr( 0, 10 ),
                        end  : `${ new Date().getFullYear() }` + '-' + (`${ new Date().getMonth() + 1 }` < 10 ? `0${ new Date().getMonth() + 1 }` : `${ new Date().getMonth() + 1 }`) + '-' + (`${ new Date().getDate() + 1 }` < 10 ? `0${ new Date().getDate() + 1 }` : `${ new Date().getDate() + 1 }`)
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
                        page : 'algo ahi',
                        user : 'kjshdksjdhf',
                        start: null,
                        end  : null
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
                        page : 1,
                        user : userID,
                        start: new Date().toISOString().substr( 0, 10 ),
                        end  : `${ new Date().getFullYear() }` + '-' + (`${ new Date().getMonth() + 1 }` < 10 ? `0${ new Date().getMonth() + 1 }` : `${ new Date().getMonth() + 1 }`) + '-' + (`${ new Date().getDate() + 1 }` < 10 ? `0${ new Date().getDate() + 1 }` : `${ new Date().getDate() + 1 }`)
                    } )
                expect( res.status ).toBe( 200 )
                expect( res.body.message ).toBe( 'Todos list by filters' )
                expect( res.body.response.pagination ).toBeTruthy()
                expect( res.body.response.data ).toBeTruthy()
                expect( res.body.response.data ).toHaveLength( 4 )
                done()
            } )
        } )
        describe( 'GET /api/todos [items, page, user, status, category, start, end]', () => {
            it( 'Should return http 401 at no Authorization', async done => {
                const res = await request.get( `${ url }` )
                    .set( 'Authorization', null )
                    .query( {
                        items   : 10,
                        page    : 1,
                        user    : userID,
                        category: userCategory,
                        status  : 'Overdue',
                        start   : new Date().toISOString().substr( 0, 10 ),
                        end     : `${ new Date().getFullYear() }` + '-' + (`${ new Date().getMonth() + 1 }` < 10 ? `0${ new Date().getMonth() + 1 }` : `${ new Date().getMonth() + 1 }`) + '-' + (`${ new Date().getDate() + 1 }` < 10 ? `0${ new Date().getDate() + 1 }` : `${ new Date().getDate() + 1 }`)
                    } )
                expect( res.status ).toBe( 401 )
                expect( res.body.message ).toBe( 'Unauthorized access' )
                done()
            } )
            it( 'Should return http 400 at invalid query params', async done => {
                const res = await request.get( `${ url }` )
                    .set( 'Authorization', token )
                    .query( {
                        items   : null,
                        page    : 'algo ahi',
                        user    : 'sdasfasf',
                        category: 'adsasa',
                        status  : 'algo',
                        start   : null,
                        end     : null
                    } )
                expect( res.status ).toBe( 400 )
                expect( res.body.message ).toBe( 'Data integrity error' )
                done()
            } )
            it( 'Should return http 200 at valid query params', async done => {
                const res = await request.get( `${ url }` )
                    .set( 'Authorization', token )
                    .query( {
                        items   : 10,
                        page    : 1,
                        user    : userID,
                        category: userCategory,
                        status  : 'Overdue',
                        start   : new Date().toISOString().substr( 0, 10 ),
                        end     : `${ new Date().getFullYear() }` + '-' + (`${ new Date().getMonth() + 1 }` < 10 ? `0${ new Date().getMonth() + 1 }` : `${ new Date().getMonth() + 1 }`) + '-' + (`${ new Date().getDate() + 1 }` < 10 ? `0${ new Date().getDate() + 1 }` : `${ new Date().getDate() + 1 }`)
                    } )
                expect( res.status ).toBe( 200 )
                expect( res.body.message ).toBe( 'Todos list by filters' )
                expect( res.body.response.pagination ).toBeTruthy()
                expect( res.body.response.data ).toBeTruthy()
                expect( res.body.response.data ).toHaveLength( 0 )
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
                const res = await request.get( `${ url }` )
                    .set( 'Authorization', token )
                    .query( {
                        items: 10,
                        page : 1,
                        user : userID
                    } )
                expect( res.status ).toBe( 200 )
                expect( res.body.message ).toBe( 'Todos list by filters' )
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
        describe( 'DELETE /api/todos', () => {
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
