var assert = require('assert')
    , error = require('../index')
    , http = require('http');

describe('error parser', function() {

    it('should return 400: Generic 400', function(done){

        var message = 'Generic 400',
            statusCode = 400,
            e = error.parse(message);

        assert(e.message === message);
        assert(e.statusCode === statusCode);
        done();
    });

    it('should return 500: Generic 500', function(done){

        var message = 'Generic 500',
            statusCode = 500,
            e = error.parse(message);

        assert(e.message === message);
        assert(e.statusCode === statusCode);
        done();
    });

    it('should return 500: Bad robot!', function(done){

        var message = 'Bad robot!',
            e = error.parse({message: message});

        assert(e.message === message);
        assert(e.statusCode === 500);
        done();
    });

    it('should return 403: You shall not pass!', function(done){

        var message = 'You shall not pass!',
            statusCode = 403,
            e = error.parse({message: message, statusCode: statusCode});

        assert(e.message === message);
        assert(e.statusCode === statusCode);
        done();
    });

    it('should return 403: You shall not pass! (param variation)', function(done){

        var message = 'You shall not pass!',
            statusCode = 403,
            e = error.parse({message: message, status: statusCode});

        assert(e.message === message);
        assert(e.statusCode === statusCode);
        done();
    });

    it('should return 404: Not found (statusCode as number)', function(done){

        var statusCode = 404,
            e = error.parse(statusCode);

        assert(e.message === http.STATUS_CODES[statusCode]);
        assert(e.statusCode === 404);
        done();
    });

    it('should return 404: Not found (statusCode as string)', function(done){

        var statusCode = '404',
            e = error.parse(statusCode);

        assert(e.message === http.STATUS_CODES[statusCode]);
        assert(e.statusCode === 404);
        done();
    });

    it('should return 500: Internal Server Error (passing invalid HTTP status code and no message)', function(done){

        var e = error.parse(900);

        assert(e.message === http.STATUS_CODES[500]);
        assert(e.statusCode === 500);
        done();
    });

    it('should return 500: Internal Server Error (passing invalid object keys)', function(done){

        var e = error.parse({boo: 'hello', baa: 'scooter'});

        assert(e.message === http.STATUS_CODES[500]);
        assert(e.statusCode === 500);
        done();
    });

    it('should return 500: Internal Server Error (passing in an array)', function(done){

        var e = error.parse([]);

        assert(e.message === http.STATUS_CODES[500]);
        assert(e.statusCode === 500);
        done();
    });

    it('should return 500: Some bad error bro (passing in an array with a string at index 0)', function(done){

        var message = 'Some bad error bro',
            e = error.parse([message]);

        assert(e.message === message);
        assert(e.statusCode === 500);
        done();
    });

    it('should return 500: Some bad error bro (passing in an object with key "error"', function(done){

        var message = 'Some bad error bro',
            e = error.parse({error: message});

        assert(e.message === message);
        assert(e.statusCode === 500);
        done();
    });

    it('should return 503: Service Unavailable (passing in an error code without a message', function(done){

        var statusCode = 503,
            e = error.parse({code: statusCode});

        assert(e.message === http.STATUS_CODES[statusCode]);
        assert(e.statusCode === statusCode);
        done();
    });

    it('should return 503: Service Unavailable (passing in an error code without a message (param variation a)', function(done){

        var statusCode = 503,
            e = error.parse({statusCode: statusCode});

        assert(e.message === http.STATUS_CODES[statusCode]);
        assert(e.statusCode === statusCode);
        done();
    });

    it('should return 503: Service Unavailable (passing in an error code without a message (param variation b)', function(done){

        var statusCode = 503,
            e = error.parse({status: statusCode});

        assert(e.message === http.STATUS_CODES[statusCode]);
        assert(e.statusCode === statusCode);
        done();
    });

    it('should return 404: Not Found (passing in an Error object)', function(done){

        var statusCode = 404,
            realError = new Error(),
            e;

        realError.statusCode = statusCode;

        e = error.parse(realError);

        assert(e.message === http.STATUS_CODES[statusCode]);
        assert(e.statusCode === statusCode);
        done();
    });

    it('should return 404: Not Found (passing in an Error object variant a)', function(done){

        var statusCode = 404,
            realError = new Error(),
            e;

        realError.status = statusCode;

        e = error.parse(realError);

        assert(e.message === http.STATUS_CODES[statusCode]);
        assert(e.statusCode === statusCode);
        done();
    });

    it('should return 505: Internal Server Error (passing in an Error object variant b)', function(done){

        var e = error.parse(new Error());

        assert(e.message === http.STATUS_CODES[500]);
        assert(e.statusCode === 500);
        done();
    });

    it('should return 505: Internal Server Error (passing in an Error object variant c)', function(done){

        var message = 'Bad error',
            e = error.parse(new Error(message));

        assert(e.message === message);
        assert(e.statusCode === 500);
        done();
    });

    describe('passing in invalid arguments', function() {

        it('should return 505: Internal Server Error (missing arg)', function(done){
            var e = error.parse();
            assert(e.message === http.STATUS_CODES[500]);
            assert(e.statusCode === 500);
            done();
        });

        it('should return 505: Internal Server Error (undefined)', function(done){
            var e = error.parse(undefined);
            assert(e.message === http.STATUS_CODES[500]);
            assert(e.statusCode === 500);
            done();
        });

        it('should return 505: Internal Server Error (NaN)', function(done){
            var e = error.parse(NaN);
            assert(e.message === http.STATUS_CODES[500]);
            assert(e.statusCode === 500);
            done();
        });

        it('should return 505: Internal Server Error (Infinity)', function(done){
            var e = error.parse(Infinity);
            assert(e.message === http.STATUS_CODES[500]);
            assert(e.statusCode === 500);
            done();
        });

        it('should return 505: Internal Server Error (false)', function(done){
            var e = error.parse(false);
            assert(e.message === http.STATUS_CODES[500]);
            assert(e.statusCode === 500);
            done();
        });

        it('should return 505: Internal Server Error (true)', function(done){
            var e = error.parse(false);
            assert(e.message === http.STATUS_CODES[500]);
            assert(e.statusCode === 500);
            done();
        });
    });
});