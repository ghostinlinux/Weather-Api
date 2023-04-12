const http = require('http');
const fs = require('fs');
var requests = require('requests');

const homeFile = fs.readFileSync("home.html","utf-8");

const replaceVal = (tempVal,orgVal)=>{
    let temperature = tempVal.replace("{%tempval%}",orgVal.main.temp);
    temperature = temperature.replace("{%tempmin%}",orgVal.main.temp_min);
    temperature = temperature.replace("{%tempmax%}",orgVal.main.temp_max);
    temperature = temperature.replace("{%city%}",orgVal.name);
    temperature = temperature.replace("{%country%}",orgVal.sys.country);
    const icon = orgVal.weather[0].icon;
    const iconurl = "https://openweathermap.org/img/wn/" +icon+"@2x.png";

    temperature = temperature.replace("{%weathericon%}",iconurl);
    
    // console.log(orgVal.weather.id);
    return temperature;
}

const server = http.createServer((req,res)=>{
    if(req.url == "/"){
        const location = 'Delhi'
    
        requests(`https://api.openweathermap.org/data/2.5/weather?q= ${location} &appid=404a2ca969a0ebb4b6e13cf3ba4321df&units=metric`)
.on('data',(chunk)=>{
    const objData = JSON.parse(chunk);
    const arrData = [objData];
    const realTimeData = arrData.map(val => replaceVal(homeFile,val)).join("");

    res.write(realTimeData);
    // console.log(realTimeData);
})
.on('end',(err) => {
  if (err) return console.log('connection closed due to errors', err);
 res.end();
});
    
    
    }
});

server.listen(3000,"127.0.0.1")