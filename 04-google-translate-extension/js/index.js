const BASE_URL = "https://translation.googleapis.com/language/translate/v2?key=";
const TARGET_LANG = "en";
const STORAGE_KEY = "google-translate-key";

// fire off the request
const translateText = (request, key, textData) => {
    let data = {
        q: textData.q, 
        target: textData.to || TARGET_LANG
    };
    if (textData.from != "auto") {
        data.from = textData.from;
    }
    
    let formattedJsonData = JSON.stringify(data);
    console.log('sending with key: ', key, formattedJsonData); 
    request.open('POST', BASE_URL + key);
    request.send(formattedJsonData); // send it off!
}

// handle the response
const onRequestSuccess = (response) => {
    console.log('request finished: ', response);
    let translations = response.data.translations;
    
    // handle the response
    let resultsDiv = document.getElementById('results');
    if (translations.length > 0) {
        resultsDiv.innerText = translations[0].translatedText;
    } else {
        resultsDiv.innerText = "No results :( detected source language: " + translations[0].detectedSourceLanguage;
    }
}

const saveCurrentKey = (key) => {
    chrome.storage.sync.set({
      "google-translate-key": key
    }, function() {
      console.log('data saved', key);
    });
}

const promptForKey = (shouldPrompt) => {
    const input = document.getElementById("input"),
    apiInput = document.getElementById('apikey');
    if (shouldPrompt) {
        input.setAttribute('placeholder', "you need an api key!");
        apiInput.focus();
    } else {
        input.setAttribute('placeholder', "READY: paste text here");
        apiInput.blur();
        input.focus();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const input = document.getElementById("input"),
    submitBtn = document.getElementById("submit"),
    apiInput = document.getElementById("apikey"),
    fromLang = document.getElementById("from"),
    toLang = document.getElementById("to");

    // setup once
    const request = new XMLHttpRequest();
    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            let data = JSON.parse(request.responseText);
            onRequestSuccess(data);
        } else {
            // We reached our target server, but it returned an error
            console.log("something went wrong", request);
        }
    };
    request.onerror = function() {
        console.log('request error');
    };
    submitBtn.addEventListener('click', () => {
        translateText(request, apiInput.value, {
            q: input.value,
            from: fromLang.value,
            to: toLang.value
        });
    })

    apiInput.addEventListener('input', event => {
        saveCurrentKey(apiInput.value);
        promptForKey(false)
    });

    // figure out api key
    chrome.storage.sync.get(STORAGE_KEY, results => {
        let key = results[STORAGE_KEY];
        console.log("sync! got key: ", results, key);
        if (key && key.length) {
            // we have a key, can make request
            apiInput.value = key;
            apiInput.blur();
            promptForKey(false);
        } else {
            promptForKey(true); 
        }
    });
    
   
    
}, false);