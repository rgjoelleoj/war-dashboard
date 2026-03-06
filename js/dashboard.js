async function loadData(){

const res = await fetch(
"https://YOUR-WORKER.workers.dev/api/war"
)

const data = await res.json()

document.getElementById("iran").innerText =
data.stats.iran

document.getElementById("us").innerText =
data.stats.us

document.getElementById("missiles").innerText =
data.stats.missiles

data.strikes.forEach(s=>{

viewer.entities.add({

position:Cesium.Cartesian3.fromDegrees(
s.lon,
s.lat
),

point:{
pixelSize:8,
color:Cesium.Color.RED
}

})

})

}

loadData()

setInterval(loadData,10000)
