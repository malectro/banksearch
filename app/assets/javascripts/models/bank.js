(function () {
  BS.Model.Bank = Backbone.Model.extend({
    idAttribute: '_id'
  });

  BS.List.Bank = Backbone.Collection.extend({
    url: '/banks',
    model: BS.Model.Bank,

    comparator: function (bank) {
      return bank.get('name');
    },

    search: function (query) {
      query = query.toLowerCase();
      return this.filter(function (bank) {
        return bank.get('name').toLowerCase().match(query) || bank.get('address').toLowerCase().match(query);
      });
    },

    geoBounds: function () {
      
    }
  });
}());

