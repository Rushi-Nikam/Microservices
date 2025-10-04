const express=require('express');
const app=express();
const port=3200;

const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: 'localhost',   
  user: 'root',         
  password: 'amey@123', 
  database: 'whetherdb'    
});


connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.stack);
    return;
  }
  console.log('Connected to MySQL as ID ' + connection.threadId);
});





app.get('/monthly-analysis',(req,res)=>{
    const query = `select AVG(temperature) from whethertable where \`month\`="Sept" and \`year\`=2025;`;
    connection.query(query,(err,result)=>{
        if(err){
            console.error('Error executing query:', err.stack);
            res.status(500).send('Error executing query');
            return;
        }
        res.json(result);
    })
})


app.listen(port,()=>{
    console.log(`Analysis server listening at http://localhost:${port}`);
})



