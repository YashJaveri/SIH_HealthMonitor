myLogger =  function(title,content){

    if(!content) content=' ';

    if(!title) title=' ';


    console.log('----------------------------------------------------------------------------------------------');
    console.log(title.toUpperCase());
    console.log(content);
    console.log('-----------------------------------------------------------------------------------------------');
 }   

 module.exports=myLogger;