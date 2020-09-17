import mqtt, { AsyncMqttClient } from 'async-mqtt';

const toHexString = (bytes: Buffer) =>
  bytes.reduce((str, byte) => str + ' ' + byte.toString(16).padStart(2, '0'), '');

const formatNumber = (n: any) => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
// 时间格式化
const formatTime = (date: any) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
 
  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':');
}


console.log('conning');
// mqtt.connectAsync('ws://www.imgcre.com:8083/mqtt').then(client => {
  
// })

const client = mqtt.connect('ws://www.imgcre.com:8083/mqtt');

// console.log('conn');

// await client.subscribe('v1/+/+');

// client.on('message', (topic, msg) => {
//   console.log(formatTime(new Date()), topic, toHexString(msg));
// })