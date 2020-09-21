 ![MNIT_Placement_Portal](./public/assets/images/github-mnit-placement-portal.png)
> An Online Placement & Internship automation web portal for MNIT Jaipur students using MEAN Stack (Node.js, AngularJs, Express.js & MongoDb)

Training & Placement Cell, MNIT Jaipur aims at building a strong interface between industry and the University for training and placement of students. To make recruitment session smoother for students, Training & Placement Cell has a web portal for handling the placement registration for companies visiting our campus.

## Motivation :
The motivation for doing this project was primarily to make recruitment session smoother for students & make the complete Placement Process paperless at MNIT Jaipur. This is my small contribution, as an MNITian, to the betterment of the system of Placements in MNIT Jaipur.

I am deeply thankful to T&P Authorities for approving my project to use as **Official Placement Portal - MNIT Jaipur**.

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
3. Install Dependencies 
```
$ npm install
```
4. Start server
```
$ PORT=8080 node server.js
```

Server would be running at port 8080. Open any browser. Access the project - http://localhost:8080/

> You need to set environment variables PTP_EMAIL, PTP_EMAIL_PASSWORD, SECRET, SMS_API_KEY,SMS_SENDERID & SMS_BASE_URI in .env file (root folder). For more info refer API files in router folder.

## Project Status

This project is currently deployed to MNIT Cloud and being used by UG, PG, & MBA Pre-final, Final year students & Placement Cell, MNIT Jaipur.

<a href='http://placements.mnit.ac.in' target='_blank'>
    <img src="https://img.shields.io/badge/Project%20Status-Live-green"></a>
</a>

## Repository Structure 
   
    PlacementMNIT/
    ├── app/                    # Backend Folder
    │   ├── controllers/            # All business logic for routers
    │   ├── middlewares/            # ExpressJs Middlewares
    │   ├── models/                 # MongoDB database models
    │   ├── routes/                 # Backend API routes
    │   └── services/               # Server side services 
    ├── public/                 # Frontend Folder
    │   ├── app/                    # Frontend Application
    │   │   ├── controllers/            # AngularJs Controllers
    │   │   ├── directives/             # Custom AngularJs directives 
    │   │   ├── filters/                # Custom AngularJs filters
    │   │   ├── services/               # Services in AngularJs
    │   │   ├── views/                  # All HTML files
    │   │   ├── app.js                  # AngularJs App file
    │   │   └── routes.js               # All AngularJs Front end Routes 
    │   └── assets/                 # Project assets including CSS, Images, Icons, JavaScripts files
    ├── README.md               # README file
    ├── package.json            # Holds metadata relevent to project & project's dependencies 
    ├── .gitignore              # Git ignore files 
    └── server.js               # Node App start file


## Contributing
We are constantly working on towards making the placement portal more efficient and to speed up the overall service of Placement Portal to ensure smooth transition.

If you have a bug or idea you want to develop, you can open a new issue in this repository. We are very interested in any feedback you have about using it!

If you'd like to discuss the project, development, or contributions, Join our team [Placement Community](https://gitter.im/PlacementMNIT/community) on Gitter.

Pull requests are welcome. For major changes, please open a issue first to discuss what you would like to change.

Help improving the project from correcting a variable name to scaling the application, your each contribution will be counted & get your name added in Credits!

## Questions or need help?

We want to make it super-easy for Placement Portal users and contributors to talk to us and connect with each other, to share ideas, solve problems and help make Placement Portal awesome. Here are the main channels we're running currently, we'd love to hear from you on one of them:

#### Gitter
If you want to discuss already created issues, potential bugs, new features you would like to work on or any kind of developer chat, you can head over to our [Gitter room](https://gitter.im/PlacementMNIT/community).

#### Github
If you spot a bug, then please raise an issue in [Issue Section](https://github.com/Pankajtanwarbanna/PlacementMNIT/issues), likewise if you have developed a cool new feature or improvement in your Placement MNIT fork, then send us a pull request!

If you want to brainstorm a potential new feature, then the Placement Portal Gitter Room (see above) is probably a better place to start.

#### linkedIn 

[@Pankajtanwarbanna](https://www.linkedin.com/in/pankajtanwarbanna/)

Invite me to connect on LinkedIn.

#### Email 

[pankajtanwar510@gmail.com](mailto:pankajtanwar510@gmail.com)

If you want to talk directly to me, email is the easiest way.

## Support

Liked the initiative? Star the repo and show some love <3

## Credits
Pankaj Tanwar 

<a href="https://github.com/pankajtanwarbanna/PlacementMNIT/graphs/contributors">
  <img src="https://contributors-img.web.app/image?repo=pankajtanwarbanna/PlacementMNIT" />
</a>

## Licence
[MIT](https://choosealicense.com/licenses/mit/) 
