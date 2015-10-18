var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passwordHash = require('password-hash');
var crypto = require('crypto');

var users = require('../models/users');
var resetPwdToken = require('../models/reset-token');
var token = require('../models/token');

//Todo: Use cross Domain in global
router.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", 'Content-Type, X-Requested-With');
    next();
});


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


// parse application/json
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true
}));

router.post('/signIn',function(req, res, next) {
    var email = req.body.email;
    var password = req.body.password;
    var Authorization = crypto.randomBytes(16).toString('hex');
    users.find()
        .where('email').equals(email)
        .select('-__v -comments')
        .exec(function (err, doc){
            if(err){
                res.status(500).send({"message":"get failed","error":err});
            }else{
                if(doc.length == 0){
                    //res.status(500).send({"message":"Not found"});
                    res.send({error:"true","message":"Username not found"});
                }else{
                    if(passwordHash.verify(password, doc[0].password)){
                        var Token = new token({
                            email:email,
                            token:Authorization,
                            inTime : new Date().getTime(),
                            expire: new Date().getTime()+(1000*60*60*0.5)
                        });
                        Token.save(function(err) {
                            if (err){
                                res.status(500).send({"message":"Create token error","error":false});
                            }else{
                                //res.redirect('../words/?token=' + Authorization);
                                res.send({"message":"login successfully","error":false,"token":Authorization});
                                //res.send(Token);
                            }
                        });
                    }else{
                        res.send({"message":"error","error":true});
                    }
                }
            }
        });
    // res.send("Hi");
});

router.post('/signUp',function(req, res, next) {
    var hashedPassword = passwordHash.generate(req.body.password);
    var Users = new users({
        username:req.body.username,
        email:req.body.email,
        password:hashedPassword
    });
    Users.save(function(err) {
        if (err){
            res.status(500).send(err);
        }else{
            res.send(Users);
        }
    });
});

router.post('/signOut',function(req, res, next) {
    var Authorization = req.body.token;
    token.findOneAndRemove({token: Authorization}, function(err){
        if (err){
            res.status(500).send(err);
        }else{
            res.send({"message":"logout successfully","error":false});
            //res.render('login');
        }
    });
});

router.post('/verifyToken',function(req, res, next) {
    var Authorization = req.body.token;
    token.find()
        .where('token').equals(Authorization)
        .select('-__v -comments')
        .exec(function (err, doc){
            if(err){
                res.status(500).send({"message":"get failed","error":err});
            }else{
                if(doc.length == 0){
                    //res.status(500).send({"message":"Not found"});
                    res.send({error:"true","message":"token not found"});
                }else{
                    if(doc[0].expire > new Date().getTime()){
                        token.findOneAndUpdate(
                            { token: Authorization },
                            {  $set: { expire : new Date().getTime()+(1000*60*60*0.5) }},
                            { upsert: false },
                            function(err, doc) {
                                if(err){
                                    res.send({"message":"Invalid token","error":true});
                                }else{
                                    res.send({"message":"Valid","error":false});
                                }
                            });
                    }else{
                        res.send({"message":"Invalid token","error":true});
                    }
                }
            }
        });
});

router.post('/restPwdToken',function(req, res, next) {
    var email = req.body.email;

    users.find()
        .where('email').equals(email)
        .select('-__v -comments')
        .exec(function (err, doc){
            if(err){
                res.status(500).send({"message":"get failed","error":err});
            }else{
                if(doc.length == 0){
                    //res.status(500).send({"message":"Not found"});
                    res.send({error:"true","message":"Email not found"});
                }else{
                    var token = crypto.randomBytes(16).toString('hex');
                    console.log(email,token);
                    var ResetPwdToken = new resetPwdToken({
                        email:email,
                        token:token,
                        expire: new Date().getTime()+(1000*60*60*24*2)
                    });
                    ResetPwdToken.save(function(err) {
                        if (err){
                            res.status(500).send(err);
                        }else{
                            res.send({"message":"Reset password ","error":true, token:token});
                        }
                    });
                }
            }
        });


});

router.post('/verifyRestPwdToken',function(req, res, next) {
    var restToken = req.body.token;
    resetPwdToken.find()
        .where('token').equals(restToken)
        .select('-__v -comments')
        .exec(function (err, doc){
            if(err){
                res.status(500).send({"message":"get failed","error":err});
            }else{
                if(doc.length == 0){
                    //res.status(500).send({"message":"Not found"});
                    res.send({error:"true","message":"token not found"});
                }else{
                    if(doc[0].expire > new Date().getTime()){
                        res.send({"message":"valid reset token","error":false});
                    }else{
                        res.send({"message":"Invalid token","error":true});
                    }
                }
            }
        });
});

router.post('/restPwd',function(req, res, next) {
    var restToken = req.body.token;
    var hashedPassword = passwordHash.generate(req.body.password);
    resetPwdToken.find()
        .where('token').equals(restToken)
        .select('-__v -comments')
        .exec(function (err, doc){
            if(err){
                res.status(500).send({"message":"get failed","error":err});
            }else{
                if(doc.length == 0){
                    //res.status(500).send({"message":"Not found"});
                    res.send({error:"true","message":"token not found"});
                }else{
                    if(doc[0].expire > new Date().getTime()){
                        var email = doc[0].email;
                        users.findOneAndUpdate(
                            { email: email },
                            {  $set: { password:hashedPassword }},
                            { upsert: false },
                            function(err, doc) {
                                if(err){
                                    res.send({"message":"Fail to reset password","error":true});
                                }else{
                                    res.send({"message":"Password reset successfully","error":false});
                                }
                            });
                    }else{
                        res.send({"message":"Invalid token","error":true});
                    }
                }
            }
        });
});



module.exports = router;
