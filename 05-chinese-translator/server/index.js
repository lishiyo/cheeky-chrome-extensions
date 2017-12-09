'use strict';

const Hapi = require('hapi');
const Good = require('good');
const pinyin = require('./pinyin.js');

const server = new Hapi.Server();
server.connection({ port: 3000 });

server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply('Hello, world!');
    }
});

server.route({
    method: 'GET',
    path: '/{name}',
    handler: function (request, reply) {
        reply('Hello, ' + encodeURIComponent(request.params.name) + '!');
    }
});

server.route({
    method: 'GET',
    path: '/translate',
    handler: function (request, reply) {
      const query = request.query.q;
      const translation = query ? pinyin.translate(pinyin.cleanText(query.trim())) : '';
      // callback to reply fn with payload
      // where payload is string, buffer, a JSON serializable object, or a stream
      reply(translation)
        .code(200)
        .type('application/json');
    },
    config: {
      cors: true,
      description: 'translate hanzi into pinyin',
      tags: ['api', 'translate']
    }
});

server.register({
    register: Good,
    options: {
        reporters: {
            console: [{
                module: 'good-squeeze',
                name: 'Squeeze',
                args: [{
                    response: '*',
                    log: '*'
                }]
            }, {
                module: 'good-console'
            }, 'stdout']
        }
    }
}, (err) => {
    if (err) {
        throw err; // something bad happened loading the plugin
    }
    server.start((err) => {

        if (err) {
            throw err;
        }
        server.log('info', 'Server running at: ' + server.info.uri);
    });
});
