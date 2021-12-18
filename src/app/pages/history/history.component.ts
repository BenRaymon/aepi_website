import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FirebaseService } from '../../services/firebase.service';

import { HistoryModalComponent } from '../../components/history-modal/history-modal.component';
import { AuthenticationService } from 'src/app/services/authentication.service';

import {environment} from "src/environments/environment"


@Component({
    selector: 'app-history',
    templateUrl: './history.component.html',
    styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

    historyData: {"period": boolean, "year":string, "title":string, "content":string}[] = [];

    isAdmin: boolean = false;
    files: string[] = [];

    constructor(private firebaseService: FirebaseService, private modalService: NgbModal, private authService: AuthenticationService) { }

    ngOnInit(): void {

        this.firebaseService.getDriveImages(environment.historyCompositesDriveID).subscribe((data: any) => {
            data.files.sort(this.compare);

            data.files.forEach(element => {
                console.log(element.name);
                this.files.push("https://drive.google.com/uc?export=view&id=" + element.id);
            });
        });
        

        this.firebaseService.getHistory().then((snapshot: any)=>{
            let data = snapshot.val();

            Object.keys(data).map(id=>{
                this.historyData.push(data[id]);    
            });

            //check user but has to be in this async because it doesn't work right away
            //this check is for navigating back to this page while being signed in
            if(this.authService.getUser()){
                this.authService.getUserDbEntry().then(ss=>{ 
                    if(ss.val() != null){
                        this.isAdmin = ss.val().admin;
                        console.log(this.isAdmin);
                    }
                });
            }
        });

        //this check is to update the admin status whenever the user signs in or signs out
        this.authService.getCurrentAdminStatus().subscribe(data => {
            this.isAdmin = data;
        });
        
    }

    //Sort from oldest year to newest year
    compare(a, b) {
        if(parseInt(a.name.substring(9,13)) > parseInt(b.name.substring(9,13))){
            return 1;
        } else return -1;

    }

    newEvent(){
        const modalRef = this.modalService.open(HistoryModalComponent);
        modalRef.componentInstance.lastYear = parseInt(this.historyData[this.historyData.length - 1].year);
    }

}
