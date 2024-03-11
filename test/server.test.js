import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../src/server.js';

chai.use(chaiHttp);
const expect = chai.expect;

describe('Orders', () => {
    it('should accept valid orders', done => {
        chai.request(server)
            .post('/order')
            .send({ type: 'Bid', price: 100, quantity: 1 })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.text).to.equal('Order received');
                done();
            });
    });
    it('should reject invalid orders', done => {
        chai.request(server)
            .post('/order')
            .send({ type: 'Invalid', price: 300, quantity: 3 })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.text).to.equal('Invalid order');
                done();
            });
    });
});