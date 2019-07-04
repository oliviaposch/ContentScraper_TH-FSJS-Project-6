const fs = require('fs');
const https = require('https');
const cheerio = require('cheerio');
const createCsvWriter = require('csv-writer').createArrayCsvWriter; //console.log(createCsvWriter);


let pageLink;
const options = {
    host: 'shirts4mike.com',
    path: '/shirts.php',
}
let pageLinks = [];
let pages;
let currentDay = new Date();
let month = currentDay.getUTCMonth() + 1; //months from 1-12
let day = currentDay.getUTCDate();
let year = currentDay.getUTCFullYear();
let newdate = year + "-" + month + "-" + day; //console.log(newdate);
const csvFile = fs.createReadStream('/data/' + newdate + '.csv');

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
        for(let i = 0; i < pageLinks.length; i+= 1){
            pages =  pageLinks[i]; //product url
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
        
        //console.log(request2);
    });
    
    response.on('end', function (){
        console.log('no more data in response');
    });

}); //connect with the website

request.on('error', function (e) {
 console.log(e.message);
})
request.end();

//check iif data folder exist
if ( !fs.existsSync('data') ) {

    fs.mkdirSync('data');

}

/*save data in a csv file*/

//header configuration : 
const csvWriter = createCsvWriter({
    header: ['NAME', 'LANGUAGE'],
    path: csvFile // I have to create this file first!
}); 

//data structure for csv file:

const data = [  
    ['Bob',  'French, English'],
    ['Mary', 'English']
  ];
  
csvWriter.writeRecords(data)
  .then(()=> console.log('The CSV file was written successfully'));
 
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


/*save data in a csv file*/


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

