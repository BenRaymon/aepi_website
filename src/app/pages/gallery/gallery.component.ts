import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GalleryModalComponent } from 'src/app/components/gallery-modal/gallery-modal.component';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
	selector: 'app-gallery',
	templateUrl: './gallery.component.html',
	styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {

	files: string[] = [];
	year: string = '';
	loading: boolean = true;

	constructor(private firebaseService: FirebaseService, private route: ActivatedRoute, private modalService: NgbModal) { }

	ngOnInit(): void {

		this.route.paramMap.subscribe((params : ParamMap)=> {
			let yearParam = params.get('year');
			if (yearParam){
				this.year = yearParam;
				this.getImages();
			}
		});  

	}

	getImages(){
		let context = this;
		this.firebaseService.getHistorianGallery(this.year).subscribe((data: any) => {
			if (data){
				data.files.forEach(element => {
					this.files.push("https://drive.google.com/thumbnail?id=" + element.id);
				});

				this.loading = false;
				// setTimeout(function(){
				// 	context.loading = false;					
				// }, 750);
			}
        });
	}

	openGalleryModal(activeImage: string){
		const modalRef = this.modalService.open(GalleryModalComponent, {size: 'xl'});
		modalRef.componentInstance.images = this.files;
		modalRef.componentInstance.activeImage = activeImage;
	}

}
