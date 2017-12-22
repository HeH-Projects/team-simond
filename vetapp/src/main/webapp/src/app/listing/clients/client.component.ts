import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { TokenService } from '../../service/token.service';
import { RequestService } from '../../service/request.service';
import { Router, ActivatedRoute } from '@angular/router/';

@Component({
  selector: 'pm-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {
  customers : any = null;
  customer : any = null;
  customerId : number = 0;
  patients : any = null;
  updatePatients : boolean = true;
  searchCustomerForm : FormGroup;
  updateCustomerForm : FormGroup;
  updatePatientForm : FormGroup;

  customerSearchMessage: string;
  customerUpdateMessage: string;
  patientNameMessage: string;
  patientTypeMessage: string;
  patientBreedMessage: string;

  private validationMessages = {
    required : 'Enter the name of a room.',
    pattern : 'Enter a valid room name.'
  }

  animalTypes : any = [{ name : "chien", id : 1}, {name : "chat", id : 2}];
  breeds : any = [{name : "bichon", id : 1}, {name : "siamois", id : 2}];

  constructor(private _tokenService : TokenService, private _requestService : RequestService, private fb : FormBuilder, private _router: Router, private _route : ActivatedRoute) { 
    this._requestService.context = this;
  }

  ngOnInit() {
    this.searchCustomerForm = this.fb.group({
      customerSearchName : ["", Validators.required]
    })
    this.updateCustomerForm = this.fb.group({
      customerUpdateName : [this.searchCustomerForm.get('customerSearchName').value, Validators.required]
    })
    this.updatePatientForm = this.fb.group({
      patientName : ["", Validators.required],
      patientType : ["", Validators.required],
      patientBreed: ["", Validators.required]
    })
    this.onChanges();
    /*this._route.queryParams.subscribe(params => {
      this.customerId = params.customer_id;
    })*/
  }

  onChanges(){
    this.searchCustomerForm.get('customerSearchName').valueChanges.subscribe(val =>{
      this.onCustomerChange();
    })
    this.setValidationMessage(this.searchCustomerForm.get('customerSearchName'));
    this.setValidationMessage(this.updateCustomerForm.get('customerUpdateName'));
    this.setValidationMessage(this.updatePatientForm.get('patientName'));
  }

  onCustomerChange() {
    console.log('customer change');
    var f = this.searchCustomerForm,
        tmp = f.get('customerSearchName').value.split("#");
    if (tmp.length == 2 && this.patients.length == 0) {
        this._requestService.findPatientsByCustomerId(parseInt(tmp[1]));
        this.customers.forEach(element => {
          if(element.id == tmp[1]){
            this.customer = element;
          }
        });
    } else {
        if(f.get('customerSearchName').value.length >= 1){
            this._requestService.findCustomersByIncompleteName(f.get('customerSearchName').value);
        }
        this.patients = [];
    }
  }

  setCustomers(customers){
    this.customers = customers;
    if(this.customerId == 0){
      this._requestService.findPatientsByCustomerId(this.customerId);
      this.customers.forEach(element => {
        if(element.id == this.customerId){
          this.customer = element;
        }
      });
    }
  }

  setPatients(patients){
    this.patients = patients;
    this.updatePatients = true;
  }

  selectOptionByValue(sObj, value) {
    if(value !=0){
      for (let i = 0; i < sObj.options.length; i++) {
          if (sObj.options[i].value == value) {
              sObj.options.selectedIndex = i;
              break;
          }
      }
    }
  }

  setValidationMessage(c : AbstractControl){
    this.customerSearchMessage = '';
    if((c.touched || c.dirty) && c.errors){
      this.customerSearchMessage = Object.keys(c.errors).map(key => this.validationMessages[key]).join(' ');
    }
  }

  ngAfterViewChecked(){
    if(this.patients !=null){
      this.patients.forEach(element =>{
        let article = document.getElementById('patient_'+element.id);
        let selects = article.getElementsByTagName('select');
        if(this.updatePatients){
          this.selectOptionByValue(selects[0], element.type)
          this.selectOptionByValue(selects[1], element.breed)
        }
      })
      this.updatePatients = false;
    }
  }

  loadData(){
    if(this.patients !=null){
      this.patients.forEach(element =>{
        let article = document.getElementById('patient_'+element.id);
        let selects = article.getElementsByTagName('select');
        this.selectOptionByValue(selects[0], element.type)
        this.selectOptionByValue(selects[1], element.breed)
      })
    }
  }

  resetCustomer(){
    this.updateCustomerForm.get('customerUpdateName').setValue(this.customer.name);
  }

  submitCustomer(submitCase: string){
    if(this.updateCustomerForm.get("customerUpdateName").value != null){
      switch(submitCase){
        case 'new' :
            let dataToAdd = new FormData();
            dataToAdd.append('name', this.searchCustomerForm.get('customerSearchName').value);
            this._requestService.addCustomer(dataToAdd);
          break;
        case 'modify' :
            let data = new FormData();
            data.append('name', this.updateCustomerForm.get('customerUpdateName').value);
            this._requestService.modifyCustomer(this.customer.id, data);
          break;
        case 'remove' :
            this._requestService.removeCustomer(this.customer.id);
          break;
      }
    }
  }

  submitPatient(id: number, submitCase: string){
    if(this.updatePatientForm.get('patientName').value != null){
      switch(submitCase){
        case 'modify' :
            let data = new FormData();
            data.append('name', this.updatePatientForm.get('patientName').value);
            data.append('type', this.updatePatientForm.get('patientType').value);
            data.append('breed', this.updatePatientForm.get('patientBreed').value);
            if(id==0){
              data.append('customer_id', this.customer.id);
              this._requestService.addPatient(data);
            }else{
              this._requestService.modifyPatient(id, data);
            }
          break;
        case 'remove' : 
            this._requestService.removePatient(id);
          break;
      }
    }
  }

  addPatient(){
    this.patients.push({
      id: 0,
      customer_id : this.customer.id,
      name: '',
      type : 0,
      breed : 0,
      hasPic: false
    })
  }

  refresh(){
    if(this.customer != null){
      this.customerId = this.customer.id;
    }
    this.customerChange();
    this._requestService.findCustomersByIncompleteName(this.customer.name[0]);
  }

  customerChange(){
    this.customer = null;
    this.searchCustomerForm.get('customerSearchName').setValue("");
  }
}
