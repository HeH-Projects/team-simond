export interface Doctor {
    id: number;
    name: string;
    roomId: number;
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;

    timeSlots: { monday : any[], tuesday : any[], wednesday : any[], thursday : any[], friday : any[], saturday: any[], sunday : any[] };
}