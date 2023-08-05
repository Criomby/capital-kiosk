"""API helper functions"""

from json import JSONEncoder, dumps
from typing import Any, Dict
import requests
from bs4 import BeautifulSoup
import os


INDICES_URLS = {
        "DAX": "https://markets.businessinsider.com/index/dax",
        "SP500": "https://markets.businessinsider.com/index/s&p_500",
        "FTSE100": "https://markets.businessinsider.com/index/ftse_100",
        "N225": "https://markets.businessinsider.com/index/nikkei_225"
    }


def fetch_indices() -> Dict:
    """
    Crawl indices websites and extract indices data (value, change)
    """
    headers = {
        "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:109.0) \
Gecko/20100101 Firefox/113.0",
        }

    data = {}

    try:
        for index in INDICES_URLS.keys():
            res = requests.get(
                INDICES_URLS[index],
                headers=headers
            )
            #res.encoding = res.apparent_encoding
            soup = BeautifulSoup(res.content, "lxml")
            value = soup.select(".price-section__current-value")[0].text
            change = soup.select(".price-section__relative-value")[0].text
            data[index] = {
                "value": value,
                "change": change
            }
    except Exception as e:
        return {
            "status": "failed",
            "message": dumps(e, cls=ObjEncoder)
            }

    return {
        "status": "OK",
        "content": data
        }


class ObjEncoder(JSONEncoder):
    """
    JSON encode Python object
    """
    def default(self, o: Any) -> Any:
        return o.__dict__
