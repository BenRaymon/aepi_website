import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GoogleSheetsDbService } from 'ng-google-sheets-db';
import { BrotherModalComponent } from '../../components/brother-modal/brother-modal.component';
import { attributesMapping, Brother } from './brother.model';
import {environment} from "src/environments/environment"

@Component({
  selector: 'app-composite',
  templateUrl: './composite.component.html',
  styleUrls: ['./composite.component.css']
})
export class CompositeComponent implements OnInit {

  events: string[] = [];
    eventImages: {event: string, description: string, imageLink: string}[] = [];

    blurb: string;
    loading: boolean = true;

    brothers: any[] = [];
    count: number; rows: number;


    constructor(private modalService: NgbModal, private googleSheetsDbService: GoogleSheetsDbService) { }

    ngOnInit(): void {

        this.googleSheetsDbService.get(environment.rosterDriveID, "All Active Brothers", attributesMapping).subscribe(data =>{
            data.sort(this.compare)

            for(let brother of data){
                if(!(<Brother>brother).image)
                    (<Brother>brother).image = "https://drive.google.com/thumbnail?id=1D-TTGqtB1zXYWxePaHU_mwdN5m29Puis";
                else
                    (<Brother>brother).image = "https://drive.google.com/thumbnail?id=" + (<Brother>brother).image;

                if((<Brother>brother).board)
                    this.brothers.unshift(brother);
                else
                    this.brothers.push(brother);
            }
            this.loading = false;
            this.count = this.brothers.length;
            this.rows = Math.floor((this.count-16)/10);
        });
    }

    compare(a, b) {
        if(a.board && b.board){
            if(a.lastname > b.lastname)
                return -1;
            else
                return 1;
        } else if (a.board){
            return -1;
        } else if (b.board){
            return 1;
        } else {
            return a.lastname > b.lastname ? 1 : -1;
        }
    }

    counter(i: number, buffer: number) {
        return new Array(i).fill(0).map((x,y)=>y+buffer);
    }

    getYear(){
        let d = new Date();
        return d.getMonth() >= 8 ? d.getFullYear() : d.getFullYear() - 1;
    }


    open(number: number) {
        const modalRef = this.modalService.open(BrotherModalComponent);
        modalRef.componentInstance.brother_name = this.brothers[number].firstname + " " + this.brothers[number].lastname;
        modalRef.componentInstance.major = this.brothers[number].major;
        modalRef.componentInstance.year = this.brothers[number].year;
        modalRef.componentInstance.board = this.brothers[number].board;
        modalRef.componentInstance.image = this.brothers[number].image;
      }

}
