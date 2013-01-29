(function () {
  BS.Model.Bank = Backbone.model.extend({
    idAttribute: '_id'
  });

  BS.List.Bank = Backbone.collection.extend({
    url: '/banks',
    model: BS.Model.Bank
  });
}());

