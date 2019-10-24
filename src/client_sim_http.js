// Device Simulation
const request = require('request')

const PORT = 3000

const url= `http://localhost:${3000}/report/temperature`

function reportTemp(id, temp) {
    request.post({
        uri: url,
        method: 'POST',
        body:{
            id: id,
            temperature: temp
        },
        json:true //json으로 보낼경우 true로 해주어야 header값이 json으로 설정됩니다.
    }, function(error, resp) {
        console.log(`dev-${id} report ${temp} value`)
    })
}

const deviceId = Number(process.argv[2] || 1)

setInterval(() => {
    const temp = Math.random() * 40
    reportTemp(deviceId, temp)
}, 1000)