import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FirebaseService } from '../../services/firebase.service';

import { HistoryModalComponent } from '../../components/history-modal/history-modal.component';
import { AuthenticationService } from 'src/app/services/authentication.service';

import {environment} from "src/environments/environment"
import { Router } from '@angular/router';


@Component({
    selector: 'app-history',
    templateUrl: './history.component.html',
    styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

    historyData: {"period": boolean, "year":string, "title":string, "content":string}[] = [];

    isAdmin: boolean = false;
    files: {image:string, year:string}[] = [];

    constructor(private firebaseService: FirebaseService, private modalService: NgbModal,
        private authService: AuthenticationService, private router: Router) { }

    ngOnInit(): void {

        this.firebaseService.getFolderContents(environment.historyCompositesDriveID).subscribe((data: any) => {
            data.files.sort(this.compare);

            data.files.forEach(element => {
                console.log(element.name);
                this.files.push({image: "https://drive.google.com/thumbnail?id=" + element.id, year: element.name.substring(9,13)});
            });
        });
        

        this.firebaseService.getHistory().then((snapshot: any)=>{
            let data = snapshot.val();

            Object.keys(data).map(id=>{
                this.historyData.push(data[id]);    
            });
        });

        this.authService.getCurrentAdminStatus().subscribe(data => {
            this.isAdmin = data;
        });
        
    }

    openHistorianGallery(composite: {image: string, year: string} ){
        this.router.navigate([`/gallery/${composite.year}`]);
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
