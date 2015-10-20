define([
    'text!templates/resetPwd.html'
], function(Template){
    var self, token;
    return Backbone.View.extend({
        el: $('.resetPwdDiv'),
        events:{
            "click .resetSubmit" : "resetSubmit"
        },
        initialize: function(options){
            console.log("reset Init");
            self = this;
            token = options.token;
            var compiledTemplate = _.template( Template );
            this.$el.append( compiledTemplate );
        },
        resetSubmit: function(e){
            var resetPwd = $(".resetPwd").val();
            var obj = {
                "password": resetPwd,
                "token": token
            };
            $.ajax({
                url: globalVar.endPoints.resetPwd[globalVar.server],
                type: 'POST',
                data : obj,
                dataType:"json",
                success:function(data){
                    console.log(data);
                    if( !data.error ){
                        location.href = "#login";
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