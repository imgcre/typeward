import mqtt, { AsyncMqttClient } from 'async-mqtt';
import config from '@/config/mqtt';
import { Device } from './store';
enum PayloadId {
  Signin = 1,
  BattetyVoltage = 2,
  Acceleration = 3,
  Temperature = 4,
}

//mqtt.publish('imgcre/v1/233', '\x02\x00\03')
//await mqtt.publish('imgcre/v1/233', '\x03\x00\x01\x00\x02\x00\x03')
//mqtt.publish('imgcre/v1/233', '\x01')

type Events = 'signin' | 'batteryVoltage' | 'acceleration' | 'temperature';

type Callbacks = Pick<{
  'signin': (deviceId: Device['id']) => void,
  'batteryVoltage': (deviceId: Device['id'], voltage: number) => void,
  'acceleration': (deviceId: Device['id'], x: number, y: number, z: number) => void,
  'temperature': (deviceId: Device['id'], temp: number) => void;
}, Events>

const payloadIds: Record<Events, number> = {
  signin: PayloadId.Signin,
  batteryVoltage: PayloadId.BattetyVoltage,
  acceleration: PayloadId.Acceleration,
  temperature: PayloadId.Temperature,
}

class Queue {
  buffer = new Buffer(0);
  onPush?: () => void;

  push(msg: Buffer) {
    const newBuf = Buffer.alloc(this.buffer.byteLength + msg.byteLength, this.buffer);
    newBuf.set(msg, this.buffer.byteLength);
    this.buffer = newBuf;
    this.onPush?.();
  }

  private async pop(size: number): Promise<Buffer> {
    return new Promise(resolve => {
      const func = () => {
        if(this.buffer.byteLength >= size) {
          this.onPush = undefined;
          const result = this.buffer.slice(0, size)
          this.buffer = this.buffer.slice(size, this.buffer.byteLength)
          resolve(result);
        } else {
          this.onPush = func;
        }
      }
      func();
    })
  }

  async popByte(): Promise<number> {
    return (await this.pop(1)).readUInt8(0);
  }

  async popUShort(): Promise<number> {
    return (await this.pop(2)).readUInt16BE(0);
  }

  async popShort(): Promise<number> {
    return (await this.pop(2)).readInt16BE(0);
  }
}

export default class {
  private client?: AsyncMqttClient;
  private callbacks: Partial<Callbacks> = {};
  private queues: Record<Device['id'], Queue> = {};

  async connect() {
    this.client = await mqtt.connectAsync(config.BORKER_URL);

    //TODO: for debug
    (<any>window).mqtt = this.client;

    await this.client.subscribe('v1/+/+'); //批次
    console.debug('mqtt connected');

    this.client.on('message', (topic, msg) => {
      //console.log({topic, msg});
      const [, , deviceIdStr] = topic.split('/');
      const deviceId = parseInt(deviceIdStr);

      const queue = this.queues[deviceId] ?? new Queue();
      if(!(deviceId in this.queues)) {
        //console.log('queue created');
        this.queues[deviceId] = queue;
        this.poll(deviceId, queue);
      }
      queue.push(msg);
    })
  }

  private async poll(deviceId: Device['id'], queue: Queue) {
    //console.log('poll', deviceId);
    while(true) {
      const payloadId = await queue.popByte();
      const event = <Events | undefined>Object.keys(payloadIds).find(key => payloadIds[<Events>key] === payloadId);
      switch(event) {
        case 'signin':
          this.callbacks[event]?.(deviceId);
          break;
        case 'batteryVoltage':
          let voltage = await queue.popUShort();
          voltage = voltage / 4096 * 6;
          this.callbacks[event]?.(deviceId, voltage);
          break;
        case 'acceleration':
          let axises = [];
          for(let i = 0; i < 3; i++) {
            axises.push(await queue.popShort());
          }
          const [x, y, z] = axises;
          this.callbacks[event]?.(deviceId, x, y, z);
          break;
        case 'temperature':
          let temp = await queue.popUShort();
          temp = temp / 326.8 * 2;
          this.callbacks[event]?.(deviceId, temp);
          break;
      }
    }
  }

  on<T extends keyof Callbacks>(event: T, callback: Callbacks[T]) {
    this.callbacks[event] = callback;
  }
};
