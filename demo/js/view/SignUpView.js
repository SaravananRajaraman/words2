define([
    'text!templates/signUp.html'
], function(Template){
    var self;
    return Backbone.View.extend({
        el: $('.signupDiv'),
        events:{
            "click .signUpSubmit" : "signUpSubmit"
        },
        initialize: function(){
            console.log("signup Init");
            self = this;
            var compiledTemplate = _.template( Template );
            this.$el.append( compiledTemplate );
        },
        signUpSubmit: function(e){
            var signUpName = $(".signUpName").val();
            var signUpEmail = $(".signUpEmail").val();
            var signUpPwd = $(".signUpPwd").val();
            var obj = {
                "email": signUpEmail,
                "password" : signUpPwd,
                "username" : signUpName
            };
            $.ajax({
                url: globalVar.endPoints.signup[globalVar.server],
                type: 'POST',
                data : obj,
                dataType:"json",
                success:function(data){
                    console.log(data);
                },
                error:function(err){
                    console.log(err);
                }
            });
        },
        onClose: function(){
            self.undelegateEvents();
        }
    });
});