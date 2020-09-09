import { observable, action, autorun } from 'mobx';
import MqttClient from './mqtt_client';
import { pick } from 'lodash';
//mqtt的逻辑先写到这里

export class Device {
  @observable batteryVoltage?: number;
  @observable signined = false;
  @observable acceleration?: {x: number, y: number, z: number};
  @observable temperature?: number;


  constructor(public id: number) {
    autorun(() => {
      if(this.batteryVoltage != null) {
        console.log(this.id, 'voltage updated:', {
          voltage: this.batteryVoltage,
        });
      }
    });

    autorun(() => {
      if(this.signined) {
        console.log(this.id, 'signined');
      }
    });
    
    autorun(() => {
      if(this.acceleration != null) {
        console.log(this.id, 'acc updated:', {
          acc: pick(this.acceleration, 'x', 'y', 'z'),
        });
      }
    });

    autorun(() => {
      if(this.temperature) {
        console.log(this.id, {
          temp: this.temperature,
        });
      }
    })
  }
}



export default class Store {
  @observable devices: Device[] = [];

  constructor(private client: MqttClient) {
    client.on('signin', action(deviceId => {
      this.getOrCreate(deviceId).signined = true;
    }));

    client.on('batteryVoltage', action((deviceId, voltage) => {
      this.getOrCreate(deviceId).batteryVoltage = voltage;
    }));

    client.on('acceleration', action((deviceId, x, y, z) => {
      this.getOrCreate(deviceId).acceleration = {x, y, z};
    }));

    client.on('temperature', action((deviceId, temp) => {
      this.getOrCreate(deviceId).temperature = temp;
    }));
  }

  @action private getOrCreate(deviceId: number): Device {
    let device = this.devices.find(device => device.id == deviceId);
    if(!device) {
      device = new Device(deviceId);
      this.devices.push(device);
    }
    return device;
  }

}