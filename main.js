import mqtt from 'mqtt';
import fetch from 'node-fetch';
const sensors = process.env.SENSORS && process.env.SENSORS.split(',');
const mqttAddr = 'tcp://' + process.env.MQTT;

const getSensor = async (sensor) => {
        const response = await fetch('http://' + sensor);
        const data = await response.json();
        return data;
}

const getSensors = async (client) => {
        sensors.forEach(async (s) => {
                const data = await getSensor(s);
		data.name = 'sensors/' + data.name;
                client.publish(data.name, JSON.stringify({value: data.value}));
        })
}

const main = () => {
	const client = mqtt.connect(mqttAddr);
        client.on('connect', () => {
		console.log('Connected');
                getSensors(client);
        });
        setTimeout(main, 10000);
}

main();
