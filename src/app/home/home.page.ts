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

    startScanning() {
      // Optionally request the permission early
     // (window.document.querySelector('ion-app') as HTMLElement).classList.add('cameraView');
      this.qrScanner.prepare().
        then((status: QRScannerStatus) => {
          if (status.authorized) {
            this.qrScanner.show();
            this.scanSub = document.getElementsByTagName('body')[0].style.opacity = '0';
          // debugger
            this.scanSub = this.qrScanner.scan()
              .subscribe((textFound: string) => {
                document.getElementsByTagName('body')[0].style.opacity = '1';
                this.qrScanner.hide();
                this.scanSub.unsubscribe();
  
                this.qrText = textFound;
               
                if(this.qrText ){
                  this.router.navigate(['store/'+this.qrText]);
                  }
                  else{
                    console.log('postcode is not scanned')
                  }
                
              }, (err) => {
                alert(JSON.stringify(err));
              });
  
          } else if (status.denied) {
          } else {
  
          }
        })
        .catch((e: any) => console.log('Error is', e));
       
    }

   
  }

  
  


