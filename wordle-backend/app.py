from flask import Flask, jsonify
import random

app = Flask(__name__)
answer = ""

# Choose an answer word when server starts
with open("possible-answers.txt", "r") as f:
    WORDS = [line.strip() for line in f if line.strip()]
    answer = random.choice(WORDS)

@app.route("/get-answer", methods=["GET"])
def get_answers():
    return jsonify({"answer": answer})

if __name__ == "__main__":
    app.run(debug=True)