const { GoogleSpreadsheet } = require('google-spreadsheet');
const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const app = express();

require('dotenv').config();

const CLIENT_EMAIL = process.env.CLIENT_EMAIL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const PORT = 3001;

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

router.post("/testing", async (request,response) => {
  return response.status(200).json({
    sheets: request.body,
  });
});

app.get("/", (req, res) => res.type('html').send(html));

// add router in the Express app.
app.use("/", router);

app.listen(PORT,() => {
console.log(`Started on PORT ${PORT}`);
})


const html = `
<!DOCTYPE html>
<html>
  <head>
    <title>Hello from Render!</title>
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js"></script>
    <script>
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          disableForReducedMotion: true
        });
      }, 500);
    </script>
    <style>
      @import url("https://p.typekit.net/p.css?s=1&k=vnd5zic&ht=tk&f=39475.39476.39477.39478.39479.39480.39481.39482&a=18673890&app=typekit&e=css");
      @font-face {
        font-family: "neo-sans";
        src: url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff2"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("opentype");
        font-style: normal;
        font-weight: 700;
      }
      html {
        font-family: neo-sans;
        font-weight: 700;
        font-size: calc(62rem / 16);
      }
      body {
        background: white;
      }
      section {
        border-radius: 1em;
        padding: 1em;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-right: -50%;
        transform: translate(-50%, -50%);
      }
    </style>
  </head>
  <body>
    <section>
      Hello from Render!
    </section>
  </body>
</html>
`
