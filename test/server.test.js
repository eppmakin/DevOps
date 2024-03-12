const http = require('http');
const assert = require('assert');
const server = require('../src/server.js');

describe('Orders', () => {
  const port = 3000;

  it('should accept valid orders', done => {
    const options = {
      hostname: 'localhost',
      port: port,
      path: '/order',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };

    const req = http.request(options, res => {
      let data = '';

      res.on('data', chunk => {
        data += chunk;
      });

      res.on('end', () => {
        assert.strictEqual(res.statusCode, 200);
        assert.strictEqual(data, 'Order received');
        done();
      });
    });

    req.write('type=OFfEr&price=170&quantity=1');
    req.end();
  });

  it('should reject invalid order types', done => {
    const options = {
      hostname: 'localhost',
      port: port,
      path: '/order',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };

    const req = http.request(options, res => {
      let data = '';

      res.on('data', chunk => {
        data += chunk;
      });

      res.on('end', () => {
        assert.strictEqual(res.statusCode, 400);
        assert.strictEqual(data, 'Invalid order type');
        done();
      });
    });

    req.write('type=INVALID&price=170&quantity=1');
    req.end();
  });


  it('should reject invalid order prices', done => {
    const options = {
      hostname: 'localhost',
      port: port,
      path: '/order',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };

    const req = http.request(options, res => {
      let data = '';

      res.on('data', chunk => {
        data += chunk;
      });

      res.on('end', () => {
        assert.strictEqual(res.statusCode, 400);
        assert.strictEqual(data, 'Order price is not within allowed spread');
        done();
      });
    });

    req.write('type=BID&price=0&quantity=1');
    req.end();
  });

  const http = require('http');

it('should return trades', done => {
    const options = {
        hostname: 'localhost',
        port: port,
        path: '/trades',
        method: 'GET',
    };

    const req = http.request(options, res => {
        let data = '';

        res.on('data', chunk => {
            data += chunk;
        });

        res.on('end', () => {
            assert.strictEqual(res.statusCode, 200);
            assert.strictEqual(typeof JSON.parse(data), 'object');
            done();
        });
    });

    req.end();
});

it('should reject invalid requests', done => {
    const options = {
        hostname: 'localhost',
        port: port,
        path: '/invalid',
        method: 'GET',
    };

    const req = http.request(options, res => {
        let data = '';

        res.on('data', chunk => {
            data += chunk;
        });

        res.on('end', () => {
            assert.strictEqual(res.statusCode, 400);
            assert.strictEqual(data, 'Invalid request');
            done();
        });
    });

    req.end();
});
});