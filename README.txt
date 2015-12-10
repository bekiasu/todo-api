bash-3.2$ cd todo-api/
bash-3.2$ git init
bash-3.2$ npm init

- create .gitignore file

bash-3.2$ npm install express@4.13.3 --save

- create server.js

- Add the following code
var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;

app.get('/', function(req, res){
	res.send('Todo API root');
})

app.listen(PORT, function(){
	console.log('Express listening on port '+PORT);
})

- Run this to check if server is running correctly
bash-3.2$ node server.js

bash-3.2$ heroku create

bash-3.2$ heroku rename mohit-todo-api

bash-3.2$ git status
bash-3.2$ git add . 
bash-3.2$ git status
bash-3.2$ git commit -am "ToDo App repo init"

bash-3.2$ git push heroku master

bash-3.2$ heroku open

Go over to github and create a new repo and commit code

bash-3.2$ git remote add origin https://github.com/bekiasu/todo-api.git
bash-3.2$ git push -u origin master

bash-3.2$ npm install body-parser@1.13.3 --save
bash-3.2$ npm install underscore@1.8.3 --save

Excellent documentation for underscore @
http://underscorejs.org/


git commit -am "Use underscore in app"

Use node debugger...
debugger;
    cont
    repl (check variables here)
    ctrl+c
    cont
    kill
    
npm install sequelize@3.5.1 --save

npm install sqlite3@3.0.10 --save








