Cesium.Ion.defaultAccessToken = "YOUR_TOKEN"

const viewer = new Cesium.Viewer('globe')

viewer.camera.flyTo({
destination:Cesium.Cartesian3.fromDegrees(53,26,3000000)
})

async function loadStrikes(){

const res = await fetch("../data/strikes.json")

const strikes = await res.json()

strikes.forEach(s=>{

viewer.entities.add({

position:Cesium.Cartesian3.fromDegrees(s.lon,s.lat),

point:{
pixelSize:8,
color:Cesium.Color.RED
}

})

})

}

loadStrikes()

function launchMissile(){

const start = Cesium.Cartesian3.fromDegrees(51.38,35.68)
const end = Cesium.Cartesian3.fromDegrees(55.27,25.20)

viewer.entities.add({

polyline:{
positions:[start,end],
width:3,
material:Cesium.Color.RED
}

})

}

setInterval(launchMissile,4000)

async function loadStats(){

const res = await fetch("../data/stats.json")

const stats = await res.json()

document.getElementById("iran").innerText = stats.iran
document.getElementById("us").innerText = stats.us
document.getElementById("missiles").innerText = stats.missiles

}

loadStats()
