function createModel(elem) {
  var container = document.getElementById('pull_request_body'),
      defaultSizeX2 = 330,
      inputs = [],
      imageUrls = [];

    var regexes = {
        // ![image-alt](https://cloud.githubusercontent.com/assets/7489058/8714900/87aad6ec-2b48-11e5-89a1-10181c4d893b.png)
        personal: /!\[.+\]\((https?:\/\/cloud\.githubusercontent\.com\/assets\/[-a-zA-Z0-9@:%._\+~#=]{2,25}\/[-a-zA-Z0-9@:%._\+~#=]{2,25}\/[-a-zA-Z0-9@:%._\+~#=]{2,256}\.png)\)/,
        // ![image](https://github.ewr01.tumblr.net/github-enterprise-assets/0000/0215/0000/6663/af60cc22-2a45-11e5-9044-1c266c2a6e45.png)
        tumblr: /!\[.+\]\((https?:\/\/github\.ewr01\.tumblr\.net\/github-enterprise-assets\/[-a-zA-Z0-9@:%._\+\/~#=]{2,256})\)/,
        // ![image](https://any-url-here)
        general: /!\[.+\]\((https?:\/\/[-a-zA-Z0-9@:%._\+\/~#=]{2,256})\)/g,
    };

    return {
        convertBtns: [].slice.call(elem.convertBtns),
        input: elem.input,
        resultsDiv: elem.resultsDiv,
        isImageUrl: function(url, opts){
          var regex = (opts && opts.regex) || regexes.general;
          return regex.test(url); // true if match
      },
      getMarkdownUrls: function(opts){
          // parse out markdown urls from large input blob
          var regex = (opts && opts.regex) || regexes.general;
          this.input = this.input.value;
          this.inputs = [];
          var match;

          while((this.inputs = regex.exec(this.input)) !== null) {
            console.log("my match is: ", this.inputs[0], regex.lastIndex);
          }

          // this.inputs = this.input.match(regex);

          // while((this.inputs = regex.exec(this.input)) != null) {
          //   console.log("found: " + this.inputs[0]);
          // }

          // var values = this.inputs.map(function(input){
          //   return input.value;
          // });

          console.log("get markdown urls", this.inputs);

          return this.inputs;
          // return values.filter(Boolean);
      },
      getImageUrls: function(arr, regex, index) {
          var index = (index || 1); // default to first capturing group
          var regex = (regex || regexes.general);

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

            var str = "<img src=" + imageUrl + " width=" + toSize + ">";
            return str;
          });

          return urls;
      },
      setupInputListeners: function(opts) {
          var self = this;

          this.inputs.forEach(function(input) {
            input.addEventListener('input', function(){
              if (self.isImageUrl(input.value)) {
                input.style.backgroundColor = "#cdfd02"; // green
              } else {
                input.style.backgroundColor = "#ff000d";
              }
            });
            // for empty input, go back to gray
            input.addEventListener('keyup', function(){
              if (!input.value.length) {
                input.style.backgroundColor = "#eee";
            }
          });
        });
      },
      getResults: function(opts) {
          this.convertBtns.forEach(function(button){
            button.addEventListener('click', function(){
              var mkdownUrls = this.getMarkdownUrls(opts);
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
      }
    };
}

document.addEventListener('DOMContentLoaded', function() {
    // var inputs = document.getElementsByClassName("mkdown_image"),
    // Parse out array of markdown Urls from input
    var input = document.getElementById("mkdown_images"),
        convertBtns = document.getElementsByTagName('button'),
        resultsDiv = document.getElementById('results');

    var opts = {};

    var model = createModel({
        // inputs: inputs,
        input: input,
        convertBtns: convertBtns,
        resultsDiv: resultsDiv
    });

    // model.setupInputListeners(opts);
    model.getResults();
}, false);

