
/**
 * Module dependencies.模块依赖
 */

/*  req.flash()方法在Express3.0中已经被删掉，要怎么用？
npm install connect-flash  安装这个模块
在 app.configure里加入 app.use(flash())
 */
var express = require('express')
  , routes = require('./routes')
  , user = require('./node_modules/user.js')
  , http = require('http')
  , path = require('path')
  , ejs = require('ejs');

var app = express();

var MongoStore = require('connect-mongo')(express);
var settings = require('./settings'); 
var flash = require('connect-flash');

// all environments环境变量
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.engine('.html', ejs.__express);//注意这里是两个下划线
app.set('view engine', 'html');// app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(flash());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({
	secret: settings.cookieSecret,
	store: new MongoStore({
		db: settings.db
	})
}));
app.use(function(req, res, next){
    res.locals.user = req.session.user;	
	res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
	next();
});
app.use(app.router);//注意这里
app.use(express.static(path.join(__dirname, 'public')));
routes(app);//注意这里,routes的参数是app，见routes文件夹中的路由设置。作用是接收路由控制。



// development only开发模式
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
//路径解析-，随着规模扩大其维护难度不断提高，因此我们需要把所有的路由规则分离出去。
/* app.get('/', routes.index);
app.get('/u/:user', routes.user);
app.post('/post', routes.post);
app.get('/reg', routes.reg);
app.post('/reg', routes.doReg);
app.get('/login', routes.login);
app.post('/login', routes.doLogin);
app.get('/logout', routes.logout); */
//启动及端口
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
