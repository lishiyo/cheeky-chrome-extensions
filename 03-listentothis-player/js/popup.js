const $ = document.getElementById.bind(document);

const loadVideo = (callback) => {
  // get a reference to the background page's window where we
  // have defined a snoocore instance on `window.reddit`
  const url = "/r/listentothis/top";

  return chrome.runtime.getBackgroundPage(bwindow => {
    return bwindow.reddit(url).listing({
      limit: 20
    }).then((slice) => {
      const randomIdx = Math.floor(Math.random() * (slice.children.length)); // 0-19
      const submission = slice.children[randomIdx].data;
      console.log("slice, slice.children", slice, slice.children);
      console.log("submission", submission);
      // var img = $('awwImg');
      // img.src = submission.thumbnail;
      const title = $('title');
      title.innerText = submission.title;
      // append to html
      const resultsEl = $('results');
      const span = document.createElement('span');
      span.innerText = JSON.stringify(slice.children);
      resultsEl.appendChild(span);

      callback();
    })
    .catch(callback);
  });
};

document.addEventListener('DOMContentLoaded', function() {
  loadVideo(console.error);
});
