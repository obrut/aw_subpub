import mqtt from 'mqtt';
import fetch from 'node-fetch';
const sensors = process.env.SENSORS && process.env.SENSORS.split(',');

const getSensor = async (sensor) => {
        const response = await fetch('http://' + sensor);
        const data = await response.json();
        return data;
}

const getSensors = async (client) => {
        sensors.forEach(async (s) => {
                const data = await getSensor(s);
		data.name = 'sensors/' + data.name;
                client.publish('sensors', JSON.stringify(data));
                console.log( 'Published', JSON.stringify(data));
        })
}

const main = () => {
	const mqttAddr = 'tcp://' + process.env.MQTT;
	console.log(`Connecting to ${mqttAddr}`);
        const client = mqtt.connect(mqttAddr);
        client.on('connect', () => {
		console.log('Connected');
                getSensors(client);
        });
        setTimeout(main, 10000);
}

main();
