"use strict";

// chrome.runtime.getBackgroundPage((backgroundPageWindow) => {
//     console.log("got eventPage ", backgroundPageWindow);
// });

// Send message on browser action
// chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//     const activeTab = tabs[0];
//     chrome.tabs.sendMessage(activeTab.id, {
//         // can be any key
//         "message": "clicked_browser_action"
//     });
// });

const createModel = (model) => {
    const API_KEY = "AIzaSyAYblfYIG9BHl_XqkVLzds89t8bjNKIyak";
    const inputEl = model.inputEl; // destructuring not supported in 47 yet
    const targetBtns = [].slice.call(model.targetBtns); // HTMLCollection must be converted to array
    const resultsEl = model.resultsEl;

    // GET https://www.googleapis.com/language/translate/v2?q=hello+world!&target=zh-CN&key={YOUR_API_KEY}
    const createUrl = (params) => {
        const base = "https://www.googleapis.com/language/translate/v2?";
        const defaultParams = {
            target: "zh-CN",
            key: API_KEY,
            q: ""
        }
        const fullParams = Object.assign({}, defaultParams, params);
        let url = base;
        for (var param in fullParams) {
            url = url + param + "=" + fullParams[param] + "&";
        }
        return url;
    };

    const translate = (params) => {
        const url = createUrl(params);

        fetch(url)  
          .then((response) => {  
              if (response.status !== 200) {  
                console.log('Error! Status Code: ' +  response.status);  
                return;  
              }

              response.json().then(function(data) {  
                const translatedText = data.data.translations[0].translatedText;
                render(translatedText);
              });  
            }  
          ).catch((err) =>{  
            console.log('Fetch Error :-S', err);  
        });
    };

    const initListeners = () => {
        targetBtns.forEach((button) => {
            button.addEventListener('click', function(){
                // grab input from input Elem
                const query = (inputEl.value);
                const params = {
                    q: query,
                    target: button.dataset.lang // data-lang=es
                };
                
                translate(params);
            });
        });
    };

    const copyToClipboard = (text) => {
        const copyDiv = document.createElement('div');
        copyDiv.contentEditable = true;
        document.body.appendChild(copyDiv);
        copyDiv.innerText = text;
        copyDiv.unselectable = "off";
        copyDiv.focus();
        document.execCommand('SelectAll');
        document.execCommand("Copy", false, null);
        document.body.removeChild(copyDiv);
    };

    const render = (str) => {
        if (!resultsEl) {
            return;
        }

        const decodeHtmlEntity = function(str) {
            console.log("str", str);
              return str.replace(/&#(\d+);/g, function(match, dec) {
                return String.fromCharCode(dec);
              });
        };
        const textNode = resultsEl.childNodes[0];

        if (!str.length) {
            textNode.innerText = "no translation, sorry :(";
        } else {
            copyToClipboard(str);
            const span = document.createElement('span');
            span.innerText = decodeHtmlEntity(str);
            textNode.innerText = "";
            textNode.appendChild(span);
            resultsEl.style.opacity = 1.0;
            resultsEl.childNodes[0].classList.add("selected");
        }
    };

    return {
        initListeners
    };
}

document.addEventListener('DOMContentLoaded', () => {
    const inputEl = document.getElementById("input"),
    targetBtns = document.getElementsByClassName("target-lang"),
    resultsEl = document.getElementById('results');

    const model = createModel({
        inputEl,
        targetBtns,
        resultsEl
    });

    model.initListeners();
});
