(function () {
  window.BS = {
    Model: {}, View: {}, List: {}
  };

  BS.tmpl = function (name, context) {
    return JST['templates/' + name](context);
  };

  $(function () {
    var BankSearch = Backbone.View.extend({
      el: $('main'),

      $search: $('.search'),
      query: '',

      events: {
        'keydown .search .query': 'filter'
      },

      initialize: function () {
        this.banks = new BS.List.Bank;
        this.map = new BS.View.Map({el: $('.g-map')});

        this.listenTo(this.banks, 'reset', this.filter);

        this.banks.fetch();
      },

      clear: function () {

      },

      filter: function () {
        var html = '',
            banks = [];

        this.query = this.$search.find('.query').val();

        if (this.query) {
          banks = this.banks.search(this.query);
        }
        else {
          banks = this.banks.models;
        }

        banks = banks.slice(0, 30);

        _.each(banks, function (bank) {
          html += BS.tmpl('bank_row', bank.attributes);
        });

        this.$('.bank-list').html(html);
      }
    });

    BS.App = new BankSearch;
  });
}());

