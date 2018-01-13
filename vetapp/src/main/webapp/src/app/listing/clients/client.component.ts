import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, AbstractControl } from '@angular/forms';
import { RequestService } from '../../service/request.service';
import {Observable} from "rxjs/Observable";
import {Customer} from "../../models/customer";
import {isNullOrUndefined} from "util";
import {Patient} from "../../models/patient";

@Component({
  selector: 'pm-client',
  templateUrl: './client.component.html',
  styleUrls: ['./../../bootstrap/reset.css', './client.component.css']
})
export class ClientComponent implements OnInit {

  //Customer
  newCustomer : boolean = true;
  searchField: FormControl;
  customerSearchMessage: string;
  customers: Customer[];
  customersSearchList: Observable<Customer[]>;
  currentCustomer: Customer;

  //Patient
  currentPatients: Patient[];
  animalTypes : any = [{ name : "chien", id : 1}, {name : "chat", id : 2}];
  breeds : any = [{name : "bichon", id : 1}, {name : "siamois", id : 2}];

  private validationMessages = {
      required : "Veuillez entrer le nom d'un client.",
      pattern : "Veuillez entrer un nom de client correct."
  };

  constructor(private _requestService : RequestService){ }


  //Helping functions
  private setValidationMessage(c : AbstractControl){
      this.customerSearchMessage = '';
      if((c.touched || c.dirty) && c.errors){
          this.customerSearchMessage = Object.keys(c.errors).map(key => this.validationMessages[key]).join(' ');
      }
  }

  private searchCustomers(term: string): Observable<Customer[]> {
      let customersList: Customer[] = new Array();

      if (!term.trim()) {
          return Observable.of(customersList);
      }

      this.newCustomer = true;

      this.customers.forEach(customer => {
          if(customer.name.indexOf(term) != -1){
              customersList.push(customer);
          }

          if(customer.name == term){
              this.newCustomer = false;
              this.currentCustomer = this.getCustomerByName(term);
              this._requestService.findPatientsByCustomerId(this.currentCustomer.id).subscribe((patients: Patient[]) =>{
                 this.currentPatients = patients;
              });
          }
      });

      if(this.newCustomer){
          this.currentCustomer = null;
          this.currentPatients = null;
      }

      return Observable.of(customersList);
  }

  private getCustomerById(id: number): Customer{
      let answer: Customer = null;
      this.customers.forEach(customer => {
          if(customer.id == id){
              answer = customer;
          }
      });
      return answer;
  }

  private getCustomerByName(name: string): Customer{
      let answer: Customer = null;
      for(let i = 0; i < this.customers.length; i++){
          if(this.customers[i].name == name){
              answer = this.customers[i];
              break;
          }
      }
      return answer;
  }

  updateSearchField(id: number): void{
      this.currentCustomer = this.getCustomerById(id);
      this._requestService.findPatientsByCustomerId(this.currentCustomer.id).subscribe((patients: Patient[]) =>{
          this.currentPatients = patients;
      });
      this.searchField.setValue(this.currentCustomer.name);
  }

  isPatientType(id: number, type: number): boolean{
      let answer: boolean = false;
      this.currentPatients.forEach(patient =>{
          if(patient.id == id){
              if(patient.type == type){
                  answer = true;
              }
          }
      });
      return answer;
  }

  isPatientBreed(id: number, breed: number): boolean{
      let answer: boolean = false;
      this.currentPatients.forEach(patient =>{
          if(patient.id == id){
              if(patient.breed == breed){
                  answer = true;
              }
          }
      });
      return answer;
  }


  //Initialisation du composant
  ngOnInit() : void {
     this._requestService.getCustomers().subscribe(customers => this.customers = customers);

     this.searchField = new FormControl("", [Validators.required, Validators.pattern(/^[A-Za-z]+([\s][A-Za-z]+){1,2}$/)]);
     this.searchField.valueChanges.distinctUntilChanged().subscribe( val => {
        this.customersSearchList = this.searchCustomers(val);

        this.setValidationMessage(this.searchField);
     });
  }

