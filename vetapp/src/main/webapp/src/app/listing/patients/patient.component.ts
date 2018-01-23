import {Type} from "../../models/type";
import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {Form, FormControl, Validators} from "@angular/forms";
import {Breed} from "../../models/breed";
import {Patient} from "../../models/patient";
import {Customer} from "../../models/customer";
import {RequestService} from "../../service/request.service";
import {isNullOrUndefined} from "util";

@Component({
    selector: 'pm-patient',
    templateUrl: './patient.component.html',
    styleUrls: ['./../../bootstrap/reset.css', './patient.component.css']
})
export class PatientComponent implements OnInit {
    //Customer
    @Input() currentCustomer: Customer;

    //Patient
    newPatient: boolean = false;
    @Input() currentPatient: Patient;
    animalTypes: Type[];
    breeds: Breed[];

    //Modified Patient
    @Output() onCreate = new EventEmitter<Patient>();
    @Output() onModify = new EventEmitter<Patient>();
    @Output() onDelete = new EventEmitter<Patient>();

    constructor(private _requestService: RequestService) {}

    isPatientType(type: number): boolean{
        let answer: boolean = false;
        if(!isNullOrUndefined(this.currentPatient)){
            if(this.currentPatient.type == type){
                answer = true;
            }
        }
        return answer;
    }

    isPatientBreed(breed: number): boolean{
        let answer: boolean = false;
        if(!isNullOrUndefined(this.currentPatient)){
            if(this.currentPatient.breed == breed){
                answer = true;
            }
        }
        return answer;
    }

    sortBreeds(event: Event): void{
        this._requestService.findBreedsByType(Number((event.target as HTMLSelectElement).value)).subscribe((breeds: Breed[]) => {
            this.breeds = breeds.sort(function(a,b) {
                return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);
            })
        });
    }

    ngOnInit() : void {
        if(isNullOrUndefined(this.currentPatient)){
            this.newPatient = true;
        }

        this._requestService.getTypes().subscribe((types: Type[]) => {
            this.animalTypes = types.sort(function(a,b) {
                return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);
            });

            if(this.newPatient){
                this._requestService.findBreedsByType(this.animalTypes[0].id).subscribe((breeds: Breed[]) => {
                    this.breeds = breeds.sort(function(a,b) {
                        return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);
                    })
                });
            }else{
                this.animalTypes.forEach((type: Type) => {
                    if(this.isPatientType(type.id)){
                        this._requestService.findBreedsByType(type.id).subscribe((breeds: Breed[]) => {
                            this.breeds = breeds.sort(function(a,b) {
                                return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);
                            })
                        });
                    }
                });
            }
        });
    }

    submitPatient(submitCase: string) : void{
        let originForm, patientName, patientType, patientBreed;
        switch(submitCase){
            case 'new' :
                originForm = document.forms.namedItem("patient").elements;
                patientName = (originForm.namedItem("name") as HTMLInputElement).value;
                patientType = (originForm.namedItem("type") as HTMLSelectElement).value;
                patientBreed = (originForm.namedItem("breed") as HTMLSelectElement).value;

                if(patientName.trim()) {
                    let patToAdd = new FormData();
                    patToAdd.append("customerId", String(this.currentCustomer.id));
                    patToAdd.append("name", patientName.trim());
                    patToAdd.append("type", patientType.trim());
                    patToAdd.append("breed", patientBreed.trim());

                    this._requestService.addPatient(patToAdd).subscribe((patient: Patient) => {
                        (originForm.namedItem("name") as HTMLInputElement).value = "";
                        (originForm.namedItem("type") as HTMLSelectElement).value = this.animalTypes[0].name;
                        (originForm.namedItem("breed") as HTMLSelectElement).value = this.breeds[0].name;
                        this.onCreate.emit(patient);
                    });
                }
                break;
            case 'modify' :
                originForm = document.forms.namedItem("patient_"+this.currentPatient.id).elements;
                patientName = (originForm.namedItem("name") as HTMLInputElement).value;
                patientType = (originForm.namedItem("type") as HTMLSelectElement).value;
                patientBreed = (originForm.namedItem("breed") as HTMLSelectElement).value;

                if(patientName.trim()) {
                    let patToChange = new FormData();
                    patToChange.append("name", patientName.trim());
                    patToChange.append("type", patientType.trim());
                    patToChange.append("breed", patientBreed.trim());

                    this._requestService.modifyPatient(this.currentPatient.id, patToChange).subscribe((patient: Patient) => {
                        this.onModify.emit(patient);
                    });
                }
                break;
            case 'remove' :
                this._requestService.removePatient(this.currentPatient.id).subscribe((patient: Patient) => {
                    this.onDelete.emit(patient);
                });
                break;
        }
    }
}