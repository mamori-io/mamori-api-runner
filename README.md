# OVERVIEW

This project is for running js code that will make use of the mamori api.

When you run an api script via this utility it will 
- spin up a docker container with node and your libs
- execute the script
- remove the docker container




# CREATE DOCKER
- Update package.json with addition libs that you will use
- "sudo make" (to run on local machine) or "sudo make tar" (to copy docker image to other machine)

# SET CONNECTION DETAILS
- update scripts/env.sh with your mamori server connection details

# UPDATE SCRIPT TO RUN
- replace scripts/sample-script.ts" in scripts directory with your script
- update scripts/run_script.sh with the new script name

# RUN

sudo ./scripts/run_docker.sh


