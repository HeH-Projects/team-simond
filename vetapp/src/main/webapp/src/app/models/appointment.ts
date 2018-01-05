import {AppointmentId} from "./appointmentId";

export interface Appointment {
    id: AppointmentId;
    roomId: number;
    type: number;
}