const app = require( './server/index' )
const supertest = require( 'supertest' )
const request = supertest( app )
const { setup } = require( './server/setup' )
setup().then()
const url = '/api/roles'
let token
describe( 'GET /api/roles', () => {
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
    it( 'Should return http 401 Unauthorized access', async done => {
        const res = await request.get( `${ url }` )
            .set( 'Authorization', null )
        expect( res.status ).toBe( 401 )
        expect( res.body.message ).toBe( 'Unauthorized access' )
        done()
    } )
    it( 'Should return http 403 forbidden access for user', async done => {
        const res = await request.get( `${ url }` )
            .set( 'Authorization', token )
        expect( res.status ).toBe( 403 )
        expect( res.body.message ).toBe( 'Forbidden access' )
        done()
    } )
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
    it( 'Should return http 200 and a list of roles', async done => {
        const res = await request.get( `${ url }` )
            .set( 'Authorization', token )
        expect( res.status ).toBe( 200 )
        expect( res.body.message ).toBe( 'Roles list' )
        expect( res.body.response ).toHaveLength( 2 )
        done()
    } )
} )
