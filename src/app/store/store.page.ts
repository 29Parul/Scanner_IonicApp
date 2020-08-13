import { Component,ViewChild ,ElementRef , OnInit, NgZone } from '@angular/core';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import {ActivatedRoute } from '@angular/router';
import { Platform } from '@ionic/angular';

declare var google;

@Component({
  selector: 'app-store',
  templateUrl: './store.page.html',
  styleUrls: ['./store.page.scss'],
})
export class StorePage implements OnInit {
data:string;
places : Array<any>; 
@ViewChild('map') mapElement: ElementRef;
lat:string;
  lng:string;
  location:any;
  latLngResult:any;
map: any;
marker: any;


  constructor(public zone: NgZone,public platform: Platform,
    private nativeGeocoder: NativeGeocoder, private activatedRoute : ActivatedRoute) 
  {

  }
  ngOnInit() {
  
    this.data = this.activatedRoute.snapshot.paramMap.get('qrText')
  }
  
  forwardGeocode() {
    if (this.platform.is('cordova')) {
      let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
      };
      this.nativeGeocoder.forwardGeocode(this.data, options)
      .then((result: NativeGeocoderResult[]) => {
      this.zone.run(() => {
      this.lat = result[0].latitude;
      this.lng = result[0].longitude;
      this.addMap(this.lat,this.lng)
      })
      })
      .catch((error: any) => {
        console.log("error in forwardGeocode: "+error)
      });
      } else {
      let geocoder = new google.maps.Geocoder();
      geocoder.geocode({ 'address': this.data }, (results, status) => {
      if (status == google.maps.GeocoderStatus.OK) {
      this.zone.run(() => {
      this.lat = results[0].geometry.location.lat();
      this.lng = results[0].geometry.location.lng();
     console.log('latitude is'+this.lat,'longitude is'+this.lng)
     this.addMap(this.lat,this.lng)
      })
     
      } else {
      alert('Error - ' + results + ' & Status - ' + status)
      }
      });
      }
  


    }

//Add Maps
addMap(lat,long){
  let coordinatesLat = parseFloat(lat);
  let coordinatesLong = parseFloat(long);
  let latLng = new google.maps.LatLng(coordinatesLat, coordinatesLong);

  let mapOptions = {
  center: latLng,
  zoom: 15,
  mapTypeId: google.maps.MapTypeId.ROADMAP
  }

  this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

  this.getStores(latLng).then((results : Array<any>)=>{
  
      this.places = results;
      for(let i = 0 ;i < results.length ; i++)
      {
          this.createMarker(results[i]);
      }
    });
 

}
// get near by stores
getStores(latLng)
{
var service = new google.maps.places.PlacesService(this.map);
let request = {
  location: latLng,
            types: ["supermarket","grocery_or_supermarket", "store","food"],
            radius: 15000,
            name: ["Morrison"]
};
return new Promise((resolve,reject)=>{
  service.nearbySearch(request,function(results,status){

  
      if(status === google.maps.places.PlacesServiceStatus.OK)
      {
          resolve(results);    
      }else
      {
          reject(status);
      }

  }); 
});

}
// Creating marker
createMarker(place)
{
this.marker = new google.maps.Marker({
map: this.map,
animation: google.maps.Animation.DROP,
position: place.geometry.location
}); 

this.addMarker(place,this.marker);

} 

//add marker to map
addMarker(place,marker){        
let infoWindow = new google.maps.InfoWindow();

google.maps.event.addListener(marker, 'click', function() {
  infoWindow.setContent(
    "<div><strong>" +
      place.name +
      "</strong><br>" +
      "Address: " +
      place.vicinity +
      "<br>" 
      
  );
  infoWindow.open(this.map, this);
});
}
}
