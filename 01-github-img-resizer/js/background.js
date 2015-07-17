function createModel(elem) {
    var container = document.getElementById('pull_request_body'),
        defaultSizeX2 = 330,
        inputs = [],
        imageUrls = [];

    var regexes = {
            // ![image-alt](https://cloud.githubusercontent.com/assets/7489058/8714900/87aad6ec-2b48-11e5-89a1-10181c4d893b.png)
            personal: /!\[.+\]\((https?:\/\/cloud\.githubusercontent\.com\/assets\/[-a-zA-Z0-9@:%._\+~#=]{2,25}\/[-a-zA-Z0-9@:%._\+~#=]{2,25}\/[-a-zA-Z0-9@:%._\+~#=]{2,256}\.png)\)/,

            // ![image](https://github.ewr01.tumblr.net/github-enterprise-assets/0000/0215/0000/6663/af60cc22-2a45-11e5-9044-1c266c2a6e45.png)
            tumblr: /!\[.+\]\((https?:\/\/github\.ewr01\.tumblr\.net\/github-enterprise-assets\/[-a-zA-Z0-9@:%._\+\/~#=]{2,256}\.png)\)/,

            // ![image](https://any-url-here)
            general: /^\!\[.+\]\((https?:\/\/[-a-zA-Z0-9@:%._\+\/~#=]{2,256}\.png){1}\)$/gm,
    };

    return {
        convertBtns: [].slice.call(elem.convertBtns),
        resultsDiv: elem.resultsDiv,
        getResults: function(opts) {
            this.convertBtns.forEach(function(button){
                button.addEventListener('click', function(){
                    // get the markdown urls
                    var mkdownUrls = this.parseMarkdownUrls(opts);
                    var options = {
                        toSize: button.dataset.size // X2 or X3
                    };
                    // convert markdown urls to image tags
                    var urls = this.markdownToImageTags(mkdownUrls, options);

                    this.render({ urls: urls });
                }.bind(this));
            }, this);
        },
        // Input listeners on input colors
        initInputListeners: function(opts) {
            elem.input.addEventListener('input', function(){
                if (this._hasValidImageUrl(elem.input.value)) {
                    elem.input.style.backgroundColor = opts.valid;
                } else {
                    elem.input.style.backgroundColor = opts.invalid;
                }
            }.bind(this));

            // for empty input, go back to gray
            elem.input.addEventListener('keyup', function(){
                if (!elem.input.value.length) {
                    elem.input.style.backgroundColor = opts.empty;
                }
            }.bind(this));
        },
        // parse markdown urls from large input blob
        parseMarkdownUrls: function(opts){
            var regex = (opts && opts.regex) || regexes.general;
            var text = elem.input.value;

            return (text.match(regex) || []);
        },
        // convert markdown urls to image urls => build string
        markdownToImageTags: function(mkdownUrls, options) {
            // <img src="https://github.com/favicon.ico" width="48">
            var options = options || {};
            var toSize = options.toSize || defaultSizeX2;

            var imageUrls = this._parseImageUrls(mkdownUrls);
            var urls = imageUrls.map(function(imageUrl) {
                if (!imageUrl.length) return;

                return "<img src=" + imageUrl + " width=" + toSize + ">";
            });

            return urls;
        },
        // parse plain image urls from markdown urls
        _parseImageUrls: function(arr, regex, index) {
            var index = (index || 1); // default to first capturing group
            var regex = (regex || regexes.general);

            return arr.map(function(fullUrl){
                var match = regex.exec(fullUrl);
                regex.lastIndex = 0; // reset so next is not null
                
                return (match!==null ? match[index] : '');
            }, this);
        },
        _hasValidImageUrl: function(url, opts){
            var regex = (opts && opts.regex) || regexes.general;
            return regex.test(url); // true if match
        },
        render: function(data){
            var str = data.urls.join(" ");

            this.resultsDiv.childNodes[0].innerText = str;
            this.resultsDiv.style.opacity = 1.0;
        },
    };
}

document.addEventListener('DOMContentLoaded', function() {
    // var inputs = document.getElementsByClassName("mkdown_image"),
    // Parse out array of markdown Urls from input
    var input = document.getElementById("mkdown_images"),
    convertBtns = document.getElementsByTagName('button'),
    resultsDiv = document.getElementById('results');

    var model = createModel({
        // inputs: inputs,
        input: input,
        convertBtns: convertBtns,
        resultsDiv: resultsDiv
    });

    var colors = {
        valid: "#cdfd02",
        invalid: "#ff000d",
        empty: "#eee"
    };

    model.initInputListeners(colors);
    model.getResults();

}, false);

