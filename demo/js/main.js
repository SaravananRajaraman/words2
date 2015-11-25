require.config({
    paths: {
        text: 'libs/require/text'
    }
});
require(['Router'],
    function( Router ){
        window.globalVar = {};
        globalVar.server = 1 ;
        globalVar.local = "./js/json/";
        //globalVar.api = "http://creatorjs.herokuapp.com/" ;
        globalVar.api = "http://localhost:3000/" ;
        globalVar.endPoints ={
            login:[
                globalVar.local + 'login.json',
                globalVar.api + 'users/signIn'
            ],
            signup:[
                globalVar.local + 'login.json',
                globalVar.api + 'users/signUp'
            ],
            forgotPwd:[
                globalVar.local + 'login.json',
                globalVar.api + 'users/restPwdToken'
            ],
            verifyLogin:[
                globalVar.local + 'login.json',
                globalVar.api + 'users/verifyToken'
            ],
            verifyPwd:[
                globalVar.local + 'login.json',
                globalVar.api + 'users/verifyRestPwdToken'
            ],
            resetPwd:[
                globalVar.local + 'login.json',
                globalVar.api + 'users/restPwd'
            ],
            getWord:[
                globalVar.local + 'login.json',
                globalVar.api + 'words'
            ]
        };
        window.cookie = { // refer in http://www.w3schools.com/js/js_cookies.asp
            getCookie: function(cname) {
                var name = cname + "=";
                var ca = document.cookie.split(';');
                for(var i=0; i<ca.length; i++) {
                    var c = ca[i];
                    while (c.charAt(0)==' ') c = c.substring(1);
                    if (c.indexOf(name) != -1) {
                        return c.substring(name.length, c.length);
                    }
                }
                return "";
            },
            setCookie: function(cname,cvalue,exdays) {
                var d = new Date();
                d.setTime(d.getTime() + (exdays*24*60*60*1000));
                //var domain =(config.siteDomain!=""?("domain=" + config.siteDomain):"");
                var expires = "expires=" + d.toGMTString();
                var path = "path=/";
                document.cookie = cname+"="+cvalue+"; "+path+"; "+expires;
                //document.cookie = cname+"="+cvalue+"; path=/; "+domain+"; "+expires;
            },
            deleteCookies: function() {
                cookie.setCookie('username', null, -1);
                cookie.setCookie('token', null, -1);
            }
        };
        var appRouter = new Router;
        Backbone.history.start();
    });