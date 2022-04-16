const router = require('express').Router()
const { google } = require("googleapis");




router.post('/',async (req,res)=>{
   // Storing Given request payload
    const spreadsheetId = req.body.spreadsheet_id
    const sheetid = req.body.sheet_id
    const rNumber = req.body.row_number
    const cNumber = req.body.column_number
    const v = req.body.value
  
    // Function to convert given column number into letter 
    function numToSSColumn(num){
      let s = '', t;
    
      while (num > 0) {
        t = (num - 1) % 26;
        s = String.fromCharCode(65 + t) + s;
        num = (num - t)/26 | 0;
      }
      return s || undefined;
    }
    /***********************************************************/
  
    // converting given row number and column number into spreadsheet letter columns

     const range = numToSSColumn(cNumber) + rNumber;
    // console.log(range)

    /**************************/
  
    //authorization of Google API
    const auth = new google.auth.GoogleAuth({
      keyFile:"credentials.json",
      scopes: "https://www.googleapis.com/auth/spreadsheets",
    });
    const client = await auth.getClient();

  /********************************************************************** */
  
    const googleSheets = google.sheets({version:"v4",auth:client});
  
    const data = await googleSheets.spreadsheets.get({
      auth,
      spreadsheetId,
    })
    const sheets = data.data.sheets
  
    let sheet;
     sheets.map(s => {
         if(s.properties.sheetId == sheetid){
           sheet = s.properties.title
          
         }
     })
    //  console.log(sheet)  


//      Updating the sheets  
    googleSheets.spreadsheets.values.update({
      auth: auth,
      spreadsheetId:spreadsheetId ,
      range: `${sheet}!${range}`, 
      valueInputOption: "USER_ENTERED",
      resource: {
        values: [ [`${v}`] ]
      }
    }, (err, response) => {
      if (err) {
        console.log('The API returned an ' + err);
        res.send(false);
        return;
      } else {
          console.log("Updated");
          res.send(true)
      }
    });
    /****************************************/
  })

  module.exports = router