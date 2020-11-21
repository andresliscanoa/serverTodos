const app = require( './server/index' )
const supertest = require( 'supertest' )
const faker = require( 'faker' )
const request = supertest( app )
const { setup } = require( './server/setup' )
setup().then()
const url = '/api/users', adminID = '5f2f7389899672386846c550', userID = '5f2f7389899672386846c551'
let token
describe( 'USERS TEST', () => {
    describe( 'POST /api/users/sing/in', () => {
        it( 'Should return http 400 at null email', async done => {
            const res = await request.post( `${ url }/sing/in` )
                .send( {
                    email   : null,
                    password: 123456789
                } )
            expect( res.status ).toBe( 400 )
            expect( res.body.message ).toBe( 'Data integrity error' )
            done()
        } )
        it( 'Should return http 400 at null password', async done => {
            const res = await request.post( `${ url }/sing/in` )
                .send( {
                    email   : faker.internet.email,
                    password: null
                } )
            expect( res.status ).toBe( 400 )
            expect( res.body.message ).toBe( 'Data integrity error' )
            done()
        } )
        it( 'Should return http 400 at email invalid format', async done => {
            const res = await request.post( `${ url }/sing/in` )
                .send( {
                    email   : 'abcdef ghikj',
                    password: '123456789'
                } )
            expect( res.status ).toBe( 400 )
            expect( res.body.message ).toBe( 'Data integrity error' )
            done()
        } )
        it( 'Should return http 400 at password invalid format', async done => {
            const res = await request.post( `${ url }/sing/in` )
                .send( {
                    email   : faker.internet.email,
                    password: 'abcdef ghikj sddf dsfdsf654 dfsddf'
                } )
            expect( res.status ).toBe( 400 )
            expect( res.body.message ).toBe( 'Data integrity error' )
            done()
        } )
        it( 'Should return http 400 at invalid email', async done => {
            const res = await request.post( `${ url }/sing/in` )
                .send( {
                    email   : faker.internet.email(),
                    password: '123456789'
                } )
            expect( res.status ).toBe( 400 )
            expect( res.body.message ).toBe( 'Ops, something went wrong' )
            done()
        } )
        it( 'Should return http 400 at invalid password', async done => {
            const res = await request.post( `${ url }/sing/in` )
                .send( {
                    email   : 'admin@todos.com',
                    password: 'contraseña'
                } )
            expect( res.status ).toBe( 400 )
            expect( res.body.message ).toBe( 'The credentials are not correct' )
            done()
        } )
        it( 'Should return http 200 at valid credentials', async done => {
            const res = await request.post( `${ url }/sing/in` )
                .send( {
                    email   : 'admin@todos.com',
                    password: '123456789'
                } )
            expect( res.status ).toBe( 200 )
            expect( res.body.message ).toBe( 'User authorized' )
            expect( res.body.response.token ).toBeTruthy()
            token = res.body.response.token
            done()
        } )
    } )
    describe( 'GET /api/users/unique/email', () => {
        it( 'Should return http 401 at no Authorization', async done => {
            const res = await request.get( `${ url }/unique/email` )
                .set( 'Authorization', null )
                .query( {
                    value: faker.internet.email()
                } )
            expect( res.status ).toBe( 401 )
            expect( res.body.message ).toBe( 'Unauthorized access' )
            done()
        } )
        it( 'Should return http 400 at invalid query params', async done => {
            const res = await request.get( `${ url }/unique/email` )
                .set( 'Authorization', token )
                .query( {
                    value: null
                } )
            expect( res.status ).toBe( 400 )
            expect( res.body.message ).toBe( 'Data integrity error' )
            done()
        } )
        it( 'Should return http 200 at valid query params', async done => {
            const res = await request.get( `${ url }/unique/email` )
                .set( 'Authorization', token )
                .query( {
                    value: faker.internet.email()
                } )
            expect( res.status ).toBe( 200 )
            expect( res.body.message ).toBe( 'Available value' )
            done()
        } )
    } )
    describe( 'GET /api/users', () => {
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
            expect( res.body.message ).toBe( 'Users list' )
            expect( res.body.response.pagination ).toBeTruthy()
            expect( res.body.response.data ).toBeTruthy()
            expect( res.body.response.data ).toHaveLength( 1 )
            done()
        } )
    } )
    describe( 'GET /api/users/:id [ADMIN]', () => {
        it( 'Should return http 401 at no Authorization', async done => {
            const res = await request.get( `${ url }/${ adminID }` )
                .set( 'Authorization', null )
            expect( res.status ).toBe( 401 )
            expect( res.body.message ).toBe( 'Unauthorized access' )
            done()
        } )
        it( 'Should return http 400 at invalid path params', async done => {
            const res = await request.get( `${ url }/sadasdsadsad` )
                .set( 'Authorization', token )
            expect( res.status ).toBe( 400 )
            expect( res.body.message ).toBe( 'Data integrity error' )
            done()
        } )
        it( 'Should return http 200 at valid query params', async done => {
            const res = await request.get( `${ url }/${ adminID }` )
                .set( 'Authorization', token )
            expect( res.status ).toBe( 200 )
            expect( res.body.message ).toBe( 'User' )
            expect( res.body.response ).toBeTruthy()
            expect( res.body.response._id ).toBe( adminID )
            done()
        } )
    } )
    describe( 'GET /api/users/:id [USER]', () => {
        it( 'Should return http 401 at no Authorization', async done => {
            const res = await request.get( `${ url }/${ userID }` )
                .set( 'Authorization', null )
            expect( res.status ).toBe( 401 )
            expect( res.body.message ).toBe( 'Unauthorized access' )
            done()
        } )
        it( 'Should return http 400 at invalid path params', async done => {
            const res = await request.get( `${ url }/sadasdsadsad` )
                .set( 'Authorization', token )
            expect( res.status ).toBe( 400 )
            expect( res.body.message ).toBe( 'Data integrity error' )
            done()
        } )
        it( 'Should return http 200 at valid query params', async done => {
            const res = await request.get( `${ url }/${ userID }` )
                .set( 'Authorization', token )
            expect( res.status ).toBe( 200 )
            expect( res.body.message ).toBe( 'User' )
            expect( res.body.response ).toBeTruthy()
            expect( res.body.response._id ).toBe( userID )
            done()
        } )
    } )
    describe( 'POST /api/users', () => {
        it( 'Should return http 401 at no Authorization', async done => {
            const res = await request.post( `${ url }` )
                .set( 'Authorization', null )
                .send( {
                    name    : {
                        first: faker.name.firstName()
                    },
                    lastname: {
                        first: faker.name.lastName()
                    },
                    email   : faker.internet.email(),
                    password: faker.commerce.productAdjective(),
                    rol     : '5f2f7389899672386846c558'
                } )
            expect( res.status ).toBe( 401 )
            expect( res.body.message ).toBe( 'Unauthorized access' )
            done()
        } )
        it( 'Should return http 400 at invalid body', async done => {
            const res = await request.post( `${ url }` )
                .set( 'Authorization', token )
                .send( {} )
            expect( res.status ).toBe( 400 )
            expect( res.body.message ).toBe( 'Data integrity error' )
            done()
        } )
        it( 'Should return http 200 at valid body', async done => {
            const res = await request.post( `${ url }` )
                .set( 'Authorization', token )
                .send( {
                    name    : {
                        first: faker.name.firstName()
                    },
                    lastname: {
                        first: faker.name.lastName()
                    },
                    email   : faker.internet.email(),
                    password: 'Contraseña1',
                    rol     : '5f2f7389899672386846c558'
                } )
            expect( res.status ).toBe( 200 )
            expect( res.body.message ).toBe( 'User created successfully' )
            done()
        } )
    } )
    describe( 'PUT /api/users/:id', () => {
        it( 'Should return http 401 at no Authorization', async done => {
            const res = await request.put( `${ url }/${ userID }` )
                .set( 'Authorization', null )
                .send( {
                    name    : {
                        first: faker.name.firstName()
                    },
                    lastname: {
                        first: faker.name.lastName()
                    },
                    email   : 'user1@todos.com',
                    rol     : '5f2f7389899672386846c558'
                } )
            expect( res.status ).toBe( 401 )
            expect( res.body.message ).toBe( 'Unauthorized access' )
            done()
        } )
        it( 'Should return http 400 at invalid body', async done => {
            const res = await request.put( `${ url }/${ userID }` )
                .set( 'Authorization', token )
                .send( {} )
            expect( res.status ).toBe( 400 )
            expect( res.body.message ).toBe( 'Data integrity error' )
            done()
        } )
        it( 'Should return http 200 at valid body', async done => {
            const res = await request.put( `${ url }/${ userID }` )
                .set( 'Authorization', token )
                .send( {
                    name    : {
                        first: faker.name.firstName()
                    },
                    lastname: {
                        first: faker.name.lastName()
                    },
                    email   : 'user1@todos.com',
                    rol     : '5f2f7389899672386846c558'
                } )
            expect( res.status ).toBe( 200 )
            expect( res.body.message ).toBe( 'User updated successfully' )
            done()
        } )
    } )
    describe( 'PUT /api/users/set/password', () => {
        it( 'Should return http 401 at no Authorization', async done => {
            const res = await request.put( `${ url }/set/password` )
                .set( 'Authorization', null )
                .send( {
                    id      : userID,
                    password: '987654321'
                } )
            expect( res.status ).toBe( 401 )
            expect( res.body.message ).toBe( 'Unauthorized access' )
            done()
        } )
        it( 'Should return http 400 at invalid body', async done => {
            const res = await request.put( `${ url }/set/password` )
                .set( 'Authorization', token )
                .send( {
                    id      : 'asad',
                    password: null
                } )
            expect( res.status ).toBe( 400 )
            expect( res.body.message ).toBe( 'Data integrity error' )
            done()
        } )
        it( 'Should return http 200 at valid body', async done => {
            const res = await request.put( `${ url }/set/password` )
                .set( 'Authorization', token )
                .send( {
                    id      : userID,
                    password: '987654321'
                } )
            expect( res.status ).toBe( 200 )
            expect( res.body.message ).toBe( 'Password updated successfully' )
            done()
        } )
    } )
    describe( 'POST /api/users/sing/in', () => {
        it( 'Should return http 200 at valid credentials [New Password]', async done => {
            const res = await request.post( `${ url }/sing/in` )
                .send( {
                    email   : 'user1@todos.com',
                    password: '987654321'
                } )
            expect( res.status ).toBe( 200 )
            expect( res.body.message ).toBe( 'User authorized' )
            expect( res.body.response.token ).toBeTruthy()
            done()
        } )
    } )
    describe( 'PUT /api/users/set/rol', () => {
        it( 'Should return http 401 at no Authorization', async done => {
            const res = await request.put( `${ url }/set/rol` )
                .set( 'Authorization', null )
                .send( {
                    id : userID,
                    rol: '5f2f7389899672386846c555'
                } )
            expect( res.status ).toBe( 401 )
            expect( res.body.message ).toBe( 'Unauthorized access' )
            done()
        } )
        it( 'Should return http 400 at invalid body', async done => {
            const res = await request.put( `${ url }/set/rol` )
                .set( 'Authorization', token )
                .send( {
                    id : 'asad',
                    rol: null
                } )
            expect( res.status ).toBe( 400 )
            expect( res.body.message ).toBe( 'Data integrity error' )
            done()
        } )
        it( 'Should return http 200 at valid body', async done => {
            const res = await request.put( `${ url }/set/rol` )
                .set( 'Authorization', token )
                .send( {
                    id : userID,
                    rol: '5f2f7389899672386846c555'
                } )
            expect( res.status ).toBe( 200 )
            expect( res.body.message ).toBe( 'Rol updated successfully' )
            done()
        } )
    } )
} )

