package be.heh.teamsimond.vetapp.JPA;

import org.hibernate.annotations.GenericGenerator;
import javax.persistence.*;

@Entity
@Table(name="doctors")
public class Doctor extends VetappElement{
    @Id
    @GeneratedValue(generator="increment")
    @GenericGenerator(name="increment", strategy = "increment")
    private int id;

    private String name;

    @Column(name="default_room_id")
    private int roomId;

    private String monday;
    private String tuesday;
    private String wednesday;
    private String thirsday;
    private String friday;
    private String saturday;
    private String sunday;

    public Doctor(){}

    public Doctor(int id, String name, int roomId, String monday, String tuesday, String wednesday, String thirsday, String friday, String saturday, String sunday){
        this.id = id;
        this.name = name;
        this.roomId = roomId;
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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getRoomId(){
        return roomId;
    }

    public void setRoomId(int roomId){
        this.roomId = roomId;
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
