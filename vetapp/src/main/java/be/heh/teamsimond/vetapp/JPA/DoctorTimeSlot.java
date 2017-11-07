package be.heh.teamsimond.vetapp.JPA;

import org.hibernate.annotations.GenericGenerator;
import javax.persistence.*;

@Entity
@Table(name="doctor_time_slots")
public class DoctorTimeSlot extends VetappElement{
    @Id
    @GeneratedValue(generator="increment")
    @GenericGenerator(name="increment", strategy = "increment")
    @Column(name="doctor_id")
    private int id;

    private String monday;
    private String tuesday;
    private String wednesday;
    private String thirsday;
    private String friday;
    private String saturday;
    private String sunday;

    public DoctorTimeSlot(){}

    public DoctorTimeSlot(int id, String monday, String tuesday, String wednesday, String thirsday, String friday, String saturday, String sunday){
        this.id = id;
        this.monday = monday;
        this.tuesday = tuesday;
        this.wednesday = wednesday;
        this.thirsday = thirsday;
        this.friday = friday;
        this.saturday = saturday;
        this.sunday = sunday;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getMonday() {
        return monday;
    }

    public void setMonday(String monday) {
        this.monday = monday;
    }

    public String getTuesday() {
        return tuesday;
    }

    public void setTuesday(String tuesday) {
        this.tuesday = tuesday;
    }

    public String getWednesday() {
        return wednesday;
    }

    public void setWednesday(String wednesday) {
        this.wednesday = wednesday;
    }

    public String getThirsday() {
        return thirsday;
    }

    public void setThirsday(String thirsday) {
        this.thirsday = thirsday;
    }

    public String getFriday() {
        return friday;
    }

    public void setFriday(String friday) {
        this.friday = friday;
    }

    public String getSaturday() {
        return saturday;
    }

    public void setSaturday(String saturday) {
        this.saturday = saturday;
    }

    public String getSunday() {
        return sunday;
    }

    public void setSunday(String sunday) {
        this.sunday = sunday;
    }
}
