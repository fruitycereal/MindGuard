'''
from flask import Flask, request, jsonify
from flask_cors import CORS
import anthropic
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
@app.route('/journal-response', methods=['POST'])
def journal_response():
    data = request.json
    mood = data.get('mood', '')
    entry = data.get('entry', '')

    message = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=300,
        messages=[
            {
                "role": "user",
                "content": f"""You are a warm, gentle mental wellness companion for teenagers. 
                A user selected their mood as: {mood}
                They wrote this journal entry: {entry}
                
                Respond in 2-3 sentences. Be warm, validating, and human. 
                Never diagnose. Never say 'I understand' — show it instead.
                Never recommend therapy as your first response.
                Acknowledge what they said specifically.
                End with one gentle question or thought that helps them reflect further.
                If they seem in serious distress, gently mention that support is available."""
            }
        ]
    )
    
    return jsonify({
        "response": message.content[0].text
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
'''

from flask import Flask, request, jsonify
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)

responses = {
    "I'm really happy": [
        "That happiness is real and it matters. What made today feel this way — is it something you can hold onto?",
        "It's good to feel this. What's one thing you want to remember about today?",
        "Happy days are worth noticing. What brought this feeling?",
    ],
    "I'm doing okay": [
        "Okay is enough. What's been sitting on your mind lately, even quietly?",
        "Sometimes okay is actually really good. What does today feel like for you?",
        "There's something honest about okay. What's one thing on your mind right now?",
    ],
    "A bit heavy": [
        "Heavy days are real. You don't have to figure out why — what does it feel like right now?",
        "That heaviness makes sense. What's been weighing on you, even if it's hard to name?",
        "Thank you for showing up even when things feel heavy. What's one thing you're carrying today?",
    ],
    "Really struggling": [
        "Thank you for being honest about that. What does struggling feel like for you right now — in your body, your thoughts?",
        "That takes courage to say. You don't have to have it figured out. What's the hardest part of today?",
        "You showed up even on a hard day. That means something. What do you need most right now?",
    ],
    "I don't even know": [
        "Not knowing is okay. Just write whatever comes — even one word is enough.",
        "Sometimes feelings don't have names yet. What does your body feel like right now?",
        "That's an honest answer. Is there anything — even small — that's been on your mind?",
    ],
}

@app.route('/journal-response', methods=['POST'])
def journal_response():
    data = request.json
    mood = data.get('mood', '')
    entry = data.get('entry', '')

    mood_responses = responses.get(mood, responses["I don't even know"])
    response = random.choice(mood_responses)

    return jsonify({"response": response})

if __name__ == '__main__':
    app.run(debug=True, port=8000, host='0.0.0.0')