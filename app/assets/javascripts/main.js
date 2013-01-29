(function () {
  window.BS = {
    Model: {}, View: {}, List: {}
  };

  $(function () {
    var BankSearch = Backbone.view.extend({
      el: $('main'),

      $search: $('.search'),
      query: '',

      events: {
        'keydown .search .query': 'filter'
      },

      initialize: function () {
        this.banks = new BS.List.Bank;

        this.listenTo(this.banks, 'reset', this.filter);

        this.banks.fetch();
      },

      filter: function () {
        var html = '';

        this.query = this.$search.find('.query').val();

        if (this.query) {

        }
      }
    });

    BS.App = new BankSearch;
  });
}());

