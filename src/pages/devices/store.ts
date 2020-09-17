import { observable, action, autorun, computed } from 'mobx';
import MqttClient from './mqtt_client';
import { pick } from 'lodash';
//mqtt的逻辑先写到这里

export class Device {
  @observable batteryVoltage?: number;
  @observable signined = false;
  @observable acceleration?: {x: number, y: number, z: number};
  @observable temperature?: number;
  @observable angleRef: {x: number, y: number} = {x: 0, y: 0};


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

  @computed get angleOri() {
    const {x, y, z} = this.acceleration ?? {x: 0, y: 0, z: 1};
    return {
      x: Math.atan(x / z),
      y: -Math.atan(y / z),
    }
  }

  @computed get angle() {
    const {x, y} = this.angleOri;
    const {x: xRef, y: yRef} = this.angleRef;
    return {
      x: x - xRef,
      y: y - yRef,
    }
  }

  @action leveling() {
    this.angleRef = this.angleOri;
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
      let device = this.getOrCreate(deviceId);
      device.acceleration = {x, y, z};
    
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