from flask import Flask, request, jsonify
import random
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
answer = ""
allowed_guesses = set()

WORD_LENGTH = 5
COLORS = ["green", "gray", "yellow"]

# Choose an answer word when server starts
with open("possible-answers.txt", "r") as f:
    WORDS = [line.strip() for line in f if line.strip()]
    answer = random.choice(WORDS)

# load possible guesses into a set
with open("allowed-guesses.txt", "r") as f:
    allowed_guesses = set([line.strip() for line in f if line.strip()])



@app.route("/get-answer", methods=["GET"])
def get_answers():
    print(answer)
    return jsonify({"answer": answer})

# return colors for each box for a guess
@app.route("/get-box-colors", methods=["POST"])
def get_box_colors():
    valid = True
    data = request.get_json()
    word = data.get("word")
    box_colors = ["gray", "gray", "gray", "gray", "gray"]

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