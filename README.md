# TeamBanane

TeamBanane is a project implementing a KanBan Board for a Web-Development lecture. This KanBan Board offers the 
functionality every other KanBan Board offers as well, but is made by us: Ion Tabyrca (Tabaluga), Simon Fröhner 
(Döni) and Jan Albrecht (Jan).

<h2>QuickStart</h2>

The projects current master branch is online at https://www.grauermantel.de/.

--- 
If the website is for any reasons not available please clone yourself the 
repo with \
``
git clone https://github.com/Yonkske/TeamBanane.git
``
. Then change into the root directory of the project and run \
``npm install``, aswell as \
``
node app.js
`` in a command line. These steps require node.js and git on your computer. 

If all steps were successfull, you can now switch to your webbrowser and either klick this [link](http://localhost)
or go to localhost at port 80.

<h2>Architecture</h2>

The language JavaScript, Cascading Style Sheets (CSS) and Hypertext Markup Language (HTML) are used to implement this
project. A MongoDB instance serves as datastorage. A build/deploy-pipeline builds every commit to this projects 
masterbranch in a AWS Codepipeline and deploys it in an AWS containercluster. Right now the cluster contains two 
containers and loadbalancer. Besides loadbalancing, the loadbalancer realises the encryption for the HTTPS protocol. 
In the closed virtual subnet between the loadbalancer and the containers traffic is routed over port 80. 
The loadbalancer therefore reroutes all traffic from port 443 to port 80. The [link](https://www.grauermantel.de) 
redirects the user therfore to a https protocoll using page. 

Concerning the build pipeline the sourcecode ist being pulled from the git repo and the instructions of the 
Dockerfile are being executed according to the buildspec.yml, which contains all instructions for the build process. 
A Container containing the sourcecode is being build. Inside of the container the command ``npm install`` 
is executed to get all necessary dependencys. The following ``node app.js`` says what is to do, when the 
container is being started. The container image, the product of the build pipeline is being stored in a AWS S3 
repository, until a container is instantiated of it. 

The deploypipeline is being triggered everytime a new artifact is pushed into the AWS S3 repository. The containers of
the cluster are now being replaced one after another for ensuring no downtime. Here the Container images are being 
instantiated, the traffic is being redirected to the now container, and the old one is being deleted. At the start of
the container an .env file is being imported from an AWS S3 Bucket. Enviroment Variables are provided at the runtime
this way.  

TODO: API 

<h2>Data-Modell</h2>

The MongoDB saves datasets as documents in collections. The datasets are represented by JSON documents. 
In the DB there are two Collections used, the "project" and the "taskcard". The Schema of the "project" documents is \
``{{"project": "", "password": "", }}``. \
The Schema of a taskcard is \
``{ "project": "", "column": "", "position": "", "taskname": "", "editorname": "", "duedate": { "$date": "" }, "priority": "", }``.

Displayed are only the keys, values are empty.

The project-schema saves project related data for a login. All participants of the project use the same passwort and 
project-identifier. 

The taskcard-schema saves all tasks and task related data. The data contains information about the positions position 
on the board. The "column" tells where on the X-Axe ("TO-DO", "DOING", "DONE").
The "position" tells which position in the column on the Y-Axe the taskcard takes. At a drag and drop the cards data 
is updated. The "project" tells which project the taskcard belongs to, through this identifier the taskcards are matched
to the logged in project. 

The left over keys of the scheme "taskcard" are information about the certain task. 

<h2>REST Services (Backend)</h2>

The backend contains the following Rest-Services: 

``/Register : POST`` Adding a new project. \
``/Register/:projectname : GET`` Getting Data for a project for login purposes. \
 \
``/taskcard : POST`` Creating and saving a new taskcard. \
``/taskcard/:projectname : GET`` Reading, getting all taskcards for a project. \
``/taskcard : PUT`` Updating a taskcard. \
``/taskcard : DELETE`` Deletes a taskcard. \


<h2>Frontend</h2>

Afer a user has registrated he can login. He sees his empty first project and can now add taskcards, each containing
one KanBan Task. 