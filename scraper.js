const fs = require('fs');
const https = require('https');
const cheerio = require('cheerio');
const csv = require('fast-csv'); //module

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


const csvFile = fs.createWriteStream(`${__dirname}/data/` + newdate + '.csv');//create csv file in Data 
/* console.log(csvFile); */

/*  //write csv
 csv.write([
    ['a1','b1'],
    ['b2','c2'],
    ['c2','d2']
], {headers:true}).pipe(csvFile); */


//connect with the website
const request = https.request(options, function(response){
    //console.log(options);
    
    response.on('data', function (chunk) {

        const $ = cheerio.load(chunk);

        $('.products li a').each( function(linkIndex) {
            pageLink = $(this).attr('href');
            pageLinks.push(pageLink); 
        });  
        //console.log(pageLinks);
       
        //daten tracking
        let productName = [];
        let productprice = []; 
        let productImage = [];
        /* let productName ;
        let productprice ; 
        let productImage ; */
      
        for(let i = 0; i < pageLinks.length; i++){
            pages =  pageLinks[i]; //product url
            //console.log(pages);
            const request2 = https.request(('https://' + options.host + '/' + pages), function(response){
                response.on('data', function (chunk) {
                    const $ = cheerio.load(chunk);
                    productName.push( $('.shirt-details h1').text().split(' ').slice(1).join(' ') );
                   // console.log(productName);
                    productprice.push( $('span.price').text() );
                    productImage.push( $('.shirt-picture img').attr('src') ); //console.log(productImage);
                    
                    //console.log(productName);
                }); 
                csv.write([
                    productName
                   /*  productprice,
                    productImage */
                ], {headers:true}).pipe(csvFile); 
            }); 
          
          request2.end(); 
           
        }
       
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

