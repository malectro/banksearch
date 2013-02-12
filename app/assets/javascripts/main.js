(function () {
  window.BS = {
    Model: {}, View: {}, List: {}
  };

  BS.tmpl = function (name, context) {
    return JST['templates/' + name](context);
  };

  $(function () {
    var BankSearch = Backbone.View.extend({
      el: $('body'),

      $search: $('.search'),
      query: '',

      events: {
        'keydown .search .query': 'filter',
        'click .bank-row': 'clickBank'
      },

      initialize: function () {
        this.banks = new BS.List.Bank;
        this.map = new BS.View.Map({el: $('.g-map'), app: this});

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
          this.filteredBanks = this.banks.search(this.query);
        }
        else {
          this.filteredBanks = this.banks.clone();
        }

        banks = this.filteredBanks.slice(0, 30);

        _.each(banks, function (bank) {
          html += BS.tmpl('bank_row', bank.attributes);
        });

        this.$('.bank-list').html(html);
        this.trigger('filtered', this.filteredBanks);
      },

      clickBank: function (e) {
        var id = $(e.currentTarget).data('id'),
            bank = this.filteredBanks.get(id);

        console.log(bank);

        this.trigger('clickBank', bank);
      }
    });

    BS.App = new BankSearch;
  });
}());

