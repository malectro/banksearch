(function () {
  var Gmaps;
  if (typeof google === 'undefined') {
    Gmaps = null;
  }
  else {
    Gmaps = google.maps;
  }

  var Map = BS.View.Map = Backbone.View.extend({

    geoStart: {
      lat: 40.68661,
      lng: -73.96506509999999
    },

    markers: [],

    initialize: function () {
      var self = this;

      this.$mapFrame = $('.g-map-frame');
      this.$mapBlur = $('.g-map-blur');
      this.app = this.options.app;

      if (Gmaps) {
        this.gmap = new Gmaps.Map(this.$('div')[0], {
          center: new Gmaps.LatLng(this.geoStart.lat, this.geoStart.lng),
          zoom: 11,
          mapTypeId: Gmaps.MapTypeId.ROADMAP,
          mapTypeControl: false,
          scrollwheel: false,
          overviewMapControl: false
        });

        this.geoPosition();

        this.iconShape = {
          coords: [25, 25, 25],
          shape: 'circle'
        };
        this.icon = {
          anchor: new Gmaps.Point(25, 25),
          scaledSize: new Gmaps.Size(25, 25),
          size: new Gmaps.Size(25, 25),
          url: '/assets/bank.png'
        };
      }

      this.listenTo(this.options.app, 'filtered', _.debounce(this.updateBounds, 1000));
      this.listenTo(this.options.app, 'clickBank', this.showInfo);
      this.listenTo(this.options.app, 'resize', this.resize);

      self.resize();

      _.delay(function() {
        self.resize();
      }, 1000);
    },

    geoPosition: function () {
      if (!Gmaps) {
        return;
      }

      var self = this;

      // for now we will only focus on NY
      self.gmap.setCenter(new Gmaps.LatLng(this.geoStart.lat, this.geoStart.lng));
      return;

      if (navigator && navigator.geolocation && navigator.geolocation.getCurrentPosition) {
        navigator.geolocation.getCurrentPosition(function (pos) {
          self.gmap.setCenter(new Gmaps.LatLng(pos.coords.latitude, pos.coords.longitude));
        });
      }
    },

    geocode: function (address, callback) {
      var self = this,
          geocoder = new Gmaps.Geocoder;

      geocoder.geocode({
        address: address,
        bounds: this.gbounds,
        location: this.gmap.getCenter()
      }, function (results, status) {
        if (status === 'OK') {
          callback({
            address: results[0].formatted_address,
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng()
          });
        }
        else {
          callback(null);
        }
      });
    },

    setBounds: function (bounds) {
      if (!Gmaps) {
        return;
      }

      var $win = $(window),
          width = $win.width(),
          height = $win.height(),
          ratioLat = (bounds.ne.lat - bounds.sw.lat) / this.$mapFrame.height(),
          ratioLng = (bounds.ne.lng - bounds.sw.lng) / this.$mapFrame.width(),
          pos = this.$mapFrame.position(),
          ne, sw;

      this.bounds = {
        ne: _.clone(bounds.ne), sw: _.clone(bounds.sw)
      };
      this.gbounds = new Gmaps.LatLngBounds(
        new Gmaps.LatLng(bounds.sw.lat, bounds.sw.lng),
        new Gmaps.LatLng(bounds.ne.lat, bounds.ne.lng)
      );

      this.center = {
        lat: bounds.sw.lat + (bounds.ne.lat - bounds.sw.lat) / 2,
        lng: bounds.sw.lng + (bounds.ne.lng - bounds.sw.lng) / 2
      };

      //hack
      pos.left += 50;

      bounds.ne.lng += (width - this.$mapFrame.width() - pos.left) * ratioLng;
      bounds.sw.lng -= pos.left * ratioLng;
      bounds.ne.lat += pos.top * ratioLat;
      bounds.sw.lat -= (height - this.$mapFrame.height() - pos.top) * ratioLat;

      ne = new Gmaps.LatLng(bounds.ne.lat, bounds.ne.lng);
      sw = new Gmaps.LatLng(bounds.sw.lat, bounds.sw.lng);

      this.gmap.fitBounds(new Gmaps.LatLngBounds(sw, ne));
      //this.setCenter(new Gmaps.LatLng(this.center.lat, this.center.lng));
    },

    setCenter: function (position) {
      var center = this.gmap.getCenter(),
          newCenter = {
            lat: position.lat() - this.center.lat,
            lng: position.lng() - this.center.lng
          };

      this.gmap.panTo(new Gmaps.LatLng(newCenter.lat + center.lat(), newCenter.lng + center.lng()));
      this.center = {lat: position.lat(), lng: position.lng()};
    },

    resize: function () {
      var windowWidth = this.app.$window.width(),
          windowHeight = this.app.$window.height(),
          offset = this.$mapFrame.offset(),
          blurBorderRight = _.max([windowWidth - this.$mapBlur.width() - offset.left, 0]),
          blurBorderBottom = _.max([windowHeight - this.$mapBlur.height() - offset.top, 0]);

      this.$mapBlur.css({
        borderWidth: "" + offset.top + "px "
          + blurBorderRight + "px " + blurBorderBottom + "px "
          + offset.left + 'px'
      });
    },

    updateBounds: function () {
      var bounds = BS.App.filteredBanks.geoBounds();

      if (bounds && bounds.ne.lat) {
        this.setBounds(bounds);
      }
      else {
        this.geoPosition();
      }

      this.updateMarkers();
    },

    updateMarkers: function () {
      var self = this;

      _.each(this.markers, function (marker) {
        marker.setMap(null);
      });

      this.markers = [];

      BS.App.filteredBanks.each(function (bank) {
        var geo = bank.get('geo'),
            marker = new Gmaps.Marker({
              map: self.gmap,
              position: new Gmaps.LatLng(geo.lat, geo.lng),
              title: bank.get('name'),
              flat: true,
              icon: self.icon
            }),
            info = new Gmaps.InfoWindow({
              content: BS.tmpl('bank_bubble', bank.fattributes())
            });

        Gmaps.event.addListener(marker, 'click', function () {
          self.showInfo(bank);
          self.trigger('clickMarker', bank);
        });
        self.markers.push(marker);

        bank.mapInfo = {
          marker: marker,
          info: info,
          zIndex: 20
        };
      });

      if (BS.App.filteredBanks.length) {
        self.showInfo(BS.App.filteredBanks.first());
      }
    },

    showInfo: function (bank) {
      if (this.currentInfo) {
        this.currentInfo.setMap(null);
      }

      bank.mapInfo.info.open(this.gmap, bank.mapInfo.marker);
      this.currentInfo = bank.mapInfo.info;
      this.setCenter(bank.mapInfo.marker.position);
    },

    distance: function (point1, point2) {
      return Gmaps.geometry.spherical.computeDistanceBetween(
        new Gmaps.LatLng(point1.lat, point1.lng), new Gmaps.LatLng(point2.lat, point2.lng)
      );
    }
  });

}());

