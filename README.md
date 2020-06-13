 ![MNIT_Placement_Portal](./public/assets/images/github-mnit-placement-portal.png)
> An Online Placement & Internship automation web portal for MNIT Jaipur students using MEAN Stack (Node.js, AngularJs, Express.js & MongoDb)

Training & Placement Cell, MNIT Jaipur aims at building a strong interface between industry and the University for training and placement of students. To make recruitment session smoother for students, Training & Placement Cell has a web portal for handling the placement registration for companies visiting our campus.

## Motivation :
The motivation for doing this project was primarily to make recruitment session smoother for students & make the complete Placement Process paperless. This is my small contribution to the betterment of the system of Placements in MNIT Jaipur.

I am thank ful to T&P Authorities for approving my project to use as **Official Placement Portal of MNIT Jaipur**.

## Tech Stack :
* Node.Js (Server side JavaScript runtime environment)
* ExpressJs (Web Application Framework for Node.Js)
* MongoDB (Cross Platform, Document oriented NoSQL Database)
* AngularJs (JavaScript based Front-end Framework)

## Getting Started :

### Prerequisites -

1. Install Node.Js
```
$ sudo apt-get update
$ sudo apt-get install nodejs
```
2. Install npm
```
$ sudo apt-get install npm
```
3. Install MongoDB
```
https://docs.mongodb.com/v3.2/tutorial/install-mongodb-on-ubuntu/
```
### Run Software

1. Clone Repo
```
$ git clone https://github.com/Pankajtanwarbanna/PlacementMNIT.git
```
2. Change Directory
```
$ cd PlacementMNIT/
```
1. Install Dependencies 
```
$ npm install
```
1. Start server
```
$ PORT=8080 node server.js
```

Server would be running at port 8080. Open any browser. Access the project - http://localhost:8080/

> You need to set environment variables PTP_EMAIL & PTP_EMAIL_PASSWORD otherwise email service will not work. For more info refer nodemailer transporter object - app/routes/api.js & app/routes/adminApi.js

## Project Status
<a href='http://placements.mnit.ac.in' target='_blank'>
    <img src="https://img.shields.io/badge/Project%20Status-Live-green"></a>
</a>

This project is currently deployed to MNIT Cloud and being used by UG, PG, & MBA Pre-final, Final year students & Placement Cell, MNIT Jaipur.

## Contributing
We are constantly working on towards making the placement portal more efficient and to speed up the overall service of Placement Portal so that we can ensure smooth transition.

If you have a bug or idea you want to develop, you can open a new issue in this repository. We are very interested in any feedback you have about using it!

If you'd like to discuss the project, development, or contributions, we are in the PlacementMNIT on Gitter(https://gitter.im/PlacementMNIT/community). .



Pull requests are welcome. For major changes, please open a issue first to discuss what you would like to change.

Help us improving the project from correcting a variable name to scaling the application, your each contribution will be counted & get your name added in Credits!

## Support

Liked the initiative ? Star the repo and show some love <3

## Credits
Pankaj Tanwar 

<a href="https://github.com/pankajtanwarbanna/PlacementMNIT/graphs/contributors">
  <img src="https://contributors-img.web.app/image?repo=pankajtanwarbanna/PlacementMNIT" />
</a>

## Licence
[MIT](https://choosealicense.com/licenses/mit/) 
