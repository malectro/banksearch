(function () {
  BS.Model.Bank = Backbone.Model.extend({
    idAttribute: '_id',

    fattributes: function () {
      var attrs = _.clone(this.attributes);

      attrs.phone = ('' + attrs.phone);
      attrs.phone = '(' + attrs.phone.slice(0, 3) + ') ' + attrs.phone.slice(3, 6) + '-' + attrs.phone.slice(6, 10);

      return attrs;
    },

    distanceTo: function (latLng) {
      var geo = this.get('geo'),
          response;

      if (geo) {
        response = BS.App.map.distance(geo, latLng);
      }
      else {
        response = Infinity;
      }

      return response;
    }
  });

  BS.List.Bank = Backbone.Collection.extend({
    url: '/banks',
    model: BS.Model.Bank,

    comparator: function (bank) {
      if (BS.App.geopoint) {
        return bank.distanceTo(BS.App.geopoint);
      }
      else {
        return bank.get('name');
      }
    },

    search: function (params) {
      _.defaults(params, {
        query: '',
        mb: 1000,
        gid: false,
        of: false,
        nf: false
      });

      query = params.query.toLowerCase();
      return new BS.List.Bank(this.filter(function (bank) {
        return (bank.get('name').toLowerCase().match(query)
          || bank.get('address').toLowerCase().match(query))

          // minimum balance is less than balance given
          && bank.get('mb') <= params.mb

          // no government id is required if box is checked
          && (params.gid || !bank.get('gid'))

          // no opening phi
          && (!params.of || bank.get('of') === 0)

          // no fees at all
          && (!params.nf || (
            bank.get('of') === 0
            && bank.get('yf') === 0
            && bank.get('mf') === 0
          ));
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

