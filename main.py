from flask_cors import CORS
from youtube_transcript_api import YouTubeTranscriptApi
from flask import Flask
import requests
import openai

# importing json to encode data for sending data through api
import json

openai.api_key = "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"

API_TOKEN = "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"

API_URL = "https://api-inference.huggingface.co/models/sshleifer/distilbart-cnn-12-6"

headers = {"Authorization": f"Bearer {API_TOKEN}"}

# Using open api to summarize subtitles


def query(text):
    if (len(text) < 4000):
        prompt = (
            "Summarize this:\n\n"+text)
        print("Open AI Summary")
        response = openai.Completion.create(model="text-davinci-003", prompt=prompt,  temperature=0.7,
                                            top_p=1.0,
                                            frequency_penalty=0.0,
                                            presence_penalty=0.0, max_tokens=200)
        return json.dumps({"summary_text": response["choices"][0]["text"]})
    else:
        old_response = requests.post(API_URL, headers=headers, json={
            "inputs": text,
        })
        print("Huggingface Summary")
        return old_response.json()[0]
        # print(type(old_response.json()["summary_text"]))

# Generate transcript from youtube video id


def generate_transcript(vid):
    transcript = YouTubeTranscriptApi.get_transcript(vid)
    script = ""

    for text in transcript:
        t = text["text"]
        if t != '[Music]':
            script += t + " "

    return script


app = Flask(__name__)

# Using cors to avoid cors policy issues.
CORS(app)

# Default route


@app.route("/")
def hello():
    return "server working"

# Route for summary of video.


@app.route("/transcript/<vid>")
def transcript(vid):
    text = generate_transcript(vid)
    summary = query(text)
    language = 'en'
    return summary


app.run()
