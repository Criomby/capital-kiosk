"""API to get financial index data"""

from flask import Blueprint
import subprocess
from typing import Dict
from .utils import fetch_indices


api_bp = Blueprint(
    "api", __name__,
    url_prefix="/api"
)


@api_bp.route("/test", methods=["GET"])
def test() -> Dict:
    """
    Endpoint to test if API is up
    """
    return {"message": "API OK"}


@api_bp.route("/indices", methods=["GET"])
def get_indices() -> Dict:
    """
    Get fetched indices data from crawled websites

    returns:
        {
            "status": "OK" | "failed,
            "message": error | indices_data: Dict 
        }
    """
    return fetch_indices()


@api_bp.route("/git-branch", methods=["GET"])
def get_branch() -> Dict:
    """
    Get the local git branch you're on for this repo
    """
    proc = subprocess.run(
        ["git", "symbolic-ref", "--short", "HEAD"],
        text=True,
        capture_output=True
        )
    # remove newline chars
    branch_name = proc.stdout.replace("\n", "")
    if not proc.returncode:
        return {
            "status": "OK",
            "branchName": branch_name
        }
    else:
        return {
            "status": "failed",
            "message": proc.stderr
        }
