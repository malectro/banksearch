(function (window) {
  var Mel = window.Mel = {
    Model: {}, View: {}, Collection: {}
  };

  Mel.tmpl = function (name, context) {
    return JST['admin/templates/' + name](context);
  };

  $.fn.serializeObject = function () {
    var ob = {};
    _.each(this.serializeArray(), function (field) {
      ob[field.name] = field.value;
    });
    return ob;
  };

  $(function () {
    var MelView = Mel.View.Mel = Backbone.View.extend({

      el: $('main'),
      $win: $(window),
      $body: $(document.body),
      views: [],

      events: {
        'click button': 'create',
        'click': 'anyClick',
        'keydown .search': 'filter',
        'click .geocode': 'geocode',
        'click .import-csv': 'importCsv',
        'click .destroy-all': 'destroyAll'
      },

      initialize: function () {
        this.setSource('Bank');
      },

      render: function () {

      },

      setSource: function (model) {
        this.dataList = new Mel.Collection[model];
        this.dataRowView = Mel.View[model];
        this.dataEditView = Mel.View[model + "Full"];

        this.listenTo(this.dataList, 'add', this.addOne);
        this.listenTo(this.dataList, 'reset', this.addAll);
        this.listenTo(this.dataList, 'all', this.render);

        this.dataList.fetch();
      },

      addOne: function (ob) {
        var view = new this.dataRowView({model: ob});
        this.$('data').append(view.render().el);
        this.listenTo(view, 'edit', this.editOne);
        this.views.push(view);
      },

      addAll: function () {
        this.$('data').html('');
        this.dataList.each(this.addOne, this);
      },

      create: function () {
        this.dataList.create();
      },

      editOne: function (ob) {
        var view = new this.dataEditView({model: ob});
        this.popUp(view.render().$el);
      },

      anyClick: function (e) {
        this.trigger('anyClick', e);
      },

      clear: function () {
        _.each(this.views, function (view) {
          view.remove();
        });
      },

      filter: function (e) {
        var val = this.$('.search').val();
        var list;

        this.clear();

        if (val) {
          list = this.dataList.search(val);
          _.each(list, this.addOne, this);
        }
        else {
          this.addAll();
        }
      },

      geocode: function () {
        function callback(result, status) {
          i++;
          if (i < self.dataList.length) {
            _.defer(start);
          }
          else {
            done();
          }
        }

        function start() {
          var bank = self.dataList.at(i);

          if (bank && !bank.get('geo').lat) {
            bank.geocode(callback);
          }
          else {
            i++;
            if (i < self.dataList.length) {
              _.defer(start);
            }
            else {
              done();
            }
          }
        }

        function done() {
          alert('Gelocation finished.');
        }

        var self = this,
            i = 0;

        start();
      },

      importCsv: function () {
        var uploader = new Mel.View.Uploader;
        this.popUp(uploader.render().$el);
      },

      destroyAll: function () {
        if (confirm("Are you sure you'd like to delete all the banks?")) {
          var self = this;
          $.ajax('/admin/banks/all', {method: 'delete', complete: function () {
            self.dataList.fetch();
          }});
        }
      },

      popUp: function ($el) {
        $el.hide().css({top: window.scrollY + this.$win.height(), opacity: 0});
        this.$el.append($el);
        $el.show().animate({top: window.scrollY + 80, opacity: 1}, 200);
      },

      dropAway: function (view) {
        view.$el.transition({
          y: 600,
          opacity: 0,
          rotate: _.random(-30, 30) + 'deg'
        }, 400, function () {
          view.remove();
        });
      }
    });

    Mel.View.Uploader = Backbone.View.extend({
      tagName: 'panel',

      events: {
        'submit form': 'upload',
        'click': 'block'
      },

      initialize: function () {
        var self = this;

        _.defer(function () {
          self.listenTo(Mel.App, 'anyClick', self.close);
        });

        this.uploading = false;
      },

      render: function () {
        this.$el.html(Mel.tmpl('uploader'));
        this.$form = this.$('form');

        return this;
      },

      close: function () {
        if (!this.uploading) {
          Mel.App.dropAway(this);
        }
      },

      iframeName: (function () {
        var iframeCount = 0;

        return function () {
          return "uploader-frame" + (iframeCount++);
        }
      }()),

      upload: function (e) {
        var self = this,
            $form,
            $iframe,
            name = this.iframeName();

        if (!this.$form.attr('target')) {
          e.preventDefault();

          this.$form.attr({
            action: '/admin/banks/csv',
            method: 'post',
            enctype: 'multipart/form-data',
            target: name
          });

          $iframe = $('<iframe />');
          $iframe.hide().attr({
            src: 'about:blank',
            id: name,
            name: name
          }).appendTo(document.body).load(function () {
            Mel.App.dataList.fetch();
            self.uploading = false;
            self.close();
            $iframe.remove();
          });

          this.$form.submit();
        }
        else {
          this.uploading = true;
          this.$('input[type=submit]')
            .attr('disabled', 'disabled').val('Uploading...');
        }
      },

      block: function (e) {
        e.stopPropagation();
      }
    });

    Backbone.history.start({pushState: true, root: '/admin/'});
    Mel.App = new Mel.View.Mel;
  });

}(window));

