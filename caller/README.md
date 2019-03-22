# Scouting Caller
Gets data from TheBlueAlliance and puts in into Firebase, as well as running batch calculations.

## Setup
1. `pip3 install request --target .`
2. Compress the entire folder into a zip
3. Upload to AWS Lambda function
4. Add CloudWatch Event with schedule expression `rate(30 minutes)`
