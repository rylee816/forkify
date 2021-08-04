import { async } from "regenerator-runtime";
import { TIMEOUT_COUNTER } from "./config";

const timeout = function (s) {
    return new Promise(function (_, reject) {
      setTimeout(function () {
        reject(new Error(`Request took too long! Timeout after ${s} seconds`));
      }, s * 1000);
    });
  };


export const AJAX = async function(url, uploadData = undefined) {
  try {
    const fetchPro = uploadData ? fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(uploadData)
    }) : fetch(url);

    const request = await Promise.race([fetchPro, timeout(TIMEOUT_COUNTER)]);
    const res = await request.json();

    if (!request.ok) throw new Error(`${res.message}`);
    return res;

  } catch (err){
    throw err;
  }
}

// export const getJSON = async function(url){
//     try {
//         const request = await Promise.race([fetch(url), timeout(TIMEOUT_COUNTER)]);
//         const res = await request.json();

//         if (!request.ok) throw new Error(`${res.message}`);
//         return res;
//     } catch (err){
//         throw err;
//     }
// };

// export const sendJSON = async function(url, uploadData){
//   try {
//     const fetchPro = fetch(url, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify(uploadData)
//     });

//     const request = await Promise.race([fetchPro, timeout(TIMEOUT_COUNTER)]);
//     const res = await request.json();

//     if (!request.ok) throw new Error(`${res.message}`);
//     return res;
// } catch (err) {
//     throw err;
// }
// }