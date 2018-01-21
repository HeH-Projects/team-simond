import {Component, OnInit} from '@angular/core';
import { FormControl, Validators, AbstractControl } from '@angular/forms';
import { RequestService } from '../../service/request.service';
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/retry';
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
  choosingCustomerById: boolean = false;
  address: FormControl;
  postalCode: FormControl;
  town: FormControl;
  phone: FormControl;

  //Patient
  currentPatients: Patient[];

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
          if(customer.name.toLowerCase().indexOf(term.toLowerCase()) != -1){
              customersList.push(customer);
          }

          if(!this.choosingCustomerById){
              if(customer.name == term){
                  this.newCustomer = false;
                  this.currentCustomer = this.getCustomerByName(term);
                  this._requestService.findPatientsByCustomerId(this.currentCustomer.id).subscribe((patients: Patient[]) =>{
                      this.currentPatients = patients.sort(function(a,b) {return (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0);});
                  });
              }
          }
      });

      if(!isNullOrUndefined(this.currentCustomer)){
          this.address.setValue(this.currentCustomer.address);
          this.postalCode.setValue(this.currentCustomer.postalCode);
          this.town.setValue(this.currentCustomer.town);
          this.phone.setValue(this.currentCustomer.phone);
      }

      if(this.choosingCustomerById){
          this.newCustomer = false;
          this.choosingCustomerById = false;
      }

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
              customer.phone = customer.phone.replace(/"/g, '');
              answer = customer;
          }
      });
      return answer;
  }

  private getCustomerByName(name: string): Customer{
      let answer: Customer = null;
      for(let i = 0; i < this.customers.length; i++){
          if(this.customers[i].name == name){
              this.customers[i].phone = this.customers[i].phone.replace(/"/g, '');
              answer = this.customers[i];
              break;
          }
      }
      return answer;
  }

  updateSearchField(id: number): void{
      this.currentCustomer = this.getCustomerById(id);

      this._requestService.findPatientsByCustomerId(this.currentCustomer.id).subscribe((patients: Patient[]) =>{
          this.currentPatients = patients.sort(function(a,b) {return (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0);});
      });

      this.choosingCustomerById = true;
      this.searchField.setValue(this.currentCustomer.name);
  }

  //Initialisation du composant
  ngOnInit() : void {
     this._requestService.getCustomers().subscribe(customers => this.customers = customers.sort(function(a,b) {return (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0);}));

     this.searchField = new FormControl("", [Validators.required, Validators.pattern(/^[A-Za-z]+([\s][A-Za-z]+){1,2}$/)]);
     this.searchField.valueChanges.distinctUntilChanged().subscribe( val => {
        this.customersSearchList = this.searchCustomers(val);

        this.setValidationMessage(this.searchField);
     });

      this.address = new FormControl("", [Validators.required, Validators.pattern(/^[A-Za-z\-]+[,][\s]?[0-9]+$/)]);
      this.postalCode = new FormControl("", [Validators.required, Validators.pattern(/^[0-9]{4}$/)]);
      this.town = new FormControl("", [Validators.required, Validators.pattern(/^[A-Za-z\-]{3, 50}$/)]);
      this.phone = new FormControl("", [Validators.required, Validators.pattern(/^[0-9]{9,10}$/)]);
  }

  //Fonctions CUD
  submitCustomer(submitCase) : void{
     if(this.searchField.value.trim()){
        if(isNullOrUndefined(this.currentCustomer) && !this.newCustomer){
            this.currentCustomer = this.getCustomerByName(this.searchField.value);
            this._requestService.findPatientsByCustomerId(this.currentCustomer.id).subscribe((patients: Patient[]) =>{
                this.currentPatients = patients;
            });
        }

        let cusToSend = new FormData();
        cusToSend.append("name", this.searchField.value);
        cusToSend.append("address", this.address.value);
        cusToSend.append("postalCode", this.postalCode.value);
        cusToSend.append("town", this.town.value);
        cusToSend.append("phone", this.phone.value);

        switch(submitCase){
            case 'new' :
                this._requestService.addCustomer(cusToSend).subscribe((customer: Customer) => {
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
                    this._requestService.modifyCustomer(this.currentCustomer.id, cusToSend).subscribe((customer: Customer) => {
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

  newPatient(patient: Patient) : void {
      this.currentPatients.push(patient);
  }

  modifyPatient(patient: Patient) : void {
      this.currentPatients.forEach((patientInList: Patient) => {
          //Une méthode 'isEqualTo' dans le modèle 'Patient' aurait été plus appropriée mais je n'ai pas réussi
          if (patientInList.id == patient.id) {
              this.currentPatients.splice(this.currentPatients.indexOf(patientInList), 1, patient);
          }
      });
  }

  removePatient(patient: Patient) : void {
      this.currentPatients.forEach((patientInList: Patient) => {
          //Une méthode 'isEqualTo' dans le modèle 'Patient' aurait été plus appropriée mais je n'ai pas réussi
          if (patientInList.id == patient.id) {
              this.currentPatients.splice(this.currentPatients.indexOf(patientInList), 1);
          }
      });
  }
}
