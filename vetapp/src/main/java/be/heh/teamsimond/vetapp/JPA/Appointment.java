package be.heh.teamsimond.vetapp.JPA;

import be.heh.teamsimond.vetapp.IVetappElement;
import javax.persistence.*;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlTransient;
import java.io.Serializable;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
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

    @XmlTransient
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
    @XmlElement
    public int getPatientId() {
        return this.id.getPatientId();
    }
    @XmlElement
    public int getDoctorId() {
        return this.id.getDoctorId();
    }
    @XmlElement
    public Date getDate() {
        return this.id.getDate();
    }

    public static IVetappElement generate(Map<String, String[]> parameters) {
        try {
            Appointment e = new Appointment();
            e.setId(new AppointmentId(
                    Integer.parseInt(parameters.get("patientId")[0]),
                    Integer.parseInt(parameters.get("doctorId")[0]),
                    (new SimpleDateFormat("yyyy-MM-dd'T'HH:mm")).parse(parameters.get("date")[0])));
            List<String> l = e.update(parameters);
            if (l.contains("roomId")
                    && l.contains("type")) {
                return e;
            }
        } catch (Exception e) {System.out.println(e);}
        return null;
    }
    public List<String> update(Map<String, String[]> parameters) {
        List<String> l = new ArrayList<>();
        try {
            if (parameters.get("roomId") != null) {
                this.setRoomId(Integer.parseInt(parameters.get("roomId")[0]));
                l.add("roomId");
            }
            if (parameters.get("type") != null) {
                this.setType(Integer.parseInt(parameters.get("type")[0]));
                l.add("type");
            }
        } catch(Exception e) {}
        return l;
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
