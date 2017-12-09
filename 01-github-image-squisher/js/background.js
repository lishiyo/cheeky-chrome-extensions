function createModel(elem) {
    const container = document.getElementById('pull_request_body'),
        defaultSizeX2 = 330,
        inputs = [],
        imageUrls = [];

    const regexes = {
            // ![image](https://user-images.githubusercontent.com/7489058/33798357-dba685ca-dce4-11e7-8f23-a30eb491c173.png)
            personal: /!\[.+\]\((https?:\/\/.+\.githubusercontent\.com\/[-a-zA-Z0-9@:%._\+~#=\/]{2,256}\.png)\)/,

            // ![image](https://github.xxx.xxx.net/github-enterprise-assets/0000/0215/0000/6663/af60cc22-2a45-11e5-9044-1c266c2a6e45.png)
            enterprise: /!\[.+\]\((https?:\/\/[-a-zA-Z.]*github.*\/[-a-zA-Z0-9@:%._\+~#=\/]{2,256}\.png)\)/,

            // ![image](https://any-url-here.png)
            general: /^\!\[.+\]\((https?:\/\/[-a-zA-Z0-9@:%._\+\/~#=]{2,256}\.png){1}\)$/gm,
    };

    function copyToClipboard(text) {
        let copyDiv = document.createElement('div');
        copyDiv.contentEditable = true;
        document.body.appendChild(copyDiv);
        copyDiv.innerText = text;
        copyDiv.unselectable = "off";
        copyDiv.focus();
        document.execCommand('SelectAll');
        document.execCommand("Copy", false, null);
        document.body.removeChild(copyDiv);
    }

    // parse plain image urls from markdown urls
    function parseImageUrls(arr, regex) {
        let regexToMatch = (regex || regexes.general); // default to general

        return arr.map(fullUrl => {
            let match = regexToMatch.exec(fullUrl);
            regexToMatch.lastIndex = 0; // reset so next is not null
            
            return (match !== null ? match[1] : '');
        }, this);
    }

    // @return true if we matched the regex
    function hasValidImageUrl(url, opts) {
        let regex = (opts && opts.regex) || regexes.general;
        return regex.test(url);
    }

    // parse markdown urls from large input blob
    function parseMarkdownUrls(opts) {
        let regex = (opts && opts.regex) || regexes.general;
        let text = elem.input.value;

        return (text.match(regex) || []);
    };

    return {
        convertBtns: [].slice.call(elem.convertBtns),
        resultsDiv: elem.resultsDiv,
        getResults: function(opts) {
            this.convertBtns.forEach(function(button){
                button.addEventListener('click', function(){
                    // get the markdown urls
                    let mkdownUrls = parseMarkdownUrls(opts);
                    // convert markdown urls to image tags
                    let urls = this.markdownToImageTags(mkdownUrls, {
                        toSize: button.dataset.size // X2 or X3
                    });

                    this.render({ urls: urls });
                }.bind(this));
            }, this);
        },
        // Input listeners on input colors
        initInputListeners: function(opts) {
            elem.input.addEventListener('input', function(){
                if (hasValidImageUrl(elem.input.value)) {
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
       
        // convert markdown urls to image urls => build string
        markdownToImageTags: function(mkdownUrls, opts) {
            // <img src="https://github.com/favicon.ico" width="48">
            let options = opts || {};
            let toSize = options.toSize || defaultSizeX2;
            let imageUrls = parseImageUrls(mkdownUrls);

            return imageUrls.map(imageUrl => {
                if (!imageUrl.length) return;

                return "<img src=" + imageUrl + " width=" + toSize + ">";
            });
        },
        
        render: function(data){
            let code = this.resultsDiv.childNodes[0];
            let str = data.urls.join(" ");

            if (!str.length) {
                code.innerText = "no images, sorry :(";
            } else {
                copyToClipboard(str);
                let span = document.createElement('span');
                span.innerText = str;
                code.innerText = "";
                code.appendChild(span);
                this.resultsDiv.style.opacity = 1.0;
                this.resultsDiv.childNodes[0].classList.add("selected");
            }
        }
    };
}

document.addEventListener('DOMContentLoaded', function() {
    // var inputs = document.getElementsByClassName("mkdown_image"),
    // Parse out array of markdown Urls from input
    const input = document.getElementById("mkdown_images"),
    convertBtns = document.getElementsByTagName('button'),
    resultsDiv = document.getElementById('results');
    const colors = {
        valid: "#cdfd02",
        invalid: "#ff1744",
        empty: "#eee"
    };

    const model = createModel({
        // inputs: inputs,
        input: input,
        convertBtns: convertBtns,
        resultsDiv: resultsDiv
    });
    model.initInputListeners(colors);
    model.getResults();

}, false);

