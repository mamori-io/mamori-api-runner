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

# YOUR SCRIPTS
- place your scripts in the script directory
- there is a sample script "scripts/sample-script.ts"

# RUN
To run a script call the run_docker script passing in the script name and the path of the output directory

sudo ./scripts/run_docker.sh -f sample-script -l /root/logs


