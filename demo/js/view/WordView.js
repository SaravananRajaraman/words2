define([
    'text!templates/words.html'
], function(Template){
    var self, thisType;
    return Backbone.View.extend({
        el: $('.wordDiv'),
        initialize: function(options){
            console.log("word Init");
            self = this;
            thisType = options.type;
            var compiledTemplate = _.template( Template );
            this.$el.append( compiledTemplate );
            self.getWords();
        },
        getWords: function(e){
            var obj = {
                "count": 100,
                "type": thisType
            };
            $.ajax({
                url: globalVar.endPoints.getWord[globalVar.server],
                type: 'GET',
                data : obj,
                dataType:"json",
                headers: { 'token': globalVar.token },
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
