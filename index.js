const { GoogleSpreadsheet } = require('google-spreadsheet');
const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const app = express();

require('dotenv').config();

const CLIENT_EMAIL = process.env.CLIENT_EMAIL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

async function getData(data) {
  const validated = {
    projectSpreadsheetLink: "https://docs.google.com/spreadsheets/d/1HS3-a1zJu-ioUvT-COMoSBtAV62wuxdGrxJA2gE4V5E/edit#gid=0",

  };
  const doc = new GoogleSpreadsheet(validated.projectSpreadsheetLink.split('/d/')[1].split('/')[0]);

  await doc.useServiceAccountAuth({
    client_email: CLIENT_EMAIL,
    private_key: PRIVATE_KEY.replace(/\\n/gm, '\n')
  });

    await doc.loadInfo(); // loads sheets
    const sheet = doc.sheetsByIndex[data.projectSpreadsheetNumber - 1]; // the first sheet
    await sheet.loadCells('A1:W45');
    const sheets = {
      grantedMiles: sheet.getCellByA1(data.projectSpreadsheetCells.grantedMiles).value,
      totalMiles: sheet.getCellByA1(data.projectSpreadsheetCells.totalMiles).value,
      grantedFeet: sheet.getCellByA1(data.projectSpreadsheetCells.grantedFeet).value,
      totalFeet: sheet.getCellByA1(data.projectSpreadsheetCells.totalFeet).value,
    };

  return sheets;
}

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

router.post("/handle", async (request,response) => {
  const sheets = await getData(request.body);
  return response.status(200).json({
    sheets,
  });
});

// add router in the Express app.
app.use("/", router);

app.listen(3000,() => {
console.log("Started on PORT 3000");
})
