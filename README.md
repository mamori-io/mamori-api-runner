# OVERVIEW

This project is for running js code that will make use of the mamori api.

When you run an api script via this utility it will 
- spin up a docker container with node and your libs
- execute the script
- remove the docker container


# CREATE DOCKER IMAGE
- Update package.json with addition libs that you will use
- Run make
 
	if you are going to run locally, then "sudo make"
	if you are going to deploy to another machine, then "sudo make tar"

# SET CONNECTION DETAILS
- update scripts/env.sh with your mamori server connection details

# YOUR SCRIPTS
- place your scripts in the script directory
- there is a sample script "scripts/sample-script.ts"

# RUN
To run a script call the run_docker script passing in the script name and the path of the output directory

sudo ./scripts/run_docker.sh -f sample-script -l /root/logs

# DEPLOYING TO ANOTHER MACHINE

If you want to run this on another server that sever will need docker
- copy mamori-api-runner.tgz and scripts directory to the target machine
- install docker "sudo curl https://get.docker.com | sh"
- load the image "sudo docker load < mamori-api-runner.tgz"
- create a logs directory
- run the script as per the instructions above

