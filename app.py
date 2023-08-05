"""main server script"""

from flask import Flask, render_template
from api.api import api_bp
import os


app = Flask(__name__)


app.register_blueprint(api_bp)


@app.route("/", methods=["GET"])
def dashboard():
    """
    Serves the dashboard.

    Get API keys set as env vars and pass to frontend.
    """
    return render_template(
        "dashboard.html",
        api_key_alphavantage=os.environ.get("ApiKeyAlphavantage", ""),
        api_key_nytimes=os.environ.get("ApiKeyNYTimes", "")
        )


@app.after_request
def after_request(response):
    """Ensure responses aren't cached"""
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response


if __name__ == "__main__":
    """run server locally if executed"""
    app.run(
        debug=True,
        host="127.0.0.1",
        # run on port other than default 5000 since airplay run on that port
        port=4999
    )
