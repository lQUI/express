const express = require('express');
const app = express();
const constants = require('./constants');
const bodyParser = require('body-parser');
const TestRouter = require('./routers/TestAuthRouter').default;


app.use('/static', express.static('public'));
app.set('view engine', 'jade');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(bodyParser.raw({
  type: '*/*'
}));

const testRouter = new TestRouter();


/**
* @api {get} /v3/test-api  3.1 Basic Parameterized Http Route
* @apiName BasicParamterizedHttpRoute
* @apiGroup Practice
* @apiPermission User
*
* @apiExample 测试方法:
* curl -i http://localhost:3000/v3/test-api
* 
* @apiSuccess {String} print 'Hello World!!'
* @apiDescription print 'Hello World!!'
*/
app.get(constants.ROUTE_PARAMS.VERSION + constants.ROUTE_PATHS.TEST_API, testRouter.helloWorld);

/**
* @api {get} /v:version/:action 3.2 Basic Query in Request
* @apiName QueryInRequest
* @apiGroup Practice
* @apiPermission User
*
* @apiExample 测试方法:
* curl -i http://localhost:3000/v3/test-api
*
* @apiDescription 使用get请求将a和b传到后台,后台计算它们的和后返回给页面
*
* @apiParam {Number} version  the app version
* @apiParam {String} action   the operate for two number
* @apiParam {Number} a
* @apiParam {Number} b
*
* @apiSuccessExample {json} Succes-response:
*     Http/1.1 200 ok
*     {
*       'ret' :1000,
*       'version':3,
*       'action':'plus',
*       'result':7
*     }
*/
app.get(constants.ROUTE_PARAMS.VERSION + constants.ROUTE_PARAMS.ACTION, testRouter.addOprate);

/**
* @api {post} /v:version/:action 3.3 URLEncoded Form in Request
* @apiName URLEncodedFormInRequest
* @apiGroup Practice
* @apiPermission User
*
* @apiExample 测试方法:
* curl -i http://localhost:3000/v3/test-api
*
* @apiDescription 通过post方法计算输入的a和b的值
*
* @apiParam {Number} version     the app version
* @apiParam {String} action      the operator for two number
* @apiParam {Number} a
* @apiParam {Number} b           
*
* @apiSuccessExample {json} Succes-response:
*    Http/1.1 200 ok
*    {
*      'ret' :1000,
*      'version':3,
*      'action':'plus',
*      'result':7
*    }
*/
app.post(constants.ROUTE_PARAMS.VERSION + constants.ROUTE_PARAMS.ACTION, testRouter.addOprate);

/**
*3.4  Html Template Engine Practice
*/
app.get(constants.ROUTE_PARAMS.VERSION + constants.ROUTE_PARAMS.NAMESPACE + constants.ROUTE_PARAMS.RESOURCE + constants.ROUTE_PATHS.LIST, function(req, res) {
  var students = [];
  for (i = 0; i < 5; i++) {
    var student = new Object();
    student.firstname = 'zs' + i;
    student.lastname = 'li' + i;
    student.age = parseInt(Math.random() * 100);
    students[i] = student
  }
  res.render('index', {
    students: students
  });
});

/**
*3.5 Logging to Multiple Files Differentiated by Levels
**/
app.post(constants.ROUTE_PARAMS.VERSION + constants.ROUTE_PARAMS.NAMESPACE + constants.ROUTE_PARAMS.LEVEL + constants.ROUTE_PARAMS.ACTION, testRouter.logUser);

/**
*3.6 Hiding Your Authentication Protected Service behind AuthMiddleware
**/
app.get(constants.ROUTE_PARAMS.USERID + constants.ROUTE_PATHS.WALLET + constants.ROUTE_PATHS.SELF + constants.ROUTE_PATHS.DETAIL, testRouter.checkUserLogin, testRouter.getDetail);

var server = app.listen(3000, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('example app listening at http://%s:%s', host, port);
});


