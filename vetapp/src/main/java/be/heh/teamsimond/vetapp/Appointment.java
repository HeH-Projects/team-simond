package be.heh.teamsimond.vetapp;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name="appointments")
public class Appointment {
    @EmbeddedId
    private AppointmentId id;

    @Column(name="room_id")
    private int roomId;

    private int type;

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
}
