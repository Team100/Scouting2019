import requests

EVENT_KEY = '2019cada'


def send_error(error):
    error_url = 'https://slack.com/api/chat.postMessage?token=xoxp-47875372407-232118454099-544608978016' \
               '-5902d4742bab5c70cb77d1f405ee790d&channel=C4AEPBZMY&text=' + error + \
               '&icon_url=https://s3-us-west-2.amazonaws.com/frc100-scouting-asset/ico/ERROR.png&pretty=1 '
    r_error = requests.post(error_url)
    print(r_error.json())


def send_info(info):
    info_url = 'https://slack.com/api/chat.postMessage?token=xoxp-47875372407-232118454099-544608978016' \
               '-5902d4742bab5c70cb77d1f405ee790d&channel=C4AEPBZMY&text=' + info + \
               '&icon_url=https://s3-us-west-2.amazonaws.com/frc100-scouting-asset/ico/INFO.png&pretty=1 '
    r_info = requests.post(info_url)
    print(r_info.json())


def send_ok(ok):
    ok_url = 'https://slack.com/api/chat.postMessage?token=xoxp-47875372407-232118454099-544608978016' \
             '-5902d4742bab5c70cb77d1f405ee790d&channel=C4AEPBZMY&text=' + ok + \
             '&icon_url=https://s3-us-west-2.amazonaws.com/frc100-scouting-asset/ico/OK.png&pretty=1 '
    r_ok = requests.post(ok_url)
    print(r_ok.json())


# send_info("Hello. This is the Scouting Debugger. I will post a notification on calculation updates every half hour.")
# send_info("Begin loop at `" + str(datetime.datetime.now()) + '`')

print("Getting TBA Data")
url = 'https://www.thebluealliance.com/api/v3/event/' + EVENT_KEY + '/rankings'
headers = {'X-TBA-Auth-Key': '2wLrMxMN2xiZHFVANnp2tG7UhB1na9PJbge6G9yUQphvuebRQSftXP50P7JqCNLg'}
r = requests.get(url, headers=headers)
print("DONE")

print(r.json())

if r.status_code != 200:
    # send_error("TBA Get Error Recieved: " + str(r.json()))
    print("Non 200 status code from tba api")
# else:
    # send_ok("TBA Get OK Recieved: " + str(r.status_code))

print("Posting TBA Data")
url1 = 'https://us-central1-scouting-2019-team-100.cloudfunctions.net/tba'
body1 = r.json()
r1 = requests.post(url1, json=body1)
print(r1)

if r1.status_code != 200:
    # send_error("TBA Post Error Recieved: " + str(r1.status_code))
    print("Non 200 status code from tba")
# else:
    # send_ok("TBA Post OK Recieved: " + str(r1.status_code))
print("Batch Calc")

url2 = 'https://us-central1-scouting-2019-team-100.cloudfunctions.net/batch_calc'

r2 = requests.get(url2)
print(r2)
if r2.status_code != 200:
    print("Non 200 status code from batch_calc")
    # send_error("Batch Calc Error Recieved: " + str(r2.json()))
# else:
    # send_ok("Batch Calc Get OK Recieved: " + str(r2.status_code))

print("Complete")
