import React, { Component, ReactElement, forwardRef } from 'react';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom';
import { CssBaseline, withStyles, WithStyles, AppBar, Toolbar, IconButton, Typography, Hidden, Drawer, Divider, List, ListItem, ListItemIcon, ListItemText, Container } from '@material-ui/core';
import { Menu as MenuIcon, Home as HomeIcon, DeveloperBoard, Info as InfoIcon } from '@material-ui/icons';
import style from './style';

type Props = Partial<WithStyles<typeof style> & RouteComponentProps>;

@(withStyles(style) as any)
export default class extends Component<Props, {
  drawerOpen: boolean, 
}> {

  readonly state = {
    drawerOpen: false,
  }

  render() {
    const { drawer } = this;
    const { classes, children } = this.props;
    const { drawerOpen } = this.state;
    return (
      <div className={classes!.root}>
        <CssBaseline />
        <AppBar className={classes!.appBar}>
          <Toolbar>
            <IconButton
              color='inherit'
              edge='start'
              onClick={() => this.setState({drawerOpen: true})}
              className={classes!.menuButton}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant='h6' noWrap>
              Demo2
            </Typography>
          </Toolbar>
        </AppBar>
        <nav className={classes!.drawer}>
          <Hidden smUp>
            <Drawer
              container={window.document.body}
              open={drawerOpen}
              onClose={() => this.setState({drawerOpen: false})}
              classes={{paper: classes!.drawerPaper}}
            >
              {drawer}
            </Drawer>
          </Hidden>
          <Hidden xsDown>
            <Drawer
              classes={{paper: classes!.drawerPaper}}
              variant='permanent'
              open
            >
              {drawer}
            </Drawer>
          </Hidden>
        </nav>
        <main className={classes!.content}>
          <div className={classes!.toolbar} />
          <Container maxWidth='md'>
            <>
              {children}
            </>
          </Container>
        </main>
      </div>
    );
  }

  get drawer() {
    const { classes } = this.props;
    return (
      <>
        <div className={classes!.toolbar}/>
        <Divider />
        {this.makeList(['主页', <HomeIcon />, '/'], ['设备', <DeveloperBoard />, '/devices'])}
        <Divider />
        {this.makeList(['关于', <InfoIcon />, '/about'])}
      </>
    )
  }

  makeList(...list: [string, ReactElement, string?][]) {
    return (
      <List>
        {list.map(([text, icon, to]) => (
          <ListItem 
            button 
            key={text as string}
            component={forwardRef((itemProps, ref) => <Link to={to!} ref={ref as any} {...itemProps}/>)}
          >
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText primary={text}/>
          </ListItem>
        ))}
      </List>
    )
  }
}
