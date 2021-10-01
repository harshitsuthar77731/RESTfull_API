const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));


//connecting to mongodb server port
mongoose.connect("mongodb://localhost:27017/wikiDB");


// created schema
const wikiSchema = new mongoose.Schema({
    title:String,
    content: String
})

// creting collection model
let Article = mongoose.model("articles",wikiSchema);

//app.rout('/xyz').get().post().delete();


app.route('/articles')
.get(function(req,res){
    
    Article.find({},function(err,data){
        if(!err)
        {
            res.send(data);
        }
        else
        {
            res.send(err);
        }
        
    })
})
.post(function(req,res){
    let article = new Article({
        title : req.body.title,
        content : req.body.content

    })
    article.save(function(err){
        if(!err)
        {
            res.send("succesfully submitted");
        }
        else
        {
            res.send(err);
        }
    })
})
.delete(function(req,res){
    Article.deleteMany(function(err){
        if(!err)
        {
            res.send("succesfully deleted");
        }
        else
        {
            res.send(err);
            console.log(err);
        }
    })


});


app.route('/articles/:articleTitle')
.get(function(req,res){
    let query = req.params.articleTitle;
    console.log(query);
    Article.findOne({title:query},function(err,data){
        if(!err)
        {
            res.send(data);
            console.log(data);
        }
        else
        {
            res.send(err);
            console.log(err);
        }
    })
})
.put(function(req,res)
{
    Article.findOneAndUpdate({title:req.params.articleTitle},
        {title:req.body.title,content:req.body.content},
        {overwrite:true}, // overwrite true meanse remove all the existing value of variable with new one if we don't provide then it will show blank space
        function(err){
        if(!err){
        res.send("successfully updated")
        console.log("successfully updated");
        
        }
    })
})
.patch(function(req,res){

    Article.findOneAndUpdate({title:req.params.articleTitle},
        {$set : {content:req.body.content}}, //if we only want to update a particular variables from all
        function(err){
        if(!err){
        res.send("successfully updated")
        console.log("successfully updated");
        
        }
    })

})
.delete(function(req,res){
    Article.findOneAndDelete({title:req.params.articleTitle},function(err){
        if(!err)
        {
            res.send("succesfully deleted");
        }
        else
        {
            res.send(err);
            console.log(err);
        }
    })
 }
)



app.listen(3000,function(){
    console.log("listing to port 3000");
})