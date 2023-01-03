const googleTTS = require("google-tts-api");
const axios = require("axios");
const cors = require("cors");
const { generateRequestUrl, normaliseResponse } = require("google-translate-api-browser");
const express = require("express");

const app = express(); // Making server application
app.use(express.json()); // Adding middleware to automatically convert code to json format
app.use(cors()); // Using cors to avoid cors policy

const convertToSpeech = async (text, langCode) => {
  try {
    const data = await googleTTS.getAllAudioBase64(text, {
      lang: langCode,
      slow: false,
      host: "https://translate.google.com",
      timeout: 10000,
    //   splitPunct: ",.?",
    });
    return data;
  } catch (error) {
    console.log("error");
  }
};

const translate = async (text, langCode) => {
  const url = generateRequestUrl(text, { to: langCode });
  const res = await axios.get(url);
  return normaliseResponse(res.data);
};

app.get('/text-to-speech', async(req, res) => {
    const data = await convertToSpeech(req.query.text,  req.query?.langCode ?? "hi")
    res.send(data)
})

app.get('/translate', async(req, res) => {
    const data = await translate(req.query.text, req.query?.langCode ?? "hi")
    res.send(data)
})

// Running application server
app.listen(3000, () => console.log("Server running"));