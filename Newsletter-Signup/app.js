const express = require("express");
const bodyParser=require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html")
});

app.post("/", function(req, res){
    const firstName= req.body.fName;
    const lastName = req.body.lName;
    const email= req.body.email;

    var data = {
        members:[
            {
             email_address: email,
             status: "subscribed",
             merge_fields: {
                FNAME: firstName,
                LNAME:lastName
              }

            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us21.api.mailchimp.com/3.0/lists/7c06ae5a3e";

    const options = {
        method : "POST",
        auth: "almir1:6e5895f952aee9312ed426cf2e4e21b2-us21"
    }

   const request =  https.request(url, options, function(response){

      if (response.statusCode === 200) {
        res.sendFile(__dirname + "/success.html");
      } else{
        res.sendFile(__dirname + "/failure.html");
      }


      response.on("data", function(data){
       console.log(JSON.parse(data));
   })
})

request.write(jsonData);
request.end(); 

});

app.post("/failure", function(){
res.redirect("/")
});

app.listen(process.env.PORT, function(){
    console.log("Server started on 3000 port!");
});





//audience id
//6e5895f952aee9312ed426cf2e4e21b2-us21
//list ID
//7c06ae5a3e