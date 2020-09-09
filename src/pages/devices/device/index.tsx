import React, { Component } from 'react';
import { Grow, Card, CardActionArea, Grid, Typography, withStyles, WithStyles } from '@material-ui/core';
import { Device } from '../store';
import { observer } from 'mobx-react';
import style from './style';
import * as three from 'three';
import { Battery20 } from '@material-ui/icons';

type Props = Partial<WithStyles<typeof style>> & {
  device: Device
};

@(withStyles(style) as any)
@observer
export default class extends Component<Props> {
  canvasRef = React.createRef<HTMLCanvasElement>();

  componentDidMount() {
    const canvas = this.canvasRef.current;
    const gl = canvas?.getContext('webgl2');
    if (canvas != null && gl != null) {
      const width = canvas.width;
      const height = canvas.height;

      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      
      const scene = new three.Scene();
      scene.fog = new three.Fog(0xffffff, 0.015, 100);

      const camera = new three.PerspectiveCamera(50, width / height, 0.1, 800);
      camera.position.x = -15;
      camera.position.y = 20;
      camera.position.z = 15;
      camera.lookAt(scene.position);

      const renderer = new three.WebGLRenderer({
        canvas,
      });

      renderer.setClearColor(0xffffff);
      renderer.setSize(width, height);
      //renderer.shadowMapEnabled = true;

      //添加环境光
      const ambientLight = new three.AmbientLight(0x808080);
      scene.add(ambientLight);

      const spotLight = new three.SpotLight(0xffffff);
      spotLight.position.set(-40, 60, -10);
      scene.add(spotLight);

      const cubeGeometry = new three.BoxGeometry(4, 4, 4);
      const cubeMaterial = new three.MeshLambertMaterial({
        color: 0x808080,
      });
      const cube = new three.Mesh(cubeGeometry, cubeMaterial);
      cube.position.x = 0;
      cube.position.y = -2;
      cube.position.z = 0;

      scene.add(cube);

      const render = () => {
        scene.traverse(e => {
          if(e instanceof three.Mesh) {
            e.rotation.x += 0.01;
            e.rotation.y += 0.01;
            e.rotation.z += 0.01;
          }
        })
        requestAnimationFrame(render);
        renderer.render(scene, camera);
      }

      render();
      
    }
  }

  render() {
    const { canvasRef } = this;
    const { device, classes } = this.props;
    const { acceleration: acc } = device;
    return (
      <Grow in>
        <Card>
          <CardActionArea className={classes?.card}>
            <Typography variant='h5'>
              {device.id}
            </Typography>
            <Typography variant='body2'>
              <Battery20 className={classes?.icon}/>
            </Typography>
            <Typography variant='body2'>
              加速度: {acc != null ? `x: ${acc.x}, y: ${acc.y}, z: ${acc.z}` : '未获取'}
            </Typography>
            <Typography variant='body2'>
              {device.signined ? '已签到' : '未签到'}
            </Typography>
            <Typography variant='body2'>
              温度值: {device.temperature}
            </Typography>
            <canvas width='150' ref={canvasRef}>

            </canvas>
          </CardActionArea>
        </Card>
      </Grow>
    );
  }
}