  //Fonctions CUD
  submitCustomer(submitCase) : void{
     if(this.searchField.value.trim()){
        if(isNullOrUndefined(this.currentCustomer)){
            this.currentCustomer = this.getCustomerByName(this.searchField.value);
            this._requestService.findPatientsByCustomerId(this.currentCustomer.id).subscribe((patients: Patient[]) =>{
                this.currentPatients = patients;
            });
        }
        switch(submitCase){
            case 'new' :
                let cusToAdd = new FormData();
                cusToAdd.append("name", this.searchField.value);

                this._requestService.addCustomer(cusToAdd).subscribe((customer: Customer) => {
                    this.customers.push(customer);
                    this.currentCustomer = customer;
                    this._requestService.findPatientsByCustomerId(this.currentCustomer.id).subscribe((patients: Patient[]) =>{
                        this.currentPatients = patients;
                    });
                    this.newCustomer = false;
                });
                break;
            case 'modify' :
                if(!isNullOrUndefined(this.currentCustomer)) {
                    let cusToChange = new FormData();
                    cusToChange.append("name", this.searchField.value);

                    this._requestService.modifyCustomer(this.currentCustomer.id, cusToChange).subscribe((customer: Customer) => {
                        this.customers.forEach((customerInList: Customer) => {
                            //Une méthode 'isEqualTo' dans le modèle 'Customer' aurait été plus appropriée mais je n'ai pas réussi
                            if (customerInList.id == customer.id && customerInList.name == customer.name) {
                                this.customers.splice(this.customers.indexOf(customerInList), 1, customer);
                                this.currentCustomer = customer;
                            }
                        });
                    });
                }
                break;
            case 'remove' :
                if(!isNullOrUndefined(this.currentCustomer)) {
                    this._requestService.removeCustomer(this.currentCustomer.id).subscribe((customer: Customer) => {
                        this.customers.forEach((customerInList: Customer) => {
                            //Une méthode 'isEqualTo' dans le modèle 'Customer' aurait été plus appropriée mais je n'ai pas réussi
                            if (customerInList.id == customer.id && customerInList.name == customer.name) {
                                this.customers.splice(this.customers.indexOf(customerInList), 1);
                                this.newCustomer = true;
                            }
                        });
                        this.currentPatients = null;
                    });
                }
                break;
        }
     }
  }

  submitPatient(submitCase: string, id: number) : void{
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
                    this.currentPatients.push(patient);
                });
            }
            break;
        case 'modify' :
            originForm = document.forms.namedItem("patient_"+id).elements;
            patientName = (originForm.namedItem("name") as HTMLInputElement).value;
            patientType = (originForm.namedItem("type") as HTMLSelectElement).value;
            patientBreed = (originForm.namedItem("breed") as HTMLSelectElement).value;

            if(patientName.trim()) {
                let patToChange = new FormData();
                patToChange.append("name", patientName.trim());
                patToChange.append("type", patientType.trim());
                patToChange.append("breed", patientBreed.trim());

                this._requestService.modifyPatient(id, patToChange).subscribe((patient: Patient) => {
                    this.currentPatients.forEach((patientInList: Patient) => {
                        //Une méthode 'isEqualTo' dans le modèle 'Patient' aurait été plus appropriée mais je n'ai pas réussi
                        if (patientInList.id == patient.id) {
                            this.currentPatients.splice(this.currentPatients.indexOf(patientInList), 1, patient);
                        }
                    });
                });
            }
            break;
        case 'remove' :
            this._requestService.removePatient(id).subscribe((patient: Patient) => {
                this.currentPatients.forEach((patientInList: Patient) => {
                    //Une méthode 'isEqualTo' dans le modèle 'Patient' aurait été plus appropriée mais je n'ai pas réussi
                    if (patientInList.id == patient.id) {
                        this.currentPatients.splice(this.currentPatients.indexOf(patientInList), 1);
                    }
                });
            });
            break;
     }
  }
}
