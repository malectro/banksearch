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
      $map: $('.g-map'),
      query: '',

      events: {
        'keydown .search .query': 'filter'
      },

      initialize: function () {
        this.banks = new BS.List.Bank;

        this.listenTo(this.banks, 'reset', this.filter);

        this.banks.fetch();

        this.map = new google.maps.Map(this.$map.find('div')[0], {
          center: new google.maps.LatLng(40.68661, -73.96506509999999),
          zoom: 11,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        });
        this.geo();
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
      },

      geo: function () {
        var self = this;

        if (navigator && navigator.geolocation && navigator.geolocation.getCurrentPosition) {
          navigator.geolocation.getCurrentPosition(function (pos) {
            self.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
          });
        }
      }
    });

    BS.App = new BankSearch;
  });
}());

