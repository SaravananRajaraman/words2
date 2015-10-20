define([
    'text!templates/login.html'
], function(Template){
    var self;
    return Backbone.View.extend({
        el: $('.loginDiv'),
        events:{
            "click .loginSubmit" : "loginSubmit"
        },
        initialize: function(){
            console.log("login Init");
            self = this;
            var compiledTemplate = _.template( Template );
            this.$el.append( compiledTemplate );
        },
        loginSubmit: function(e){
            var loginEmail = $(".loginEmail").val();
            var loginPwd = $(".loginPwd").val();
            var obj = {
                "email": loginEmail,
                "password" : loginPwd
            };
            $.ajax({
                url: globalVar.endPoints.login[globalVar.server],
                type: 'POST',
                data : obj,
                dataType:"json",
                success:function(data){
                    console.log(data);
                    if( !data.error ){
                        globalVar.token = data.token;
                        location.href = "#word/synonyms";
                    }
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