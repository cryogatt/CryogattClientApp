import { Reader_CanConnect } from '../api/reader';
import { autoinject } from 'aurelia-framework';
const interval = require('interval-promise');

@autoinject()
export class ReaderService {
      
    public canConnect: boolean;
    private static readerIsOn: boolean = false;
    private static stop = false;

    constructor() {

      this.canConnect = false;
      this.connect();     
    }

    public async connect() {

       this.canConnect = await ReaderService.isConnected();
    }

    public static async isConnected(): Promise<boolean> {

      return await Reader_CanConnect();
    }

    // Ensures only one reader operation is being carried out
    public static async startPollingReader(item: any, speed?: number) {

      // If reader is waiting to be stopped
      while (ReaderService.readerIsOn) {

        console.log("Waiting to start reader..");
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
      
      speed ? this.pollReader(item, speed): this.pollReader(item);
    }

    public static async stopPollingReader() {

      this.stop = true;

      // Wait to stop current polling - Work around to async libray not supporting outside call to stop loop 
      while (ReaderService.readerIsOn) {

        console.log("Waiting to stop reader..");
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
    }

    private static async pollReader(item: any, speed?: number) {
      
      this.stop = false;
      ReaderService.readerIsOn = true;

      console.log("Reader started");

      var delay = speed ? speed : Infinity;

      interval(async (iteration, stop) => {

        if (this.stop) {

          console.log("Reader stopped");
          ReaderService.readerIsOn = false;
          stop();
          await new Promise((resolve) => setTimeout(resolve, 800));
        }
        await item().catch(error => {

          console.log("error while polling reader: " + error);
          this.stop = true;
        });
      }, 0, { iterations: delay, stopOnError: true });
    }

    public static readerOn(): boolean {

        return ReaderService.readerIsOn;
    }
}
