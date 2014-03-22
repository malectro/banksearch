(function () {
  BS.Model.BankCompany = Backbone.Model.extend({
    idAttribute: '_id',
  });

  BS.List.BankCompany = Backbone.Collection.extend({
    url: '/bank_companies',
    model: BS.Model.BankCompany,

    comparator: function (company) {
      return company.get('name');
    }
  });
}());

