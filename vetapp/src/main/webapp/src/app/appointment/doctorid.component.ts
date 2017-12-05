import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'doctorId' })
export class DoctorIdPipe implements PipeTransform {
   transform(items: Array<any>, id: string): Array<any> {
       return items.filter(item => item.doctorId == id);
   }
}