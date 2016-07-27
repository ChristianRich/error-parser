# Node Error Formatter
Node.js error handling module capable of interpreting any kind of error into a well formatted Error object.

Parses error messages of unknown format into native JavaScript Error objects.  

This is useful when receiving error responses from 3rd party APIs, modules or services where you have no control over what error messages contain, their data type and format.  

This helper guarantees to return a well formatted Error object by analysing the data type and structure of the error object and promises to return error.message and error.statusCode.  

If an error cannot be analysed a 500 Internal Server Error is returned.

## Example  
```javascript
var error = require('node-error-formatter')  
    , someService = require('someService');  
    
someService.doSomething()
    .then(function(data){
        // Handle success
    })
    
    .catch(function(err){
        
        // We can't tell for sure what data type err is or what it contains
        // It might be an object containing a message key, a string, an array or an instance of Error
        // By using the error parser you are guaranteed an instance of Error
        var error = error.create(err); 
        
        console.log(error.statusCode); // 403
        console.log(error.message); // "Forbidden"
    });
```

### Usage examples and acceptable parameters

All error.create calls return a JavaScript Error object containing the properties message and statusCode.

```
// Passing a string:  
var e = error.create('Bad robot!');  
console.log(e.message); // 'Bad robot!'  
console.log(e.statusCode); // 500  

// Passing a http status code and a message  
var e = error.create(503, 'Bad robot!');  
console.log(e.message); // 'Bad robot!'  
console.log(e.statusCode); // 503  

// Passing an http status code but no message default to standard http codes
var e = error.create(503);  
console.log(e.message); // 'Service Unavailable'  
console.log(e.statusCode); // 503  

// Not passing any arguments results in 500 Internal Server Error
var e = error.create();  
console.log(e.message); // 'Internal Server Error'  
console.log(e.statusCode); // 500  

// Object containing key statusCode
var e = error.create({statusCode: 403});  
console.log(e.message); // 'Forbidden'  
console.log(e.statusCode); // 403  

// Object containing key code
var e = error.create({code: 403});  
console.log(e.message); // 'Forbidden'  
console.log(e.statusCode); // 403  

// Object containing key status
var e = error.create({status: 403});  
console.log(e.message); // 'Forbidden'  
console.log(e.statusCode); // 403  

// Object containing key errorCode
var e = error.create({errorCode: 403});  
console.log(e.message); // 'Forbidden'  
console.log(e.statusCode); // 403 

```
### install  
`npm install node-error-formatter --save`

### test  
`npm test`
