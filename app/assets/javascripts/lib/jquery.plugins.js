(function ($) {
  $.fn.serializeObject = function () {
    var ob = {};
    _.each(this.serializeArray(), function (field) {
      ob[field.name] = field.value;
    });
    return ob;
  };

  $.fn.scrollTo = function ($el) {
    this.each(function () {
      var offset = $el.offset();
      this.scrollTo(offset.left, offset.top - 10);
    });
  };
}(jQuery))

