package be.heh.teamsimond.vetapp.JPA;

import be.heh.teamsimond.vetapp.IVetappElement;
import org.hibernate.annotations.GenericGenerator;
import javax.persistence.*;
import javax.xml.bind.DatatypeConverter;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.adapters.XmlAdapter;
import javax.xml.bind.annotation.adapters.XmlJavaTypeAdapter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

@Entity
@Table(name="doctors")
@XmlRootElement
public class Doctor implements IVetappElement {
    @Id
    @GeneratedValue(generator="increment")
    @GenericGenerator(name="increment", strategy = "increment")
    private int id;
    private String name;
    @Column(name="default_room_id")
    private int roomId;
    private byte[] monday;
    private byte[] tuesday;
    private byte[] wednesday;
    private byte[] thursday;
    private byte[] friday;
    private byte[] saturday;
    private byte[] sunday;
    @Transient
    private DoctorTimeSlots timeSlots;

    public DoctorTimeSlots getTimeSlots() {
        this.setTimeSlots(new DoctorTimeSlots(this.getMonday(), this.getTuesday(), this.getWednesday(), this.getThursday(), this.getFriday(), this.getSaturday(), this.getSunday()));
        return timeSlots;
    }
    public void setTimeSlots(DoctorTimeSlots timeSlots) {
        this.timeSlots = timeSlots;
    }
    public int getId() { return id;}
    public void setId(int id) { this.id = id; }
    public String getName() { return name; }
    public Boolean setName(String name) {
        if (name.length() > 0) {
            this.name = name;
            return true;
        }
        return false;
    }
    public int getRoomId() { return roomId; }
    public void setRoomId(int roomId) { this.roomId = roomId; }
    @XmlJavaTypeAdapter(DoctorByteAdapter.class)
    public byte[] getMonday() { return monday; }
    public void setMonday(byte[] monday) { this.monday = monday; }
    @XmlJavaTypeAdapter(DoctorByteAdapter.class)
    public byte[] getTuesday() { return tuesday; }
    public void setTuesday(byte[] tuesday) { this.tuesday = tuesday; }
    @XmlJavaTypeAdapter(DoctorByteAdapter.class)
    public byte[] getWednesday() { return wednesday; }
    public void setWednesday(byte[] wednesday) { this.wednesday = wednesday; }
    @XmlJavaTypeAdapter(DoctorByteAdapter.class)
    public byte[] getThursday() { return thursday; }
    public void setThursday(byte[] thursday) { this.thursday = thursday; }
    @XmlJavaTypeAdapter(DoctorByteAdapter.class)
    public byte[] getFriday() { return friday; }
    public void setFriday(byte[] friday) { this.friday = friday; }
    @XmlJavaTypeAdapter(DoctorByteAdapter.class)
    public byte[] getSaturday() { return saturday; }
    public void setSaturday(byte[] saturday) { this.saturday = saturday; }
    @XmlJavaTypeAdapter(DoctorByteAdapter.class)
    public byte[] getSunday() { return sunday; }
    public void setSunday(byte[] sunday) { this.sunday = sunday; }


