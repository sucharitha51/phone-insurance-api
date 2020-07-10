#  Phone Insurance API

## Description
This Application allows us to add phones with premium and excess details. It has got below API end points.
 
- GET /api/v1/phone - returns all phones with details
- GET /api/v1/phone/{phoneId} - returns phone details, premiums and excess
- DELETE phone /api/v1/phone/{phoneId}
- PUT /api/v1/phone - takes in new details and updates in the database
- POST /api/v1/phone - create a new phone

### The functionality also covers following points
1. Multiple premium and excess for each phone, defined by a start date.
2. When the start date is reached, the GET endpoint returns the new premium and excess.
3. Submitting new premium and excess to the API along with a start date.

Detailed API specification can be found at spec/swagger.yaml

Database migrations are available at migrations/*

## Installation
1. Download or clone the project
2. Go into the project `cd phone-insurance-api`
3. Install dependencies run `npm install`
4. Update mysql env variables
5. run the sql migration (db-migrate up) 
6. To run the server `npm start`

You can either use Postman or call the API endpoints directly with bash


## Incase of no time constraints, I would like to accomplish below tasks
1. unit/integration tests

## Authors or Acknowledgments

Written by Sucharitha Chinnam
