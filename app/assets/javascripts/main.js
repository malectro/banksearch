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
        'change .search-panel select': 'filter',
        'change .search .address': 'changeAddress',
        'keydown .search .address': 'enterAddress',
        'click .search-button': 'changeAddress',
        'click .search-panel-open': 'showQs',
        'click .search-panel-hide': 'hideQs'
      },

      initialize: function () {
        this.banks = new BS.List.Bank;
        this.map = new BS.View.Map({el: $('.g-map'), app: this});

        this.listenTo(this.banks, 'reset', this.filter);
        this.listenTo(this.map, 'clickMarker', this.showBank);

        this.$window.resize(_.bind(_.throttle(this.resize, 100), this));

        this.banks.fetch();

        $(window).scroll(_.debounce(_.bind(this.scrolled, this), 500));

        // we shouldn't show the dialog until we have spanish copy
        return;
        this.introModal = new BS.View.Modal();
        this.introModal.render();
      },

      showQs: function (e) {
        $('.search-panel-open').hide();
        $('.search-panel').show();
        e.preventDefault();
      },
      hideQs: function (e) {
        $('.search-panel').hide();
        $('.search-panel-open').show();
        e.preventDefault();
      },

      clear: function () {

      },

      clearAddress: function () {

      },

      enterAddress: function (e) {
        if (e.which === 13) {
          this.changeAddress(e);
        }
      },

      changeAddress: function (e) {
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

        e.preventDefault();
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
        banks = this.filteredBanks.slice(0, 20);
        this.slicedBanks = new BS.List.Bank(banks);

        _.each(banks, function (bank) {
          html += BS.tmpl('bank_info', bank.attributes);
        });

        this.$('.bank-list').html(html);

        if (banks.length) {
          this.currentRow = this.$('.bank-row').eq(0).addClass('selected');
        }

        this.trigger('filtered', this.filteredBanks);

        this.$window.scrollTop(0);
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

        this.bankView = (new BS.View.Bank({bank: bank})).render();

        //this.$('.bank-list').append(this.bankView.$el);

        this.bankView.show();
        //$(window).scrollTo($bankRow);
      },

      showBank: function (bank) {
        var top = this.$('#bank-row-' + bank.id).addClass('selected').offset().top;
        this.$window.scrollTop(top - 85);
      },

      scrolled: function (e) {
        var index, mapped, $row;
        var $rows = this.$('.bank-row');
        var top = this.$window.scrollTop();

        mapped = _.map($rows, function (row) {
          return $(row).offset().top;
        });
        index = _.sortedIndex(mapped, top);

        $row = $rows.eq(index);

        this.selectRow($row);
        this.trigger('selectedBank', this.banks.get($row.data('id')));
      },

      selectRow: function ($row) {
        if (this.currentRow) {
          this.currentRow.removeClass('selected');
        }

        this.currentRow = $row.addClass('selected');
      },

      resize: function (e) {
        this.trigger('resize', e);
      }
    });

    BS.App = new BankSearch;
  });
}());

