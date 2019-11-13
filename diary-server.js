const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

class Diary {
    constructor(id, title, isActive) {
        this.id=id;
        this.title=title;
        this.isActive=isActive;
    }
}

function print_diary(num) {
    var d=diaryBook[num];
    if (d.isActive) return '#'+num+': '+d.title+' (true)\n';
    else return '#'+num+':  (false)\n';
}

var diaryBook=[];

app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => res.send('Welcome to my diary'));
app.get('/diaries', (req, res) => {
    if (diaryBook.length>0) {
        var msg='';
        for (var i=0; i<diaryBook.length; i++) msg+=print_diary(i);
        res.send(msg);
    }
    else res.send('No diary written!')});
app.get('/diary/:id', (req, res) => {
    if (parseInt(req.params.id)>=diaryBook.length)
        res.status(404).send('Diary #'+req.params.id+' does not exist!');
    else if (diaryBook[req.params.id].isActive) res.send(print_diary(parseInt(req.params.id)));
    else res.send('Diary #'+req.params.id+' has already been deleted');});
app.get('/diary', (req, res) => 
    res.redirect('/diary/'+req.query.id));

app.post('/diary', (req, res) => {
    console.log(req.body.title);
    diaryBook.push(new Diary(diaryBook.length, req.body.title, true));
    res.send('Added Diary '+print_diary(diaryBook.length-1));
});

app.put('/diary', (req, res) => {
    var id=parseInt(req.body.id);
    if (id>=diaryBook.length) res.status(404).send('Diary does not exist!');
    else if (diaryBook[id].isActive) {
        diaryBook[id].title=req.body['title'];
        res.send('Changed Diary '+print_diary(id));
    } else res.send('Diary #'+req.body.id+' has already been deleted');
});

app.delete('/diary', (req, res) => {
    var id=parseInt(req.body.id);
    if (id>=diaryBook.length) res.status(404).send('Diary does not exist!');
    else if (diaryBook[id].isActive) {
        diaryBook[id].title='';
        diaryBook[id].isActive=false;
        res.send('Deleted diary '+print_diary(id));
    } else res.send('Diary #'+req.body.id+' has already been deleted');
});

    
app.listen(port, () => console.log(`Diary server is working...`));