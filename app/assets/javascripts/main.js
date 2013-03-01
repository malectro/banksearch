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

      $window: $(window),
      $search: $('.search'),
      query: '',

      events: {
        'keydown .search .query': 'filter',
        'change .search input': 'filter',
        'click .bank-row': 'clickBank'
      },

      initialize: function () {
        this.banks = new BS.List.Bank;
        this.map = new BS.View.Map({el: $('.g-map'), app: this});

        this.listenTo(this.banks, 'reset', this.filter);

        this.$window.resize(_.bind(_.throttle(this.resize, 100), this));

        this.banks.fetch();
      },

      clear: function () {

      },

      filter: function () {
        var html = '',
            banks = [],
            params = this.$search.serializeObject();

        this.query = params.query;

        if (!params.mb) {
          params.mb = null;
        }
        else {
          params.mb = parseFloat(params.mb);
        }

        this.filteredBanks = this.banks.search(params);
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

        this.trigger('clickBank', bank);
      },

      resize: function (e) {
        this.trigger('resize', e);
      }
    });

    BS.App = new BankSearch;
  });
}());

