FROM httpd:2.4

EXPOSE 80
EXPOSE 443  
COPY ./index.html /usr/local/apache2/htdocs/  
