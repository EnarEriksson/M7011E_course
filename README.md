## M7011E_course
Course project for Enar Eriksson and Isak Sundell
## Install
Install node and mongodb. We used node version 10.19.0 and mongodb version 4.4.1.
Clone the github repository
Run npm install in both the frontend and backend directories.
In the backend directory create a file named .env and add the line: DB_NAME=mongoaddress where mongoaddress is your mongodb address.
In the backend directory create a directory named uploads.
Change the ip in frontend/src/components/axiosconfig.js to the backend ip and port.
Also the picture solution is bad and you need to change the start of the ip addres in frontend/src/components/ Prosumer, Manager, ManagerPro on all places impath is set.
## How to start Backend
Go into the folder on a terminal. Start the server with node app.js
## How to start Frontend
Go into the folder on a terminal. Start the server with npm start for developmentmode. For deployment use npm run build, npm install -g serve, and serve -s build