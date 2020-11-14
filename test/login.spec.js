const app = require( './server/index' )
const supertest = require( 'supertest' )
const faker = require( 'faker' )
const request = supertest( app )
const { setup } = require( './server/setup' )
setup().then()
const url = '/api/users/sing/in'
describe( 'POST /api/users/sing/in', () => {
    it( 'Should return http 400 at null email', async done => {
        const res = await request.post( `${ url }` )
            .send( {
                email   : null,
                password: 123456789
            } )
        expect( res.status ).toBe( 400 )
        expect( res.body.message ).toBe( 'Data integrity error' )
        done()
    } )
    it( 'Should return http 400 at null password', async done => {
        const res = await request.post( `${ url }` )
            .send( {
                email   : faker.internet.email,
                password: null
            } )
        expect( res.status ).toBe( 400 )
        expect( res.body.message ).toBe( 'Data integrity error' )
        done()
    } )
    it( 'Should return http 400 at email invalid format', async done => {
        const res = await request.post( `${ url }` )
            .send( {
                email   : 'abcdef ghikj',
                password: '123456789'
            } )
        expect( res.status ).toBe( 400 )
        expect( res.body.message ).toBe( 'Data integrity error' )
        done()
    } )
    it( 'Should return http 400 at password invalid format', async done => {
        const res = await request.post( `${ url }` )
            .send( {
                email   : faker.internet.email,
                password: 'abcdef ghikj sddf dsfdsf654 dfsddf'
            } )
        expect( res.status ).toBe( 400 )
        expect( res.body.message ).toBe( 'Data integrity error' )
        done()
    } )
    it( 'Should return http 400 at invalid email', async done => {
        const res = await request.post( `${ url }` )
            .send( {
                email   : faker.internet.email(),
                password: '123456789'
            } )
        expect( res.status ).toBe( 400 )
        expect( res.body.message ).toBe( 'Ops, something went wrong' )
        done()
    } )
    it( 'Should return http 400 at invalid password', async done => {
        const res = await request.post( `${ url }` )
            .send( {
                email   : 'admin@todos.com',
                password: 'contraseña'
            } )
        expect( res.status ).toBe( 400 )
        expect( res.body.message ).toBe( 'The credentials are not correct' )
        done()
    } )
    it( 'Should return http 200 at valid credencials', async done => {
        const res = await request.post( `${ url }` )
            .send( {
                email   : 'admin@todos.com',
                password: '123456789'
            } )
        expect( res.status ).toBe( 200 )
        expect( res.body.message ).toBe( 'User authorized' )
        expect( res.body.token ).toBeTruthy()
        done()
    } )
} )
