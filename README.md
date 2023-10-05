You can find the link to the hosted version of this repository here https://nc-news-v5ne.onrender.com/

This project is a news network website

to clone this repository using your terminal navigate to an appropriate directory and enter the command below
git clone https://github.com/lemonses/Nc-news.git

Once the repo has been installed you must run
npm install
this will intall the required dependencies

to create database run this command
npm run setup-dbs

Then you will need to set up a .env.development to get this repo to work locally this should contain PGDATABASE=nc_news
to access the test environment you will need .env.test this should contain PGDATABASE = nc_news_test

to seed the database use the below command
npm run seed

and Finally to run the tests you will need to use this command
npm test

The minimum version of node compatible with this project is v20.4.0
The minimum version of postgres compatible with this project is v14.9