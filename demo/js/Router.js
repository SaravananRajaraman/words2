define([], function(){
    var currentView;
    return Backbone.Router.extend({
        routes: {
            "login":"login",
            "signup":"signup",
            "forgotPwd":"forgotPwd",
            "resetPwd/:id":"resetPwd",
            "word/:type":"word"
            ,"*actions" : "defaultRoute"
        },
        defaultRoute: function(){
            location.href = "#login";
        },
        login: function(){
            this.reset();
            requirejs(['view/LoginView'], function(LoginView) {
                currentView = new LoginView();
            });
        },
        signup: function(){
            this.reset();
            requirejs(['view/SignUpView'], function(SignUpView) {
                currentView = new SignUpView();
            });
        },
        forgotPwd: function(){
            this.reset();
            requirejs(['view/ForgotPwdView'], function(ForgotPwdView) {
                currentView = new ForgotPwdView();
            });
        },
        resetPwd: function(id){
            this.reset();
            requirejs(['view/ResetPwdView'], function(ResetPwdView) {
                currentView = new ResetPwdView({"token":id});
            });
        },
        word: function(type){
            this.reset();
            requirejs(['view/WordView'], function(WordView) {
                currentView = new WordView({"type":type});
            });
        },
        reset: function(){
            $(".pageView").empty();
            if(currentView) {
                currentView.undelegateEvents();
                currentView.onClose();
            }
        }
    });
});