const $ = document.getElementById.bind(document);
const PARSER = new DOMParser();

// get a reference to the background page's window where we
// have defined a snoocore instance on `window.reddit`
const URL_HOT = "/r/listentothis/hot";
const LIMIT = 20;

const loadVideo = (onSuccess, onError) => {
  chrome.storage.sync.get("data", dataObj => {
    loadVideoFromData(onSuccess, onError, dataObj.data);
  });
};

const loadVideoFromData = (onSuccess, onError, data) => { 
  // figure out index in current slice array (page of 20 videos)
  let currentIdx = (data && data.idx && data.idx < LIMIT) ? data.idx : 0;
  let currentAfter = (data && data.after) ? data.after : '';

  return chrome.runtime.getBackgroundPage(bwindow => {
    // check if we're at the end
    let options = {
      limit: LIMIT
    }; 
    if (currentIdx >= LIMIT) { // at 20, need to flip to next page
      currentIdx = 0;
      options.after = currentAfter; // add `after` key
    }
    console.log("currentIdx, sending in: ", currentIdx, options)
    return bwindow.reddit(URL_HOT).listing(options).then(slice => {
      const title = $('title');
      const resultsEl = $('results');
      
      let video = slice.children[currentIdx].data;
      // let video = getRandomVideo(slice.children);
      renderVideo(video, title, resultsEl);
     
      currentIdx = currentIdx + 1
      console.log("slice", slice);
      onSuccess({
        idx: currentIdx,
        after: slice.after 
      });
    })
    .catch(onError);
  });
}

const renderVideo = (video, title, resultsEl) => {
  // TODO: add score, link to youtube vid?
  let a = document.createElement('a');
  a.setAttribute('href', video.url);
  a.innerHTML = video.title;
  title.innerHTML = ''; // clear
  title.appendChild(a);

  // add iframe
  let embed = video.media.oembed;
  let htmlDoc = PARSER.parseFromString(unescapeHtml(embed.html), "text/html");
  let iframe = htmlDoc.getElementsByTagName("iframe")[0];
  iframe.src = iframe.src + "?rel=0&autoplay=1";
  resultsEl.appendChild(iframe); 
}

const getRandomVideo = (results) => {
  const randomIdx = Math.floor(Math.random() * (results.length)); // 0-19
  return results[randomIdx].data;
}

const unescapeHtml = (input) => {
  let temp = document.createElement("div");
  temp.innerHTML = input;
  let result = temp.childNodes[0].nodeValue;
  temp.removeChild(temp.firstChild);
  return result;
}

const saveCurrentData = (data) => {
  chrome.storage.sync.set({
    'data': data
  }, function() {
    console.log('data saved', data);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadVideo(data => {
    saveCurrentData(data);
  }, console.error);
});
