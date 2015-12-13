var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

// Only for testing, remove in prod env
app.use(function(req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    next();
});

app.get('/', function(req, res) {
    res.send('Todo API root');
})

// GET /todos?completed=true&q=house
app.get('/todos', function(req, res) {
    var queryParams = req.query;
    var where = {};

    if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
        where.completed = true;
    } else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
        where.completed = false;
    }
    if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {
        where.description = {
            $like: '%'+queryParams.q+'%'
        };
    }

    db.todo.findAll({where: where}).then(function(todos){
        if(!!todos){
            res.json(todos);
        } else {
            res.status(404).send();
        }
    }, function(e){
        res.status(500).json(e);
    });

    // var filteredTodos = todos;

    // if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
    //     filteredTodos = _.where(filteredTodos, {
    //         completed: true
    //     });

    // } else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
    //     filteredTodos = _.where(filteredTodos, {
    //         completed: false
    //     });
    // }

    // if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {
    //     filteredTodos = _.filter(filteredTodos, function(todo) {
    //         return todo.description.toLowerCase().indexOf(queryParams.q) > -1;
    //     });
    // }

    // res.json(filteredTodos);
});

// GET /todos
// app.get('/todos', function(req, res) {
//     res.header("Access-Control-Allow-Origin", "*"); // Only for testing
//     res.json(todos);
// });

// GET /todos/:id
app.get('/todos/:id', function(req, res) {
    var todoId = parseInt(req.params.id, 10);

    db.todo.findById(todoId).then(function(todo){
        if(!!todo){
            res.json(todo.toJSON());
        } else {
            res.status(404).send();
        }
    }, function(e){
        res.status(500).json(e);
    });
    // --- No db below
    // var matchedTodo = _.findWhere(todos, {
    //     id: todoId
    // });

    // if (matchedTodo) {
    //     res.json(matchedTodo);
    // } else {
    //     res.status(404).send();
    // }

});

// POST /todos
app.post('/todos', function(req, res) {
    var body = _.pick(req.body, 'description', 'completed');

    db.todo.create(body).then(function(todo){
        res.json(todo.toJSON());
    }, function(e){
        res.status(400).json(e);
    });

    // --- No db below
    // if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
    //     return res.status(400).send();
    // }

    // body.description = body.description.trim();
    // body.id = todoNextId++;
    // todos.push(body);

    // res.header("Access-Control-Allow-Origin", "*"); // Only for testing 
    // res.json(body);
});

// DELETE /todos/:id
app.delete('/todos/:id', function(req, res) {
    var toDeleteId = parseInt(req.params.id, 10);
    var matchedTodo = _.findWhere(todos, {
        id: toDeleteId
    });

    if (matchedTodo) {
        todos = _.without(todos, matchedTodo);
        res.json(todos);
    } else {
        res.status(404).json({
            "error": "no todo found with that id"
        });
    }

});

// PUT /todos/:id
app.put('/todos/:id', function(req, res) {
    var toUpdateId = parseInt(req.params.id, 10);
    var matchedTodo = _.findWhere(todos, {
        id: toUpdateId
    });
    var body = _.pick(req.body, 'description', 'completed');
    var validAttributes = {};

    if (!matchedTodo) {
        return res.status(404).send();
    }

    if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
        validAttributes.completed = body.completed;
    } else if (body.hasOwnProperty('completed')) {
        return res.status(400).send();
    } else {
        // Never provided attribute, no problem here
    }

    if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
        validAttributes.description = body.description;
    } else if (body.hasOwnProperty('description')) {
        return res.status(400).send();
    } else {
        // Never provided attribute, no problem here
    }

    // debugger; // may help :)
    _.extend(matchedTodo, validAttributes);
    res.json(matchedTodo);

});

db.sequelize.sync().then(function() {
    // Start Server
    app.listen(PORT, function() {
        console.log('Express listening on port ' + PORT);
    })
});