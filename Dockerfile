FROM php:7.4-apache

RUN docker-php-ext-install mysqli && docker-php-ext-enable mysqli

COPY infocenter /var/www/html/infocenter

EXPOSE 80