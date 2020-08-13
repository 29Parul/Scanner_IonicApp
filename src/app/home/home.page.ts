import { Component } from '@angular/core';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { Platform } from '@ionic/angular';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { Router } from '@angular/router';



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  scanSub: any;
  subscribe:any;
  qrText: string;
 
  constructor(
    public platform: Platform,
    private nativeGeocoder: NativeGeocoder,
    private router : Router,
    private qrScanner: QRScanner,
  ) 
    {
      this.platform.backButton.subscribeWithPriority(0, () => {
        document.getElementsByTagName('body')[0].style.opacity = '1';
        this.scanSub.unsubscribe();

      });
     
    }
//Scan QR Code
    startScanning() {
      this.qrScanner.prepare().
        then((status: QRScannerStatus) => {
          if (status.authorized) {
            this.qrScanner.show();
            this.scanSub = document.getElementsByTagName('body')[0].style.opacity = '0';
         
            this.scanSub = this.qrScanner.scan()
              .subscribe((textFound: string) => {
                document.getElementsByTagName('body')[0].style.opacity = '1';
                this.qrScanner.hide();
                this.scanSub.unsubscribe();
  
                this.qrText = textFound;
               
                if(this.qrText ){
                  this.router.navigate(['store/'+this.qrText]);
                  }
                 
                
              }, (err) => {
                alert(JSON.stringify(err));
              });
  
          } else if (status.denied) {
          } 
        })
        .catch((e: any) => console.log('Error is', e));
       
    }

   
  }

  
  


