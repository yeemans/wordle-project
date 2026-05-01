import uuid

from flask import Flask, request, jsonify
import random
from flask_cors import CORS
import datetime

app = Flask(__name__)
CORS(app, origins=["https://wordle-project-frontend.vercel.app/", "http://localhost:5173"])
answer = ""
games = {}
allowed_guesses = set()

WORD_LENGTH = 5
COLORS = ["green", "gray", "yellow"]

# load possible answers
with open("possible-answers.txt", "r") as f:
    WORDS = [line.strip() for line in f if line.strip()]

# load possible guesses into a set
with open("allowed-guesses.txt", "r") as f:
    allowed_guesses = set([line.strip() for line in f if line.strip()])

def get_today_word():
    day_index = datetime.date.today().toordinal()
    return WORDS[day_index % len(WORDS)]

# creates a game tying id's to an answer
@app.route("/new-game", methods=["POST"])
def new_game():
    game_id = str(uuid.uuid4())
    answer = get_today_word()

    # even at midnight, the word doesnt reset until a new game is made for a user
    games[game_id] = { "answer": answer }
    return jsonify({ "game_id": game_id })

@app.route("/get-answer", methods=["GET"])
def get_answers():
    return jsonify({"answer": get_today_word()})

# return colors for each box for a guess
@app.route("/get-box-colors", methods=["POST"])
def get_box_colors():
    valid = True
    data = request.get_json()

    word = data.get("word")
    game_id = data.get("game_id")

    box_colors = ["gray", "gray", "gray", "gray", "gray"]
    answer = games[game_id]["answer"]

    for i in range(WORD_LENGTH):
        # letter is in correct slot
        if word[i] == answer[i]:
            box_colors[i] = "green"
        
        # letter is in wrong slot, but still in word
        if word[i] != answer[i] and word[i] in answer:
            box_colors[i] = "yellow"

    valid = len(word) == 5 and word in allowed_guesses
    return {"valid": valid, "box_colors": box_colors}

if __name__ == "__main__":
    app.run(debug=True)