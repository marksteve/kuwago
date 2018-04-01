FROM php:5-alpine
RUN mkdir /src
WORKDIR /src
CMD php -S 0.0.0.0:8000
