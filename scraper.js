const fs = require('fs');
const https = require('https');
const cheerio = require('cheerio');
/* let siteProducts = ''; */
let pathLink; 
let pageLink;

const options = {
    host: 'shirts4mike.com',
    path: '/shirts.php',
}
let pageLinks = [];

//connect with the website
const request = https.request(options, function(response){
    
    response.on('data', function (chunk) {
        const $ = cheerio.load(chunk);
        /* siteProducts += chunk; console.log(siteProducts); */
        
        $('.products li a').each( function(linkIndex) {
            pageLink =  $(this).attr('href');
            pageLinks.push(pageLink);
           
        });  
        for(var i = 0; i < pageLinks.length; i+= 1){
            options.path = "/" + pageLinks[i];
            const requestPages = https.request(options, function(response){
                console.log('statusCode:', response.statusCode);
                /* response.on('data', function (chunk) {

                }); */
            });
        }
    });
    
    response.on('end', function (){
        console.log('no more data in response');
    });

});

request.on('error', function (e) {
 console.log(e.message);
})
request.end();

//fs.mkdirSync('stuff');
//create directories function
const mkdirSync = function (dirPath) {
    try{
        fs.mkdirSync(dirPath);
    }catch (err){
        if (err.code !== 'EExist'){
            throw err;
        }
    }
}
//mkdirSync('stuff');
//remove Function 
const rmdirSync = function (dirPath) {
    try{
        fs.rmdirSync(dirPath);
    }catch(err){
        if(err.code === 'ENOENT'){
            console.log('myFolder does not exist');
           //return;
           throw err;
        }
        
    }
}
//rmdirSync('stuff');