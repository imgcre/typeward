import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Button, Grid } from '@material-ui/core';
import { Provider } from 'mobx-react';
import Client from './mqtt_client';
import Store, { Device } from './store';
import DeviceComp from './device';

const client = new Client();
const store = new Store(client);

(window as any).store = store;

client.connect();

@observer
export default class extends Component {
  render() {
    const { devices } = store;
    return (
      <>
        <Grid container spacing={2}>
          {devices!.map(device => (
            <Grid key={device.id} item xs={12} sm={6} md={3}>
              <DeviceComp device={device} />
            </Grid>
          ))}
        </Grid>
      </>
    )
  }
}
