const fs = require('fs');
const https = require('https');
const cheerio = require('cheerio');
const createCsvWriter = require('csv-writer'); console.log(createCsvWriter);

let pageLink;
let siteProducts = "";
const options = {
    host: 'shirts4mike.com',
    path: '/shirts.php',
}
let pageLinks = [];

//connect with the website
const request = https.request(options, function(response){
    //console.log(options);
    
    response.on('data', function (chunk) {
        const $ = cheerio.load(chunk);
        /* siteProducts += chunk; console.log(siteProducts); */
        
        $('.products li a').each( function(linkIndex) {
            pageLink = $(this).attr('href');
            pageLinks.push(pageLink); 
        });  
        for(var i = 0; i < pageLinks.length; i+= 1){
            let pages =  pageLinks[i]; //product url
            //console.log(pages);
            const request2 = https.request(('https://' + options.host + '/' + pages), function(response){
                response.on('data', function (chunk) {
                    //siteProducts += chunk; console.log(siteProducts);
                    const $ = cheerio.load(chunk);
                    let productName = $('.shirt-details h1').text().split(' ').slice(1).join(' ');
                    //console.log(getProductsName.join(' '));
                    let productprice = $('span.price').text();
                    let productImage = $('.shirt-picture img').attr('src'); //console.log(productImage);

                });
            }); 
          request2.end();
        }
        
        console.log(pageLinks);
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