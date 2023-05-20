from flask import Flask
from flask import jsonify
from generate import gpt_call
import json

app = Flask(__name__)


@app.route("/test")
def test():
    # response = jsonify(gpt_call("fruit"))
    response = jsonify(json.load(open('test_data.json')))
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


if __name__ == "__main__":
    app.run(debug=True)