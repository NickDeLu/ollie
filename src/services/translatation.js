import axios from "axios";

export const detectLanguage = async (text) => {
  let url = `https://translation.googleapis.com/language/translate/v2/detect?key=${import.meta.env.VITE_TRANSLATION_KEY
    }`;
  url += "&q=" + encodeURI(text);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const json = await response.json();
    return json.data.detections[0][0].language;
  } catch (error) {
    console.error(error);
  }
};

export const translateText = async (fromLang, toLang, text) => {
  let url = `https://translation.googleapis.com/language/translate/v2?key=${import.meta.env.VITE_TRANSLATION_KEY
    }`;
  url += "&q=" + encodeURI(text);
  url += `&source=${fromLang}`;
  url += `&target=${toLang}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }).catch(err => console.log(err));
    const json = await response.json();
    return json.data.translations[0].translatedText;
  } catch (error) {
    console.error(error);
  }
};

// export const photoToText = async (photo) => {
//   console.log("made it here")
//   const file = new File([photo.slice(23)], "file.jpg", {type: "image/jpeg"})
//   const formData = new FormData();
//   formData.append("file", file);
//   return await axios
//   .post(
//     `http://localhost:8080/imageToText`,
//     formData,
//     {
//       headers: {
//         "Content-Type": "multipart/form-data",
//         Accept: "application/json",
//       },
//     }
//   )
//   .catch(function (error) {
//     console.log("error", error);
//   });
// };

export const photoToText = async (photo) => {
  var data = {
    requests: [
      {
        image: {
          content: photo.slice(23),
        },
        features: [
          {
            type: "TEXT_DETECTION",
            maxResults: 5,
          },
        ],
      },
    ],
  };
  return await axios({
    method: "post",
    url: `https://vision.googleapis.com/v1/images:annotate?key=${import.meta.env.VITE_TRANSLATION_KEY
      }`,
    data,
    config: { headers: { "Content-Type": "multipart/form-data" } },
  })
    .then((r) => {
      console.log("r", r.data.responses[0].fullTextAnnotation);
      return r.data.responses[0].fullTextAnnotation.text;
    })
    .catch((error) => {
      console.log(error);
    });
};

// export const photoToText = async (photo) => {
//   console.log("this is the photo sliced", photo.slice(23));
//   return await axios
//     .post(
//       `http://localhost:8080/imageToText`,
//       {
//         photouri: photo.slice(23),
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Accept: "application/json",
//         },
//       }
//     )
//     .catch(function (error) {
//       console.log("error", error);
//     });
// };
