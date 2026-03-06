Cesium.Ion.defaultAccessToken =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjNDExMmYxZC1kYWQzLTQ3OWQtYWVmZS00YWM5MWE1NjZlZWUiLCJpZCI6Mzk5MjQzLCJpYXQiOjE3NzI4MDI0MzN9.9jnH_6RJ8BWVcGMhvvbH4JKnPoRZNTEPCM9Opr77mdg"

const viewer = new Cesium.Viewer("globe",{
timeline:false,
animation:false,
shouldAnimate:true
})

viewer.camera.flyTo({
destination:Cesium.Cartesian3.fromDegrees(
53,
26,
3000000
)
})

/* rotating earth */

viewer.clock.onTick.addEventListener(()=>{

viewer.scene.camera.rotate(
Cesium.Cartesian3.UNIT_Z,
0.00015
)

})

/* missile arc */

function launchMissile(startLon,startLat,endLon,endLat){

const start =
Cesium.Cartesian3.fromDegrees(startLon,startLat)

const end =
Cesium.Cartesian3.fromDegrees(endLon,endLat,500000)

viewer.entities.add({

polyline:{
positions:[start,end],
width:3,
material:new Cesium.PolylineGlowMaterialProperty({
glowPower:0.3,
color:Cesium.Color.RED
})
}

})

}

setInterval(()=>{

launchMissile(
51.38,35.68,
55.27,25.20
)

},4000)

/* strike heat */

function addStrikeHeat(lat,lon){

viewer.entities.add({

position:Cesium.Cartesian3.fromDegrees(lon,lat),

ellipse:{
semiMajorAxis:300000,
semiMinorAxis:300000,
material:Cesium.Color.RED.withAlpha(0.25)
}

})

}

/* load API data */

let strikeEntities=[]

async function loadData(){

try{

const res=await fetch(
"https://war-data-api.rgjoelleoj.workers.dev"
)

const data=await res.json()

document.getElementById("iran").innerText=data.stats.iran
document.getElementById("us").innerText=data.stats.us
document.getElementById("missiles").innerText=data.stats.missiles

strikeEntities.forEach(e=>viewer.entities.remove(e))
strikeEntities=[]

data.strikes.forEach(s=>{

const entity=viewer.entities.add({

position:Cesium.Cartesian3.fromDegrees(
s.lon,
s.lat
),

point:{
pixelSize:8,
color:Cesium.Color.RED
}

})

addStrikeHeat(s.lat,s.lon)

strikeEntities.push(entity)

})

}catch(err){

console.log("API error",err)

}

}

loadData()
setInterval(loadData,10000)

/* aircraft radar */

async function loadAircraft(){

try{

const res=await fetch(
"https://opensky-network.org/api/states/all"
)

const data=await res.json()

data.states.slice(0,40).forEach(a=>{

if(a[5] && a[6]){

viewer.entities.add({

position:Cesium.Cartesian3.fromDegrees(
a[5],
a[6]
),

point:{
pixelSize:4,
color:Cesium.Color.YELLOW
}

})

}

})

}catch{

console.log("Aircraft API blocked")

}

}

loadAircraft()
setInterval(loadAircraft,30000)

/* ships near Hormuz */

function addShip(lon,lat,name){

viewer.entities.add({

position:Cesium.Cartesian3.fromDegrees(lon,lat),

billboard:{
image:
"https://cdn-icons-png.flaticon.com/512/68/68839.png",
scale:0.05
},

label:{
text:name,
fillColor:Cesium.Color.WHITE
}

})

}

addShip(56.25,25.10,"Tanker A")
addShip(56.45,24.80,"Tanker B")
addShip(56.10,24.95,"Tanker C")

/* satellite cloud layer */

viewer.imageryLayers.addImageryProvider(

new Cesium.UrlTemplateImageryProvider({

url:
"https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=e33e555bd29f8b7d4dfdb09b9417fbf5",

credit:"Cloud Layer"

})

)

/* oil chart */

let oilChart

function updateOilChart(price){

if(!oilChart){

oilChart=new Chart(
document.getElementById("oilChart"),
{
type:"line",
data:{
labels:[],
datasets:[{
label:"Oil Price $/barrel",
data:[],
borderColor:"orange"
}]
}
}
)

}

oilChart.data.labels.push(
new Date().toLocaleTimeString()
)

oilChart.data.datasets[0].data.push(price)

oilChart.update()

}

function loadOilPrice(){

const price=
70+Math.random()*10

updateOilChart(price)

}

loadOilPrice()
setInterval(loadOilPrice,60000)
