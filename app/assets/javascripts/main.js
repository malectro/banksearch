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
        'change .search .query': 'filter',
        'change .search-panel input': 'filter',
        'change .search .address': 'changeAddress',
        'keydown .search .address': 'enterAddress',
        'click .bank-row': 'clickBank'
      },

      initialize: function () {
        this.banks = new BS.List.Bank;
        this.map = new BS.View.Map({el: $('.g-map'), app: this});

        this.listenTo(this.banks, 'reset', this.filter);
        this.listenTo(this.map, 'clickMarker', this.expandBank);

        this.$window.resize(_.bind(_.throttle(this.resize, 100), this));

        this.banks.fetch();
      },

      clear: function () {

      },

      clearAddress: function () {

      },

      enterAddress: function (e) {
        if (e.which === 13) {
          this.changeAddress();
        }
      },

      changeAddress: function () {
        var self = this,
            params = this.$search.serializeObject(),
            address = params.address;

        this.address = address;

        if (address) {
          this.map.geocode(this.address, function (info) {
            if (info) {
              self.address = info.address;
              self.$('.search .address').val(info.address);
              self.geopoint = info;
            }
            else {
              self.geopoint = null;
            }

            self.banks.sort();
            self.filter();
          });
        }
        else {
          this.geopoint = null;
          this.banks.sort();
          this.filter();
        }
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

        params.geopoint = this.geopoint;

        this.filteredBanks = this.banks.search(params);
        banks = this.filteredBanks.slice(0, 30);

        _.each(banks, function (bank) {
          html += BS.tmpl('bank_row', bank.attributes);
        });

        this.$('.bank-list').html(html);
        this.trigger('filtered', this.filteredBanks);
      },

      clickBank: function (e) {
        var $target = $(e.currentTarget),
            id = $target.data('id'),
            bank = this.filteredBanks.get(id);

        this.expandBank(bank);

        this.trigger('clickBank', bank);
      },

      expandBank: function (bank) {
        if (this.bankView) {
          this.bankView.hideAndRemove();
        }

        var $bankRow = $('#bank-row-' + bank.id);

        this.bankView = (new BS.View.Bank({bank: bank})).render();

        $bankRow.after(this.bankView.$el);

        this.bankView.show();
        $(window).scrollTo($bankRow);
      },

      resize: function (e) {
        this.trigger('resize', e);
      }
    });

    BS.App = new BankSearch;
  });
}());

