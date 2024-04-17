import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { FirebaseService } from '../../services/firebase.service';

import {environment} from "src/environments/environment"


@Component({
    selector: 'app-brotherhood',
    templateUrl: './brotherhood.component.html',
    styleUrls: ['./brotherhood.component.css']
})
export class BrotherhoodComponent implements OnInit {

    events: string[] = [];
    eventImages: {event: string, description: string, imageLink: string}[] = [];

    /*files = ['/aepi_website/assets/eventImages/apple.JPG', '/aepi_website/assets/eventImages/apple_picking2.jpg', '/aepi_website/assets/eventImages/eta_initiation.JPG', 
    '/aepi_website/assets/eventImages/guysbeingdudes.jpg', '/aepi_website/assets/eventImages/philly1.jpeg', '/aepi_website/assets/eventImages/philly2.jpeg', 
    '/aepi_website/assets/eventImages/philly3.JPG', '/aepi_website/assets/eventImages/skyzone.png', '/aepi_website/assets/eventImages/IMG_5028.jpg', 
    '/aepi_website/assets/eventImages/IMG_5052.JPG', '/aepi_website/assets/eventImages/IMG_5408.jpg', '/aepi_website/assets/eventImages/IMG_5415.jpg', 
    '/aepi_website/assets/eventImages/IMG_5473.JPG', '/aepi_website/assets/eventImages/IMG_5796.jpg', '/aepi_website/assets/eventImages/IMG_5808.jpg', 
    '/aepi_website/assets/eventImages/IMG_5817.jpg', '/aepi_website/assets/eventImages/IMG_5825.jpg', '/aepi_website/assets/eventImages/IMG_5828.PNG', 
    '/aepi_website/assets/eventImages/IMG_5875.JPG', '/aepi_website/assets/eventImages/IMG_5876.JPG', '/aepi_website/assets/eventImages/IMG_5883.JPG', '/aepi_website/assets/eventImages/IMG_5885.JPG']; 
*/
    files: string[] = [];
    
    blurb: string;

    isAdmin: boolean = false;


    constructor(private firebaseService: FirebaseService, private authService: AuthenticationService) { }

    ngOnInit(): void {

        this.firebaseService.getFolderContents(environment.brotherhoodDriveID).subscribe((data: any) => {
            data.files.forEach(element => {
                this.files.push("https://drive.google.com/thumbnail?id=" + element.id);
            });
        });
        

        this.firebaseService.getBrotherhood().then((snapshot: any)=>{
            let data = snapshot.val();

            this.blurb = data.blurb;

            Object.keys(data.events).map(id=>{
                if(data.events[id].imageLink != ""){
                    this.eventImages.push(data.events[id]); 
                } 
                this.events.push(data.events[id].event);
            });
        
        });

        this.authService.getCurrentAdminStatus().subscribe(data => {
            this.isAdmin = data;
        });

    }

    onBlur(element){
        this.blurb = element.textContent;
    }

    onSaveChanges(){
        this.firebaseService.setBrotherhoodBlurb(this.blurb);
    }

}

