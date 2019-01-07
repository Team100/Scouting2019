import requests
from time import sleep

EVENT_KEY = "2018cada"
TBA_AUTH_KEY = "UegGTUgQM50rZaDdu5fHXvTMmB9tAjlAQi4spx4u1KKcDLwdjAaQpbgTZmiqnF4y"

try:
    r = 0
    while True:
        rankings = requests.get("https://www.thebluealliance.com/api/v3/event/" + EVENT_KEY + "/rankings", headers={"X-TBA-Auth-Key": TBA_AUTH_KEY}).json()
        requests.post("https://us-central1-scouting-2019-team-100.cloudfunctions.net/tba", json=rankings)

        print("Request {0} finished".format(r))
        sleep(960)

except KeyboardInterrupt:
    pass
