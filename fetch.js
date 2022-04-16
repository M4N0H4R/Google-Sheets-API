const router = require('express').Router()
const { google } = require("googleapis");



router.post('/',async (req,res)=>{

    const spreadsheetId = req.body.spreadsheet_id;

    let resp=[];

 // Authorization
    const auth = new google.auth.GoogleAuth({
      keyFile:"credentials.json",
      scopes: "https://www.googleapis.com/auth/spreadsheets",
    });
    
      const client = await auth.getClient();
       const googleSheets = google.sheets({version:"v4",auth:client});

 /********************************************************************************* */

       const data = await googleSheets.spreadsheets.get({
         auth,
         spreadsheetId,
       })
       const sheets = data.data.sheets

    //  console.log(sheets)
  
      let sTitle = sheets.map(data =>{
        return data.properties.title;
      })

      // console.log(sTitle);
      
// Storing values of the sheets
         resp = await Promise.all(sTitle.map( async (title) => {
        try{
        const rows =  await googleSheets.spreadsheets.values.get({
          auth,
          spreadsheetId,
          range:`${title}`
        })
        // console.log(rows.data.values)
        return rows.data.values
       
      }
      catch(err){
        console.log(err)
      }
      })
        )
/*******************************************************************/       

        const obj = {};
        resp.forEach((element,index)=>{
            obj[sTitle[index]] = element;
        })
        console.log(obj)
     res.send(obj)
  })


    module.exports = router