run:
	docker run -p 80:80 -v $PWD/:/usr/share/nginx/html/ --rm --name irs nginx
deploy:
	git push heroku master
