imagename = mamori-api-runner

image:
	docker build -t $(imagename) .

tar: image
	docker save $(imagename) | gzip > $(imagename).tgz

shell: image
	docker run --rm -it $(imagename) sh
