(function () {
  BS.Model.Bank = Backbone.Model.extend({
    idAttribute: '_id',

    fattributes: function () {
      var attrs = _.clone(this.attributes);

      attrs.phone = ('' + attrs.phone);
      attrs.phone = '(' + attrs.phone.slice(0, 3) + ') ' + attrs.phone.slice(3, 6) + '-' + attrs.phone.slice(6, 10);

      return attrs;
    }
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
      if (!this.bounds && this.length > 0) {
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
        });

        this.bounds = bounds;
      }

      return this.bounds;
    }
  });
}());

