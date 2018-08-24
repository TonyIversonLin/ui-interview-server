# MKP Capital Web UI Developer Interview Project

## Congratulations!

You are viewing this project because you have been selected for the final round of interview with MKP Capital. 

As part of this round, the development team would like to see your code for a real-world problem that we frequently try to solve i.e. *rendering real-time information to the Investment Team.*

To install this application, clone the repo, install npm packages and run npm start. 

```sh
$ git clone https://github.com/mkpcap/ui-interview-server.git && ui-interview
$ npm install 
$ npm start
```

In order to accomplish this task, we are providing you with an angular service and a data model that will interact with the mock data service so you don't have to know the specifics of socketCluster. Just drop this class in your project and bind to an observable that is returned by the subscription. 

```javascript

// mock-data.model.ts
export interface MockData { 
    fundName: string;
    pnl: number;
    cumulativePnl: number;
    return: number;
}

// mock-data.service.ts
/**
 * This is the service class that you will extending to provide data to your components. 
 **/
import * as socketCluster from 'socketcluster-client';

import { Injectable } from '@angular/core';

@Injectable()
export class MockDataService {

  private sc: socketCluster.Socket = socketCluster.Socket;
  private channel: any;

  private options: any = {
    port: 8000
  };

  constructor() {

    this.sc = socketCluster.connect(this.options);

    this.sc.on('connect', function(status){
      console.log('STATUS: ' + JSON.stringify(status));
    });
    this.sc.on('error', function(data){
      console.log('ERROR - ' + JSON.stringify(data));
    });
    this.sc.on('disconnect', function(){
      console.log('DISCONNECTED');
    });
  }

  public subscribe(channelName: string): void {
    this.channel = this.sc.subscribe(channelName);

    this.channel.on('subscribeFail', (err, channel) => {
      console.log(`Failed to subscribe to channel ${channelName}`);
    });

    this.channel.on('subscribe', (channel) => {
      console.log(`Successfully subscribed to channel ${channelName}`);
    });

    this.channel.watch((data) => {
      console.log('Mock Data Received: ' + JSON.stringify(data));
    });

  }

  public unsubscribe(): void {
    this.channel.unsubscribe();
  }

}

```

Bonus points (in order of priority) -

1. Show off your CSS/SCSS/LESS skills.
2. Add any data viz. tool to render the data (linecharts, etc.).
3. Show off your knowledge of how to implement the Redux pattern in an Angular world.
4. Make this run as a docker container. 

Final note - 
The evaluators will be checking for application functionality by performing the following 2 steps:
    
    npm install
    npm start
    
 Please make sure that your solution will not break on either of the above steps, this is a critical part of the evaluation.
