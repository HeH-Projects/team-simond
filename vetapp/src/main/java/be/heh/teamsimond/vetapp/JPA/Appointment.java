package be.heh.teamsimond.vetapp.JPA;

import be.heh.teamsimond.vetapp.IVetappElement;

import javax.persistence.*;
import javax.xml.bind.annotation.XmlRootElement;
import java.io.Serializable;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Map;

@Entity
@Table(name="appointments")
@XmlRootElement
public class Appointment implements IVetappElement {
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

    public static IVetappElement generate(Map<String, String[]> parameters) {
        try {
            Appointment e = new Appointment();
            e.setId(new AppointmentId(
                    Integer.parseInt(parameters.get("patient_id")[0]),
                    Integer.parseInt(parameters.get("doctor_id")[0]),
                    (new SimpleDateFormat("yyyy-MM-dd_hh:mm")).parse(parameters.get("date")[0])));
            e.setRoomId(Integer.parseInt(parameters.get("room_id")[0]));
            e.setType(Integer.parseInt(parameters.get("type")[0]));
            return e;
        } catch (Exception e) {}
        return null;
    }
    public void update(Map<String, String[]> parameters) {
    }
}

@Embeddable
class AppointmentId implements Serializable {
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
