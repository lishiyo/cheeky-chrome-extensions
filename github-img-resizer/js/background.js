function createModel(elem) {
  var container = document.getElementById('pull_request_body'),
      defaultSizeX2 = 330,
      // ![image-alt](https://cloud.githubusercontent.com/assets/7489058/8714900/87aad6ec-2b48-11e5-89a1-10181c4d893b.png)
      defaultRegex = /!\[.+\]\((https?:\/\/cloud\.githubusercontent\.com\/assets\/[-a-zA-Z0-9@:%._\+~#=]{2,25}\/[-a-zA-Z0-9@:%._\+~#=]{2,25}\/[-a-zA-Z0-9@:%._\+~#=]{2,256}\.png)\)/,
      imageUrls = [];

  return {
    convertBtns: [].slice.call(elem.convertBtns),
    inputs: Array.prototype.slice.call(elem.inputs),
    resultsDiv: elem.resultsDiv,
    isImageUrl: function(url, opts){
      var regex = (opts && opts.regex) || defaultRegex;
      return regex.test(url); // true if match
    },
    getMarkdownUrls: function(){
      var values = this.inputs.map(function(input){
        return input.value;
      });

      return values.filter(Boolean);
    },
    getImageUrls: function(arr, regex, index) {
      var index = (index || 1); // default to first capturing group
      var regex = (regex || defaultRegex);

      return arr.map(function(fullUrl){
        var match = regex.exec(fullUrl);
        return (match!==null ? match[index] : '');
      }, this);
    },
    convertUrls: function(mkdownUrls, options) {
      // <img src="https://github.com/favicon.ico" width="48">
      var options = options || {};
      var toSize = options.toSize || defaultSizeX2;
      
      var imageUrls = this.getImageUrls(mkdownUrls);
      var urls = imageUrls.map(function(imageUrl) {
        if (!imageUrl.length) return;
        return "<img src=" + imageUrl + " width=" + toSize + ">";
      });

      return urls;
    },
    setupInputListeners: function() {
      var self = this;
      this.inputs.forEach(function(input) {
        input.addEventListener('input', function(){
          if (self.isImageUrl(input.value)) {
            input.style.backgroundColor = "#cdfd02"; // green
          } else {
            input.style.backgroundColor = "#ff000d";
          }
        });
        input.addEventListener('keyup', function(){
          if (!input.value.length) {
            input.style.backgroundColor = "#eee";
          }
        })
      });
    },
    getResults: function(options) {
      this.convertBtns.forEach(function(button){
        button.addEventListener('click', function(){
          mkdownUrls = this.getMarkdownUrls();
          var options = {
            toSize: button.dataset.size
          };
          var data = {
            urls: this.convertUrls(mkdownUrls, options)
          };

          this.render(data);
        }.bind(this));
      }, this);
    },
    render: function(data){
      var str = data.urls.join(" ");
      this.resultsDiv.childNodes[0].innerText = str;
      this.resultsDiv.style.opacity = 1.0;
    },
  }
}

document.addEventListener('DOMContentLoaded', function() {
  var inputs = document.getElementsByClassName("mkdown_image"),
      convertBtns = document.getElementsByTagName('button'),
      resultsDiv = document.getElementById('results');

  var model = createModel({
    inputs: inputs,
    convertBtns: convertBtns,
    resultsDiv: resultsDiv
  });

  model.setupInputListeners();
  model.getResults();
}, false);

