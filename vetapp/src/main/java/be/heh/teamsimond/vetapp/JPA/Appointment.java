package be.heh.teamsimond.vetapp.JPA;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name="appointments")
public class Appointment extends VetappElement {
    @EmbeddedId
    private AppointmentId id;

    @Column(name="room_id")
    private int roomId;

    private int type;

    public Appointment(){}

    public Appointment(AppointmentId id, int roomId, int type){
        this.id = id;
        this.roomId = roomId;
        this.type = type;
    }

    public AppointmentId getId() {
        return id;
    }

    public void setId(AppointmentId id) {
        this.id = id;
    }

    public int getRoomId() {
        return roomId;
    }

    public void setRoomId(int roomId) {
        this.roomId = roomId;
    }

    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }
}

@Embeddable
class AppointmentId{
    @Column(name="patient_id")
    private int patientId;

    @Column(name="doctor_id")
    private int doctorId;

    @Temporal(TemporalType.TIMESTAMP)
    private Date date;

    public AppointmentId(){}

    public  AppointmentId(int patientId, int doctorId, Date date){
        this.patientId = patientId;
        this.doctorId = doctorId;
        this.date = date;
    }

    public int getPatientId() {
        return patientId;
    }

    public void setPatientId(int patientId) {
        this.patientId = patientId;
    }

    public int getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(int doctorId) {
        this.doctorId = doctorId;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }
}