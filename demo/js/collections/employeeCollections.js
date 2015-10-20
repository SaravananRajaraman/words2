define(['models/employeeModel'], function(employeeModel){
    return Backbone.Collection.extend({
        model: employeeModel,
        initialize: function(){
//            this.on('add', this.addOne, this);
        }/*,
        addOne : function(model){
            var view = new HomeListItemView({model: model});
        }*/
    });
});