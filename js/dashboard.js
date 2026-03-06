// 1️⃣ Add your Cesium token
Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjNDExMmYxZC1kYWQzLTQ3OWQtYWVmZS00YWM5MWE1NjZlZWUiLCJpZCI6Mzk5MjQzLCJpYXQiOjE3NzI4MDI0MzN9.9jnH_6RJ8BWVcGMhvvbH4JKnPoRZNTEPCM9Opr77mdg"

// 2️⃣ Create the globe viewer
const viewer = new Cesium.Viewer("globe",{
timeline:false,
animation:false
})

// focus camera on Middle East
viewer.camera.flyTo({
destination: Cesium.Cartesian3.fromDegrees(
53,
26,
3000000
)
})


// 3️⃣ Load data from Cloudflare Worker
async function loadData(){

const res = await fetch(
"https://war-data-api.rgjoelleoj.workers.dev"
)

const data = await res.json()

// update statistics
document.getElementById("iran").innerText =
data.stats.iran

document.getElementById("us").innerText =
data.stats.us

document.getElementById("missiles").innerText =
data.stats.missiles

// add strike markers
data.strikes.forEach(s=>{

viewer.entities.add({

position: Cesium.Cartesian3.fromDegrees(
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

// first load
loadData()

// refresh every 10 seconds
setInterval(loadData,10000)
