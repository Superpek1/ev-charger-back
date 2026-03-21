FROM php:8.2-apache

RUN a2enmod rewrite

RUN chown -R www-data:www-data /var/www/html
WORKDIR /var/www/html