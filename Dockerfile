FROM orchardup/php5
RUN apt-get -y install php5-json
RUN mkdir /src
WORKDIR /src
CMD php -S 0.0.0.0:8000
