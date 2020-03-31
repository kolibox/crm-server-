/*
Это чистый Node.js
const http = require("http"); //подгрузка модуля http
http.createServer(function(request,response){
     
    response.end("1111!");
     
}).listen(3000, "127.0.0.1",function(){
    console.log("Сервер начал прослушивание запросов на порту 3000");
});
*/

//Это уже express framework
// получаем модули
const express = require("express");
const bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
//const cookieParser = require("cookie-parser"); Нет этого модуля

const mongoose = require("mongoose");
//const Schema = mongoose.Schema;
var fs = require("fs");

//const userScheme = new Schema({name: String, age: Number}, {versionKey: false});
//const User = mongoose.model("User", UserScheme);

//mongoose.connect("mongodb://localhost:27017/providers", {useNewUrlParser: true}, function(err){
//    if(err) return console.log(err);
//    app.listen(3000, function(){
//       console.log("express started")
//    });
//});


//Цепляемся к забе providers. show dbs
mongoose.connect("mongodb://localhost:27017/providers", {useNewUrlParser: true,  useUnifiedTopology: true }).then(
    () => {console.log('connected to MongoDB')},
    err => {console.log(err)}
);
var schema = new mongoose.Schema({creationDate: {type: Date, default: Date.now}, completeDate: Date, p1: 'string', p2: 'string', p3: 'string', p4: 'string', p5: 'string', p6: 'string', p7: 'string', p8: 'string', p9: 'string', p10: 'string'}); //Это основная схема

//Вот тут интересно: коллекция будет называться 'mains', а не 'Main':
var Main = mongoose.model('Main', schema); //Это точно основная коллеция


// создаем приложение
const app = express();
console.log("log");
const urlencodedParser = bodyParser.urlencoded({extended: false});
app.use(bodyParser.json()); //Это нужно, чтобы в методе post я получал нормальный объект

//app.use(cookieParser); Нет этого модуля
//Прописываем путь до frontend:
app.use(express.static(__dirname + "/client"));    //Вот тут мы шлем 3 файла до начала маршрутиризации. Выполняется всегда.
//Вот все стало понятно. Мы никак не можем отправить больше 1 файла по запросу. Поэтому мы используем этот middleware заранее.

//Более конкретные маршруты вверху!!!
app.get("/about", function(request, response){
    //console.log("Somebody entered the system!");
    console.log(`Запрошенный адрес: ${request.url}`);
    console.log(`Параметры: ${request.query}`);
    response.status(200);
    response.send("about");
    //response.send("<h2>Hello</h2>");
    //response.send(["Tom", "Bob", "Sam"]);
    //response.send({id:6, name: "Tom"});
    //response.end("Hello from Express!");
});

app.get("/test", function(request, response){ //Вот тут я отдаю 1 файл методами NodeJS, но отдаются сразу 3 файла. CSS и vue.js. Странно, но удобно
    //Это был cache. Сейчас приходит только один файл index.html
    //Это отправка методами NodeJs, а не express. Express будет в /
    fs.readFile(__dirname + "/client/index.html", function(error, data){
        if (error)
        {
            response.statusCode = 404;
            response.end("ошибка");
        }
        else
        {
            response.end(data);
        }
    })
    
});

app.get("/api/operators", function(req, res){ 
    //Вот это все нужно, чтобы ajax запросом из vue.js взять из базы данные в самом начале.
    //Т.е. мы создаем api, а потом уже его используем. Прикольно.
    console.log('---------------------');
    console.log(`Запрошенный адрес: ${req.url}`);
    console.log(`Параметры: ${req.method}`);
    console.log('---------------------');
    console.log('Заголовки:');
    for (let key in req.headers)
    {
        console.log(`${key} ${req.headers[key]}`);
    }
    console.log('---------------------');
    


    Main.find(function(err, result)
    {
        if(err) return console.log(err);
        //console.log(`Из базы пришло:  ${result}`);
        //res.write(result.toString());
        res.write(JSON.stringify(result));
        res.end();
    });
});

// устанавливаем обработчик для маршрута "/"
app.get("/", function(request, response){ 
    console.log(`Запрошенный адрес: ${request.url}`);
    console.log(`Метод: ${request.method}`);
    console.log(request.headers);
    //console.log("Cookies: ", request.cookies); Нет этого модуля
    response.sendFile(__dirname + "/client/index.html");     //Вот это метод Express, но он шлет лишь 1 файл, а нужно всю папку. А вся папка шлется в первом middleware
});


//Заготовка для добавления в базу новой записи

app.post("/", urlencodedParser, function (request, response) {
    if(!request.body) return response.sendStatus(400);
    console.log("body raw Object: ", request.body);
    //console.log("data: ", request.data);
    //console.log("response body: ", response.body);
    //console.log("response data: ", response.data);
    
    //console.log("body JSON.parse: ", JSON.parse(request.body));
    if(!request.body) return responce.sendStatus(400);

    //const [newName , newOperator, newComments] = [request.body.name, request.body.operator, request.body.comments];
    const dataFromFrontEnd = [p1 , p2, p3, p4, p5, p6, p7, p8, p9, p10] = [request.body.p1, request.body.p2, request.body.p3, request.body.p4, request.body.p5, request.body.p6, request.body.p7, request.body.p8, request.body.p9, request.body.p10];
    console.log(dataFromFrontEnd);
    //const newOperator = request.body.operator;
    //console.log(newOperator);


    //var user = {name: newName, operator: newOperator};
    //var data = fs.readFileSync(__dirname + "/base1.json", "utf8");
    //var users = JSON.parse(data);
    // добавляем пользователя в массив
    //users.push(user);
    //var data = JSON.stringify(users);
    // перезаписываем файл с новыми данными (Отключаю. Пишу только в базу)
    //fs.writeFileSync(__dirname + "/base1.json", data);  //Вот тут нужно доделать. Сделать асинхронным

    //Пишем в базу:
    var simpleDocument = new Main({createdAt: new Date(), completeDate: '', p1: p1, p2: p2, p3: p3, p4: p4, p5: p5, p6: p6, p7: p7, p8: p8, p9: p9, p10: p10});
    simpleDocument.save();


    //response.send(user);
    response.send("Node says: a new document added to the base.");
    //response.send(`${request.body.name} - ${request.body.operator}`); 
});

app.delete("/api/operators/:id", function(req, res)
{
    const id = req.params.id;
    console.log(`Удаляю ${id}`);
    Main.findByIdAndDelete(id, function(err, user)
    {
        if(err) return console.log(err);
        res.send(`Node says: ${user} deleted`);
    });
});




/*
Вот это лажа. Тут пост, но там нет никакой формы. Она в /index.html 

app.post("/api/operators", jsonParser, function (req, res) {
     
    if(!req.body) return res.sendStatus(400);
     
    var newName = req.body.name;
    console.log(newName);
    var newOperator = req.body.operator;
    var user = {name: newName, operator: newOperator};
     
    var data = fs.readFileSync("users.json", "utf8");
    var users = JSON.parse(data);
     
    
    // добавляем пользователя в массив
    users.push(user);
    var data = JSON.stringify(users);
    // перезаписываем файл с новыми данными
    fs.writeFileSync("users.json", data);
    res.send(user);
});
*/

// начинаем прослушивание подключений на 3000 порту
app.listen(3000);