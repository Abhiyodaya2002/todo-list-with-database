const express=require("express");
const bodyparser=require("body-parser");
const { append } = require("vary");
const { resolveSoa } = require("dns");
const mongoose=require("mongoose");

const app=express();
app.use(bodyparser.urlencoded({extended:true}));
app.set("view engine","ejs");//From ejs.co website documentaion

app.use(express.static("public"));

var workitems=[];
mongoose.connect("mongodb+srv://abhiyodaya2002:pandey150402@cluster0.yii2q.mongodb.net/?retryWrites=true&w=majority"); //connecting our data base
const itemsSchema={ //creating our database schema
  name: String
}
//creating mongoose model based on the schema
const Item= mongoose.model("Item",itemsSchema);

//Creating some documents
const item1=new Item({
  name: "Welcome to the todo list!"
});

const item2=new Item({
  name:"once again welcome dear."
});

let defaultitems=[item1,item2];


app.get("/",function(req,res)
{
   // Notes on toLocaleString(locales, options) function: --->
   //The toLocaleString() method returns a string with a language sensitive representation of this date.
   //The results provided by toLocaleString() can be customized using the options argument.
   // In order to get the format of the language used in the user interface of your application, make sure to specify that language (and possibly some fallback languages) using the locales argument:
   
Item.find({},function(err,results){
  //results is basically an array that contains all the documents in Item collection
  if(results.length===0)
  {
    Item.insertMany(defaultitems,function(err)
{
  if(err)
  console.log(err);
  else
 console.log("insertion complete");
})

res.redirect("/");
  }
  else
  {
    res.render("list",{listTitle:"Today", newlistitems:results});
  }
 
  
})
  
   
})

app.post("/",function(req,res)
{
 // console.log(req.body); -->you can check the value what your variables are holding .
  var itemName =req.body.newitem;
  const newItem=new Item ({
    name:itemName
  });
  newItem.save();

  res.redirect("/");
})

app.post("/delete",function(req,res)
{
  const checkedItemId= req.body.checkbox;
  Item.findByIdAndRemove(checkedItemId,(err)=>{
    if(!err)
    {
      console.log("deleted successfully");
      res.redirect("/");
    }
  })
});

app.get("/work",function(req,res)
{
    res.render("list",{listTitle:"Work List",  newlistitems:workitems});
})
app.post("/work",function(req,res)
{
  let it=rq.body.newitem;
  workitems.push(it);
  res.redirect("/work");
})

app.get("/about",function(req,res)
{
  res.render("about");
})

app.listen(process.env.PORT ||3000,function()
{
    console.log("Port running at 3000");
})


/*
To summerize the whole code:
->When we first load up our home page we go through app.get and render the list.ejs passing in two variables :
one called "listTitle" and another called "newlistitems".

->Now newlistitems is set to items array and it gets passed into list.ejs under this variable name "newlistitems".And over here we have a fo loop that loops through the entire length of the "newlistitems" array and it renders a new li for each item which is inside the array.

->Now when a user adds a new item through the text input then that gets saved under the variable name "newitem" and we trigger a post request to the home route which will be caught by app.post and when we are inside app.get we grab the value of "newitem" and then we save it to a variable called "item" and we add that item to our "items" array.And then we are redirected to the home route.

->Now we go back to app.get but now the items array is increased by a size of one and our new item get pushed at the end of the array.

->And now we are able to go ahead and render list again and pass over the now updated array with all of our list items.


 */