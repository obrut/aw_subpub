import mqtt from 'mqtt';
import fetch from 'node-fetch';
const mqttAddr = `mqtt://${process.env.MQTT}`;
const sensors = process.env.SENSORS && process.env.SENSORS.split(',');

const getSensor = async (sensor) => {
        const response = await fetch('http://' + sensor);
        const data = await response.text();
        return data;
}

const getSensors = async (client) => {
        sensors.forEach(async (s) => {
                const data = await getSensor(s);
                client.publish('sensors', data)
                console.log( 'Published', data );
        })
}

const main = () => {
        const client = mqtt.connect(`${mqttAddr}`);
	console.log(`Connecting to ${mqttAddr}`);
        client.on('connect', () => {
		console.log('Connected');
                getSensors(client);
        });
        setTimeout(main, 10000);
}

main();
