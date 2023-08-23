from flask import Flask
from flask import jsonify
from generate import gpt_call
import json

app = Flask(__name__)


@app.route("/test/<name>")
def test(name):
    response = jsonify(gpt_call(name))
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


if __name__ == "__main__":
    app.run(debug=True)