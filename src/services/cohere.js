import axios from "axios";

/**
 * summarizes text using cohere
 * @param {*} input input text for summarization as a string
 * @returns the input text summarized
 */
export const generateText = async (prompt, max_tokens) => {
  return await axios
    .post(
      `https://api.cohere.ai/generate`,
      { prompt, max_tokens, model: "command-xlarge-nightly", },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "authorization": `Bearer ${import.meta.env.VITE_COHERE_KEY}`
        },
      }
    )
    .catch(function (error) {
      console.log("error", error);
    });
};
