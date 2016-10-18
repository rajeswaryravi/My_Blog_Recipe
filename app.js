var express = require('express');
var app = express();
var path = require('path');
var uc;
var log_user_name;
var mongo=require('mongodb');
var mongoClient=mongo.MongoClient;
var url="mongodb://user:user@ds049864.mlab.com:49864/myblog";
mongoClient.connect(url,function(err,db){
	uc=db.collection('datas');
});  
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.post('/login', function(req, res) {
  var name = req.param('user');
  var user_name = req.param('username');
  var pass_word = req.param('pass');  
  res.sendFile(__dirname+'/login.html');
  uc.find({username:user_name}).toArray(function(err, docs) {
	if(docs.length==0&&user_name!=null&&pass_word!=null){
	    uc.insert({username:user_name, password:pass_word}, function(err, result) {
		res.sendFile(__dirname + '/login.html');
		});
	}
	else if(docs.length!=0){
	  	res.sendFile(__dirname+'/signup.html');
	   	}
	var newpass=req.param('log_user_password');
 	var conformfpass=req.param('log_user_conformpassword');
 	if(newpass==conformpass){
 	uc.update({username:log_user_name},
		{$set:{password:newpass}},{multi:true});
  	res.sendFile(__dirname+'/login.html');
 	}
  else{
  	res.sendFile(__dirname+'/reset.html');
  }	
}); 
var newpass=req.param('log_user_password');
var conformpass=req.param('log_user_conformpassword');
    if(newpass==conformpass){
	uc.update({username:log_user_name},
   {$set:{password:newpass}},{multi:true});
	  	res.sendFile(__dirname+'/login.html');
	 }
	  else{
	  	res.sendFile(__dirname+'/reset_pwd.html');
	  }	
});
app.post('/home', function(req, res) {
  var loguser_name = req.param('logusername');
  var logpassword = req.param('loguserpassword');  
   uc.find({username:loguser_name,password:logpassword}).toArray(function(err, docs) {
	if(docs.length!=0){
	   res.sendFile(__dirname+'/home.html');
	}
	else if(docs.length==0){
	  	res.sendFile(__dirname+'/login.html');
	}
}); 
});
app.post('/reset_password',function(req,res){
	log_user_name = req.param('log_username');
	uc.find({username:log_user_name}).toArray(function(err, docs) {
	if(docs.length!=0){
	  res.sendFile(__dirname+'/reset_password.html'); 
	}
	else{
		 res.sendFile(__dirname+'/forgot_password.html');
	}
});
});
app.use(express.static(path.join(__dirname, '/public')));  
app.use(express.static('public'));
app.get('/', function (req, res) {
   res.sendFile(__dirname+'/home.html'); 
});
app.get('/login', function (req, res) {
   res.sendFile(__dirname+'/login.html'); 
});
app.get('/signup', function (req, res) {
   res.sendFile(__dirname+'/signup.html'); 
}); 
app.get('/home', function (req, res) {
   res.sendFile(__dirname+'/home.html'); 
});
app.get('/forgot_password', function (req, res) {
   res.sendFile(__dirname+'/forgot_password.html'); 
});
app.get('/reset_password', function (req, res) {
   res.sendFile(__dirname+'/reset_password.html'); 
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
}); 
  

 
 
