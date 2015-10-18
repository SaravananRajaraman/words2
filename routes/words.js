/**
 * Created by sarav_000 on 10/18/15.
 */
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var noAuthentication = [

];

var token = require('../models/token');
var antonyms = require('../models/antonyms');
var synonyms = require('../models/synonyms');

// parse application/json
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true
}));


//Todo: Use cross Domain in global
router.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", 'Content-Type, X-Requested-With');
    next();
});

// a middleware with no mount path, gets executed for every request to the router
router.use(function (req, res, next) {
    console.log('Time:', Date.now());
    var urls = req.method+req.url;
    console.log(urls,"Here");
    if(noAuthentication.indexOf(urls) == -1){
        if(req.header('token')){
            var Authorization = req.header('token');
            token.find()
                .where('token').equals(Authorization)
                .select('-__v -comments')
                .exec(function (err, doc){
                    if(err){
                        res.status(500).send({"message":"get failed","error":err});
                    }else{
                        if(doc.length == 0){
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
//                                            res.send({"message":"Valid","error":false});
                                            next();
                                        }
                                    });
                            }else{
                                res.send({"message":"Token expire","error":true});
                            }
                        }
                    }
                });
        }else{
            res.send({ error: true,message: "No Authentication token"});
        }
    }else{
        next();
    }
});

/* GET users listing. */
router.get('/', function(req, res, next) {
    var type = req.body.type || "synonyms";
    var count = req.body.count || 10;
    if(type == "synonyms"){
        synonyms.find().select('-__v').limit(count).exec(function (err, doc){
            if(err){
                res.send(err);
            }else{
                //console.log(req.headers['user-agent'],req.headers['host'],req._startTime,req._remoteAddress);
                res.send({ error: false,message: "Synonyms data found", words: doc});
            }
        });
    }else{
        antonyms.find().select('-__v').limit(count).exec(function (err, doc){
            if(err){
                res.send(err);
            }else{
                //console.log(req.headers['user-agent'],req.headers['host'],req._startTime,req._remoteAddress);
                res.send({ error: false,message: "Antonyms data found", words: doc});
            }
        });
    }
});


router.post('/', function(req, res, next) {
    var type = req.body.type || "synonyms";
    var lsd = req.body.lsd;
    var rsd = req.body.rsd;
    if(type == "synonyms"){
        var Synonyms = new synonyms({
            lsd:lsd,
            rsd:rsd
        });
        Synonyms.save(function(err,doc) {
            if (err){
                res.send(err);
            }else{
                res.send({ error: false,message: "Synonyms added", words: doc});
            }
        });
    }else{
        var Antonyms = new antonyms({
            lsd:lsd,
            rsd:rsd
        });
        Antonyms.save(function(err,doc) {
            if (err){
                res.send(err);
            }else{
                res.send({ error: false,message: "Antonyms added", words: doc});
            }
        });
    }
});

router.post('/update', function(req, res) {
    var type = req.body.type || "synonyms";
    var lsd = req.body.lsd;
    var rsd = req.body.rsd;
    if(type == "synonyms"){
        synonyms.findOneAndUpdate(
            { _id: req.body.id },
            {
                lsd:lsd,
                rsd:rsd
            },
            {upsert:false},function(err,doc) {
                if (err){
                    res.send(err);
                }else{
                    res.send({ error: false,message: "Synonyms update"});
                }
            });
    }else{
        antonyms.findOneAndUpdate(
            { _id: req.body.id },
            {
                lsd:lsd,
                rsd:rsd
            },
            {upsert:false},function(err,doc) {
                if (err){
                    res.send(err);
                }else{
                    res.send({ error: false,message: "Antonyms update"});
                }
            });
    }
});

router.delete('/', function(req, res) {
    var id = req.body.id;
    var type = req.body.type || "synonyms";
    if(type == "synonyms"){
        synonyms.remove({ _id: req.body.id }, function(err,doc) {
            if (err) {
                res.send('fail to delete');
            }
            else {
                res.send({ error: false,message: "Synonyms delete"});
            }
        });
    }else{
        antonyms.remove({ _id: req.body.id }, function(err,doc) {
            if (err) {
                res.send('fail to delete');
            }
            else {
                res.send({ error: false,message: "Antonyms delete"});
            }
        });
    }
});


module.exports = router;