    public static IVetappElement generate(Map<String, String[]> parameters) {
        Doctor e = new Doctor();
        List<String> l = e.update(parameters);
        if (l.contains("name")
                && l.contains("roomId")
                && l.contains("monday")
                && l.contains("tuesday")
                && l.contains("wednesday")
                && l.contains("thursday")
                && l.contains("friday")
                && l.contains("saturday")
                && l.contains("sunday")) {
            return e;
        }
        return null;
    }
    public List<String> update(Map<String, String[]> parameters) {
        List<String> l = new ArrayList<>();
        try {
            if (parameters.get("name") != null) {
                if (this.setName(parameters.get("name")[0])) {
                    l.add("name");
                }
            }
            if (parameters.get("roomId") != null) {
                this.setRoomId(Integer.parseInt(parameters.get("roomId")[0]));
                l.add("roomId");
            }
            Pattern p = Pattern.compile("^[0-9A-F]{6}$");
            if (parameters.get("monday") != null
                    && p.matcher(parameters.get("monday")[0]).matches()) {
                this.setMonday(DatatypeConverter.parseHexBinary(parameters.get("monday")[0]));
                l.add("monday");
            }
            if (parameters.get("tuesday") != null
                    && p.matcher(parameters.get("tuesday")[0]).matches()) {
                this.setTuesday(DatatypeConverter.parseHexBinary(parameters.get("tuesday")[0]));
                l.add("tuesday");
            }
            if (parameters.get("wednesday") != null
                    && p.matcher(parameters.get("wednesday")[0]).matches()) {
                this.setWednesday(DatatypeConverter.parseHexBinary(parameters.get("wednesday")[0]));
                l.add("wednesday");
            }
            if (parameters.get("thursday") != null
                    && p.matcher(parameters.get("thursday")[0]).matches()) {
                this.setThursday(DatatypeConverter.parseHexBinary(parameters.get("thursday")[0]));
                l.add("thursday");
            }
            if (parameters.get("friday") != null
                    && p.matcher(parameters.get("friday")[0]).matches()) {
                this.setFriday(DatatypeConverter.parseHexBinary(parameters.get("friday")[0]));
                l.add("friday");
            }
            if (parameters.get("saturday") != null
                    && p.matcher(parameters.get("saturday")[0]).matches()) {
                this.setSaturday(DatatypeConverter.parseHexBinary(parameters.get("saturday")[0]));
                l.add("saturday");
            }
            if (parameters.get("sunday") != null
                    && p.matcher(parameters.get("sunday")[0]).matches()) {
                this.setSunday(DatatypeConverter.parseHexBinary(parameters.get("sunday")[0]));
                l.add("sunday");
            }
        } catch(Exception e) {}
        return l;
    }
}

class DoctorByteAdapter extends XmlAdapter<String, byte[]> {
    public byte[] unmarshal(String v) throws Exception {
        return DatatypeConverter.parseHexBinary(v);
    }

    public String marshal(byte[] v) throws Exception {
        return DatatypeConverter.printHexBinary(v);
    }
}

class DoctorTimeSlots {
    private String[] monday;
    private String[] tuesday;
    private String[] wednesday;
    private String[] thursday;
    private String[] friday;
    private String[] saturday;
    private String[] sunday;

    public String[] getMonday() {
        return monday;
    }
    public void setMonday(String[] monday) {
        this.monday = monday;
    }
    public String[] getTuesday() {
        return tuesday;
    }
    public void setTuesday(String[] tuesday) {
        this.tuesday = tuesday;
    }
    public String[] getWednesday() {
        return wednesday;
    }
    public void setWednesday(String[] wednesday) {
        this.wednesday = wednesday;
    }
    public String[] getThursday() {
        return thursday;
    }
    public void setThursday(String[] thursday) {
        this.thursday = thursday;
    }
    public String[] getFriday() {
        return friday;
    }
    public void setFriday(String[] friday) {
        this.friday = friday;
    }
    public String[] getSaturday() {
        return saturday;
    }
    public void setSaturday(String[] saturday) {
        this.saturday = saturday;
    }
    public String[] getSunday() {
        return sunday;
    }
    public void setSunday(String[] sunday) {
        this.sunday = sunday;
    }

    private String slotToString(int[] slot) {
        return Integer.toString(slot[0]) + "-" + Integer.toString(slot[1] + 1);
    }

    public String[] byteToTimeSlot(byte[] bytes) {
        List<String> list = new ArrayList<>();
        int[] slot = new int[2];
        slot[0] = -1;
        slot[1] = -1;
        for (int i = 0; i < 24; i++) {
            if (((bytes[(i - (i % 8)) / 8] >> 7 - (i % 8)) & 1) == 1) { // si le bit en position i == 1
                if (slot[0] == -1) { slot[0] = i; }
                slot[1] = i;
            } else if (slot[0] != -1) {
                list.add(slotToString(slot));
                slot[0] = -1;
            }
        }
        if (slot[0] != -1) { // si le dernier bit est à 1
            list.add(slotToString(slot));
        }
        String[] r = new String[list.size()];
        for (int i = 0; i < list.size(); i++) {
            r[i] = list.get(i);
        }
        return r;
    }

    public DoctorTimeSlots(byte[] monday, byte[] tuesday, byte[] wednesday, byte[] thursday, byte[] friday, byte[] saturday, byte[] sunday) {
        this.monday = byteToTimeSlot(monday);
        this.tuesday = byteToTimeSlot(tuesday);
        this.wednesday = byteToTimeSlot(wednesday);
        this.thursday = byteToTimeSlot(thursday);
        this.friday = byteToTimeSlot(friday);
        this.saturday = byteToTimeSlot(saturday);
        this.sunday = byteToTimeSlot(sunday);
    }
}