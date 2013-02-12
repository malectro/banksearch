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
      return new BS.List.Bank(this.filter(function (bank) {
        return bank.get('name').toLowerCase().match(query) || bank.get('address').toLowerCase().match(query);
      }));
    },

    geoBounds: function () {
      if (!this.bounds) {
        var first = this.at(0).get('geo'),
            bounds = {
              ne: {lat: first.lat, lng: first.lng},
              sw: {lat: first.lat, lng: first.lng}
            };

        this.each(function (bank) {
          var geo = bank.get('geo');

          if (geo.lat && geo.lng) {
            if (geo.lat > bounds.ne.lat) {
              bounds.ne.lat = geo.lat;
            }
            else if (geo.lat < bounds.sw.lat) {
              bounds.sw.lat = geo.lat;
            }

            if (geo.lng > bounds.ne.lng) {
              bounds.ne.lng = geo.lng;
            }
            else if (geo.lng < bounds.sw.lng) {
              bounds.sw.lng = geo.lng;
            }
          }

          if (geo.lng > 0) {
            kyle = bank;
            console.log(bank);
          }
        });

        this.bounds = bounds;
      }

      return this.bounds;
    }
  });
}());

