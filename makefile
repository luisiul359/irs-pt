run:
	docker run -p 80:80 -v $PWD/:/usr/local/apache2/htdocs/ -v $PWD/conf/httpd.conf:/usr/local/apache2/conf/httpd.conf --rm --name irs httpd:2.4

	docker run -p 80:80 -v $PWD/:/usr/share/nginx/html/ --rm --name irs nginx
deploy:
	git push heroku master
