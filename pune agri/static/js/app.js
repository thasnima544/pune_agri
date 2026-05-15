// ==========================================
// CLOCK
// ==========================================

function updateClock(){

    const now = new Date();

    const clockElement = document.getElementById('live-clock');

    if(clockElement){
        clockElement.innerHTML = now.toLocaleString();
    }
}

setInterval(updateClock,1000);
updateClock();


// ==========================================
// MAIN GIS MAP
// ==========================================

const mainGISMap = L.map('map').setView([18.5204,73.8567],10);

L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
        maxZoom:19
    }
).addTo(mainGISMap);


// ==========================================
// TALUKA MARKERS
// ==========================================

const talukas = [

    {
        name:'Haveli',
        lat:18.5204,
        lon:73.8567
    },

    {
        name:'Mulshi',
        lat:18.4600,
        lon:73.5200
    },

    {
        name:'Baramati',
        lat:18.1500,
        lon:74.5800
    },

    {
        name:'Junnar',
        lat:19.2000,
        lon:73.8800
    }
];



talukas.forEach(t=>{

    L.circleMarker(
        [t.lat,t.lon],
        {
            radius:10,
            color:'yellow',
            fillColor:'red',
            fillOpacity:0.8
        }

    ).addTo(mainGISMap)

    .bindPopup(
        '<b>' + t.name + ' Taluka</b>'
    );

});


// ==========================================
// DRONE MAP
// ==========================================

const droneMap = L.map('drone-map').setView([18.5204,73.8567],11);

L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
        maxZoom:19
    }
).addTo(droneMap);


const droneIcon = L.icon({

    iconUrl:
    'https://cdn-icons-png.flaticon.com/512/3652/3652191.png',

    iconSize:[50,50]
});


const dronePath = [

    [18.5204,73.8567],
    [18.5240,73.8600],
    [18.5300,73.8700],
    [18.5360,73.8780],
    [18.5420,73.8860],
    [18.5480,73.8920]
];


let droneMarker = L.marker(
    dronePath[0],
    {icon:droneIcon}
).addTo(droneMap);


L.polyline(
    dronePath,
    {
        color:'red',
        weight:5
    }
).addTo(droneMap);


let droneIndex = 0;

function moveDrone(){

    droneIndex++;

    if(droneIndex >= dronePath.length){
        droneIndex = 0;
    }

    droneMarker.setLatLng(
        dronePath[droneIndex]
    );

    droneMap.panTo(
        dronePath[droneIndex]
    );
}

setInterval(moveDrone,2000);


// ==========================================
// SURVEY AREAS
// ==========================================

L.polygon([

    [18.510,73.840],
    [18.515,73.850],
    [18.522,73.845],
    [18.519,73.835]

],{
    color:'green',
    fillColor:'green',
    fillOpacity:0.3
}).addTo(droneMap)
.bindPopup('Survey Area A');


L.polygon([

    [18.535,73.880],
    [18.540,73.892],
    [18.548,73.886],
    [18.543,73.874]

],{
    color:'orange',
    fillColor:'orange',
    fillOpacity:0.3
}).addTo(droneMap)
.bindPopup('Survey Area B');


// ==========================================
// SENSOR DATA
// ==========================================

async function loadSensorData(){

    const response = await fetch('/sensor_data');

    const data = await response.json();

    document.getElementById('sensor-data').innerHTML =

        '<div class="sensor-box">' +

        '<p><b>Temperature:</b> ' + data.temperature + ' °C</p>' +

        '<p><b>Humidity:</b> ' + data.humidity + ' %</p>' +

        '<p><b>Soil Moisture:</b> ' + data.soil_moisture + ' %</p>' +

        '<p><b>NPK:</b> ' + data.npk + '</p>' +

        '<p><b>pH Value:</b> ' + data.ph + '</p>' +

        '<p><b>Water Level:</b> ' + data.water_level + ' %</p>' +

        '<p><b>Status:</b> ' + data.status + '</p>' +

        '</div>';
}

loadSensorData();
setInterval(loadSensorData,3000);


// ==========================================
// TELEMETRY
// ==========================================

async function loadTelemetry(){

    const response = await fetch('/telemetry');

    const data = await response.json();

    document.getElementById('telemetry').innerHTML =

        '<div class="telemetry-box">' +

        '<p><b>GPS:</b> ' + data.gps + '</p>' +

        '<p><b>Altitude:</b> ' + data.altitude + '</p>' +

        '<p><b>Speed:</b> ' + data.speed + '</p>' +

        '<p><b>Battery:</b> ' + data.battery + '</p>' +

        '<p><b>Satellites:</b> ' + data.satellites + '</p>' +

        '<p><b>Status:</b> ' + data.drone_status + '</p>' +

        '</div>';
}

loadTelemetry();
setInterval(loadTelemetry,2000);


// ==========================================
// CHART
// ==========================================

const chartCanvas = document.getElementById('cropChart');

if(chartCanvas){

    const ctx = chartCanvas.getContext('2d');

    new Chart(ctx, {

        type:'doughnut',

        data:{

            labels:[
                'Healthy',
                'Moderate',
                'Critical'
            ],

            datasets:[{

                data:[72,21,7],

                backgroundColor:[
                    '#1B6B2E',
                    '#f0ad4e',
                    '#d9534f'
                ]
            }]
        }
    });
}
