// import dotenv from 'dotenv';
// dotenv.load();
// import axios from 'axios';
// import fs from 'fs';

// let url = "https://www.googleapis.com/language/translate/v2";
// let target='zh-CN';
// let query="hello world!! one + two is three :) 100%";
// var outputFilename = './results.json';

// const getTranslation = () => {
//     axios.get(url, {
//         params: {
//           key: process.env.TRANSLATE_SERVER_KEY,
//           q: query,
//           target: target
//         }
//     })
//     .then(response => {
//         const resultsArr = response.data.data.translations;
//         fs.writeFile(outputFilename, JSON.stringify(resultsArr), err => {
//             if (err) {
//               console.log(err);
//             } else {
//               console.log("JSON saved to " + outputFilename);
//             }
//         });
//     })
//     .catch(response => {
//         console.log("error", response);
//     });
// }

// getTranslation();
