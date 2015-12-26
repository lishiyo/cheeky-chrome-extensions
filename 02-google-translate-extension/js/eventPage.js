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
    console.log("create model targetBtns", model.targetBtns);
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
                const query = encodeURIComponent(inputEl.value);
                const params = {
                    q: query,
                    target: button.dataset.lang // data-lang=es
                };
                
                translate(params);
            });
        });
    };

    const render = (str) => {
        if (!resultsEl) {
            return;
        }

        const textNode = resultsEl.childNodes[0];

        if (!str.length) {
            textNode.innerText = "no translation, sorry :(";
        } else {
            // copyToClipboard(str);
            const span = document.createElement('span');
            span.innerText = str;
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
