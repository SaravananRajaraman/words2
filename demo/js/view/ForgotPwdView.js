define([
    'text!templates/forgotPwd.html'
], function(Template){
    var self;
    return Backbone.View.extend({
        el: $('.forgorDiv'),
        events:{
            "click .forgotSubmit" : "forgotSubmit"
        },
        initialize: function(){
            console.log("forgotPwd Init");
            self = this;
            var compiledTemplate = _.template( Template );
            this.$el.append( compiledTemplate );
        },
        forgotSubmit: function(e){
            var forgotEmail = $(".forgotEmail").val();
            var obj = {
                "email": forgotEmail
            };
            $.ajax({
                url: globalVar.endPoints.forgotPwd[globalVar.server],
                type: 'POST',
                data : obj,
                dataType:"json",
                success:function(data){
                    console.log(data);
                    location.href = "#resetPwd/"+data.token;
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