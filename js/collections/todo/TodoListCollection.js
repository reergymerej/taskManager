define([
  'jquery',
  'underscore',
  'backbone',
  'models/todo/TodoListModel'
], 
function(
  $, 
  _, 
  Backbone, 
  TodoListModel
){
  var TodoListCollection = Backbone.Collection.extend({
    url: 'lib/resteasy/api/todolists',
    model: TodoListModel,
    initialize: function(){}
  });
 
  return TodoListCollection;
});