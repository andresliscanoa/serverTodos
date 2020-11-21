const app = require( './server/index' )
const supertest = require( 'supertest' )
const faker = require( 'faker' )
const request = supertest( app )
const { setup } = require( './server/setup' )
setup().then()
const url = '/api/categories'
let token, id
describe( 'TEST CATEGORIES', () => {
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
        describe( 'GET /api/categories/unique/name?value', () => {
            it( 'Should return http 401 at no Authorization', async done => {
                const res = await request.get( `${ url }/unique/name` )
                    .set( 'Authorization', null )
                    .query( {
                        value: faker.random.word()
                    } )
                expect( res.status ).toBe( 401 )
                expect( res.body.message ).toBe( 'Unauthorized access' )
                done()
            } )
            it( 'Should return http 400 at invalid query param', async done => {
                const res = await request.get( `${ url }/unique/name` )
                    .set( 'Authorization', token )
                    .query( {
                        value: null
                    } )
                expect( res.status ).toBe( 400 )
                expect( res.body.message ).toBe( 'Data integrity error' )
                done()
            } )
            it( 'Should return http 200 at valid query param', async done => {
                const res = await request.get( `${ url }/unique/name` )
                    .set( 'Authorization', token )
                    .query( {
                        value: faker.random.word()
                    } )
                expect( res.status ).toBe( 200 )
                expect( res.body.message ).toBe( 'Available value' )
                done()
            } )
        } )
        describe( 'GET /api/categories/name', () => {
            it( 'Should return http 401 at no Authorization', async done => {
                const res = await request.get( `${ url }/name` )
                    .set( 'Authorization', null )
                    .query( {
                        search: faker.random.word(),
                        items : 10,
                        page  : 1
                    } )
                expect( res.status ).toBe( 401 )
                expect( res.body.message ).toBe( 'Unauthorized access' )
                done()
            } )
            it( 'Should return http 400 at invalid query param', async done => {
                const res = await request.get( `${ url }/name` )
                    .set( 'Authorization', token )
                    .query( {
                        search: null,
                        items : 10,
                        page  : 1
                    } )
                expect( res.status ).toBe( 400 )
                expect( res.body.message ).toBe( 'Data integrity error' )
                done()
            } )
            it( 'Should return http 200 at valid query param', async done => {
                const res = await request.get( `${ url }/name` )
                    .set( 'Authorization', token )
                    .query( {
                        search: faker.random.word(),
                        items : 10,
                        page  : 1
                    } )
                expect( res.status ).toBe( 200 )
                expect( res.body.message ).toBe( 'Categories list by name' )
                expect( res.body.response.pagination ).toBeTruthy()
                expect( res.body.response.data ).toBeTruthy()
                done()
            } )
        } )
        describe( 'POST /api/categories', () => {
            it( 'Should return http 401 at no Authorization', async done => {
                const res = await request.post( `${ url }` )
                    .set( 'Authorization', null )
                    .send( {
                        name: faker.random.word( 'string' )
                    } )
                expect( res.status ).toBe( 401 )
                expect( res.body.message ).toBe( 'Unauthorized access' )
                done()
            } )
            it( 'Should return http 400 at invalid body', async done => {
                const res = await request.post( `${ url }` )
                    .set( 'Authorization', token )
                    .send( {
                        name: null
                    } )
                expect( res.status ).toBe( 400 )
                expect( res.body.message ).toBe( 'Data integrity error' )
                done()
            } )
            it( 'Should return http 200 at valid body', async done => {
                const res = await request.post( `${ url }` )
                    .set( 'Authorization', token )
                    .send( {
                        name: faker.random.word( 'string' )
                    } )
                expect( res.status ).toBe( 200 )
                expect( res.body.message ).toBe( 'Category created successfully' )
                done()
            } )
        } )
        describe( 'GET /api/categories', () => {
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
            it( 'Should return http 400 at invalid query param', async done => {
                const res = await request.get( `${ url }` )
                    .set( 'Authorization', token )
                    .query( {
                        items: null,
                        page : 'abcdef'
                    } )
                expect( res.status ).toBe( 400 )
                expect( res.body.message ).toBe( 'Data integrity error' )
                done()
            } )
            it( 'Should return http 200 at valid query param', async done => {
                const res = await request.get( `${ url }` )
                    .set( 'Authorization', token )
                    .query( {
                        items: 10,
                        page : 1
                    } )
                expect( res.status ).toBe( 200 )
                expect( res.body.message ).toBe( 'Categories list' )
                expect( res.body.response.pagination ).toBeTruthy()
                expect( res.body.response.data ).toBeTruthy()
                expect( res.body.response.data ).toHaveLength( 4 )
                id = res.body.response.data[0]._id
                done()
            } )
        } )
        describe( 'PUT /api/categories', () => {
            it( 'Should return http 401 at no Authorization', async done => {
                const res = await request.put( `${ url }` )
                    .set( 'Authorization', null )
                    .send( {
                        id,
                        name  : faker.random.word( 'string' ),
                        status: true
                    } )
                expect( res.status ).toBe( 401 )
                expect( res.body.message ).toBe( 'Unauthorized access' )
                done()
            } )
            it( 'Should return http 400 at invalid params', async done => {
                const res = await request.put( `${ url }` )
                    .set( 'Authorization', token )
                    .send( {
                        id    : null,
                        name  : null,
                        status: 'algo ahi'
                    } )
                expect( res.status ).toBe( 400 )
                expect( res.body.message ).toBe( 'Data integrity error' )
                done()
                done()
            } )
            it( 'Should return http 200 at valid params', async done => {
                const res = await request.put( `${ url }` )
                    .set( 'Authorization', token )
                    .send( {
                        id,
                        name  : faker.random.word( 'string' ),
                        status: true
                    } )
                expect( res.status ).toBe( 200 )
                expect( res.body.message ).toBe( 'Category updated successfully' )
                done()
            } )
        } )
        describe( 'PUT /api/categories/status', () => {
            it( 'Should return http 401 at no Authorization', async done => {
                const res = await request.put( `${ url }/status` )
                    .set( 'Authorization', null )
                    .send( {
                        id,
                        status: faker.random.boolean()
                    } )
                expect( res.status ).toBe( 401 )
                expect( res.body.message ).toBe( 'Unauthorized access' )
                done()
            } )
            it( 'Should return http 400 at invalid params', async done => {
                const res = await request.put( `${ url }/status` )
                    .set( 'Authorization', token )
                    .send( {
                        id    : null,
                        status: 'algo ahi'
                    } )
                expect( res.status ).toBe( 400 )
                expect( res.body.message ).toBe( 'Data integrity error' )
                done()
                done()
            } )
            it( 'Should return http 200 at valid params', async done => {
                const res = await request.put( `${ url }/status` )
                    .set( 'Authorization', token )
                    .send( {
                        id,
                        status: 'false'
                    } )
                expect( res.status ).toBe( 200 )
                expect( res.body.message ).toBe( 'Category updated successfully' )
                done()
            } )
        } )
    } )
    describe( 'ANY USER', () => {
        it( 'Should login any user successfully', async done => {
            const res = await request.post( '/api/users/sing/in' )
                .send( {
                    email   : 'user1@todos.com',
                    password: '123456789'
                } )
            expect( res.body.response.token ).toBeTruthy()
            token = res.body.response.token
            done()
        } )
        describe( 'GET /api/categories/unique/name?value', () => {
            it( 'Should return http 401 at no Authorization', async done => {
                const res = await request.get( `${ url }/unique/name` )
                    .set( 'Authorization', null )
                    .query( {
                        value: faker.random.word()
                    } )
                expect( res.status ).toBe( 401 )
                expect( res.body.message ).toBe( 'Unauthorized access' )
                done()
            } )
            it( 'Should return http 400 at invalid query param', async done => {
                const res = await request.get( `${ url }/unique/name` )
                    .set( 'Authorization', token )
                    .query( {
                        value: null
                    } )
                expect( res.status ).toBe( 400 )
                expect( res.body.message ).toBe( 'Data integrity error' )
                done()
            } )
            it( 'Should return http 200 at valid query param', async done => {
                const res = await request.get( `${ url }/unique/name` )
                    .set( 'Authorization', token )
                    .query( {
                        value: faker.random.word()
                    } )
                expect( res.status ).toBe( 200 )
                expect( res.body.message ).toBe( 'Available value' )
                done()
            } )
        } )
        describe( 'GET /api/categories/name', () => {
            it( 'Should return http 401 at no Authorization', async done => {
                const res = await request.get( `${ url }/name` )
                    .set( 'Authorization', null )
                    .query( {
                        search: faker.random.word(),
                        items : 10,
                        page  : 1
                    } )
                expect( res.status ).toBe( 401 )
                expect( res.body.message ).toBe( 'Unauthorized access' )
                done()
            } )
            it( 'Should return http 400 at invalid query param', async done => {
                const res = await request.get( `${ url }/name` )
                    .set( 'Authorization', token )
                    .query( {
                        search: null,
                        items : 10,
                        page  : 1
                    } )
                expect( res.status ).toBe( 400 )
                expect( res.body.message ).toBe( 'Data integrity error' )
                done()
            } )
            it( 'Should return http 200 at valid query param', async done => {
                const res = await request.get( `${ url }/name` )
                    .set( 'Authorization', token )
                    .query( {
                        search: faker.random.word(),
                        items : 10,
                        page  : 1
                    } )
                expect( res.status ).toBe( 200 )
                expect( res.body.message ).toBe( 'Categories list by name' )
                expect( res.body.response.pagination ).toBeTruthy()
                expect( res.body.response.data ).toBeTruthy()
                done()
            } )
        } )
        describe( 'POST /api/categories', () => {
            it( 'Should return http 401 at no Authorization', async done => {
                const res = await request.post( `${ url }` )
                    .set( 'Authorization', null )
                    .send( {
                        name: faker.random.word( 'string' )
                    } )
                expect( res.status ).toBe( 401 )
                expect( res.body.message ).toBe( 'Unauthorized access' )
                done()
            } )
            it( 'Should return http 400 at invalid body', async done => {
                const res = await request.post( `${ url }` )
                    .set( 'Authorization', token )
                    .send( {
                        name: null
                    } )
                expect( res.status ).toBe( 400 )
                expect( res.body.message ).toBe( 'Data integrity error' )
                done()
            } )
            it( 'Should return http 200 at valid body', async done => {
                const res = await request.post( `${ url }` )
                    .set( 'Authorization', token )
                    .send( {
                        name: faker.random.word( 'string' )
                    } )
                expect( res.status ).toBe( 200 )
                expect( res.body.message ).toBe( 'Category created successfully' )
                done()
            } )
        } )
        describe( 'GET /api/categories', () => {
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
            it( 'Should return http 400 at invalid query param', async done => {
                const res = await request.get( `${ url }` )
                    .set( 'Authorization', token )
                    .query( {
                        items: null,
                        page : 'abcdef'
                    } )
                expect( res.status ).toBe( 400 )
                expect( res.body.message ).toBe( 'Data integrity error' )
                done()
            } )
            it( 'Should return http 200 at valid query param', async done => {
                const res = await request.get( `${ url }` )
                    .set( 'Authorization', token )
                    .query( {
                        items: 10,
                        page : 1
                    } )
                expect( res.status ).toBe( 200 )
                expect( res.body.message ).toBe( 'Categories list' )
                expect( res.body.response.pagination ).toBeTruthy()
                expect( res.body.response.data ).toBeTruthy()
                expect( res.body.response.data ).toHaveLength( 4 )
                id = res.body.response.data[0]._id
                done()
            } )
        } )
        describe( 'PUT /api/categories', () => {
            it( 'Should return http 401 at no Authorization', async done => {
                const res = await request.put( `${ url }` )
                    .set( 'Authorization', null )
                    .send( {
                        id,
                        name  : faker.random.word( 'string' ),
                        status: true
                    } )
                expect( res.status ).toBe( 401 )
                expect( res.body.message ).toBe( 'Unauthorized access' )
                done()
            } )
            it( 'Should return http 400 at invalid params', async done => {
                const res = await request.put( `${ url }` )
                    .set( 'Authorization', token )
                    .send( {
                        id    : null,
                        name  : null,
                        status: 'algo ahi'
                    } )
                expect( res.status ).toBe( 400 )
                expect( res.body.message ).toBe( 'Data integrity error' )
                done()
                done()
            } )
            it( 'Should return http 200 at valid params', async done => {
                const res = await request.put( `${ url }` )
                    .set( 'Authorization', token )
                    .send( {
                        id,
                        name  : faker.random.word( 'string' ),
                        status: true
                    } )
                expect( res.status ).toBe( 200 )
                expect( res.body.message ).toBe( 'Category updated successfully' )
                done()
            } )
        } )
        describe( 'PUT /api/categories/status', () => {
            it( 'Should return http 401 at no Authorization', async done => {
                const res = await request.put( `${ url }/status` )
                    .set( 'Authorization', null )
                    .send( {
                        id,
                        status: faker.random.boolean()
                    } )
                expect( res.status ).toBe( 401 )
                expect( res.body.message ).toBe( 'Unauthorized access' )
                done()
            } )
            it( 'Should return http 400 at invalid params', async done => {
                const res = await request.put( `${ url }/status` )
                    .set( 'Authorization', token )
                    .send( {
                        id    : null,
                        status: 'algo ahi'
                    } )
                expect( res.status ).toBe( 400 )
                expect( res.body.message ).toBe( 'Data integrity error' )
                done()
                done()
            } )
            it( 'Should return http 200 at valid params', async done => {
                const res = await request.put( `${ url }/status` )
                    .set( 'Authorization', token )
                    .send( {
                        id,
                        status: 'false'
                    } )
                expect( res.status ).toBe( 200 )
                expect( res.body.message ).toBe( 'Category updated successfully' )
                done()
            } )
        } )
    } )
} )
