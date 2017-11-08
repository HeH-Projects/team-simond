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

    public DoctorTimeSlots getTimeSlots() {
        return timeSlots;
    }

    public void setTimeSlots(DoctorTimeSlots timeSlots) {
        this.timeSlots = timeSlots;
    }

    @Transient
    private DoctorTimeSlots timeSlots;

    public int getId() { return id;}
    public void setId(int id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
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
        try {
            String strName = parameters.get("name")[0];
            if (strName != null && strName.length() > 0) {
                Doctor e = new Doctor();
                e.setName(strName);
                e.setRoomId(Integer.parseInt(parameters.get("room_id")[0]));
                e.setMonday(DatatypeConverter.parseHexBinary(parameters.get("monday")[0]));
                e.setTuesday(DatatypeConverter.parseHexBinary(parameters.get("tuesday")[0]));
                e.setWednesday(DatatypeConverter.parseHexBinary(parameters.get("wednesday")[0]));
                e.setThursday(DatatypeConverter.parseHexBinary(parameters.get("thursday")[0]));
                e.setFriday(DatatypeConverter.parseHexBinary(parameters.get("friday")[0]));
                e.setSaturday(DatatypeConverter.parseHexBinary(parameters.get("saturday")[0]));
                e.setSunday(DatatypeConverter.parseHexBinary(parameters.get("sunday")[0]));
                e.timeSlots = new DoctorTimeSlots(e.getMonday(), e.getTuesday(), e.getWednesday(), e.getThursday(), e.getFriday(), e.getSaturday(), e.getSunday());
                return e;
            }
        } catch (Exception e) {}
        return null;
    }
    public void update(Map<String, String[]> parameters) {

    }
}

class DoctorTimeSlots {
    private TimeSlot[] monday;
    private TimeSlot[] tuesday;
    private TimeSlot[] wednesday;
    private TimeSlot[] thursday;
    private TimeSlot[] friday;
    private TimeSlot[] saturday;
    private TimeSlot[] sunday;

    public TimeSlot[] getMonday() {
        return monday;
    }
    public void setMonday(TimeSlot[] monday) {
        this.monday = monday;
    }
    public TimeSlot[] getTuesday() {
        return tuesday;
    }
    public void setTuesday(TimeSlot[] tuesday) {
        this.tuesday = tuesday;
    }
    public TimeSlot[] getWednesday() {
        return wednesday;
    }
    public void setWednesday(TimeSlot[] wednesday) {
        this.wednesday = wednesday;
    }
    public TimeSlot[] getThursday() {
        return thursday;
    }
    public void setThursday(TimeSlot[] thursday) {
        this.thursday = thursday;
    }
    public TimeSlot[] getFriday() {
        return friday;
    }
    public void setFriday(TimeSlot[] friday) {
        this.friday = friday;
    }
    public TimeSlot[] getSaturday() {
        return saturday;
    }
    public void setSaturday(TimeSlot[] saturday) {
        this.saturday = saturday;
    }
    public TimeSlot[] getSunday() {
        return sunday;
    }
    public void setSunday(TimeSlot[] sunday) {
        this.sunday = sunday;
    }

    public TimeSlot[] byteToTimeSlot(byte[] bytes) {
        List<int[]> list = new ArrayList<>();
        int[] slot = new int[2];
        for (int i = 0; i < 24; i++) {
            if (((bytes[(i - i % 8) / 8] >> i % 8) & 1) == 1) {
                if (slot[0] == -1) {
                    slot[0] = i;
                } else {
                    slot[1] = i;
                }
            } else if (slot[0] != -1) {
                list.add(slot);
                slot[0] = -1;
            }
        }
        TimeSlot[] r = new TimeSlot[list.size()];
        for (int i = 0; i < list.size(); i++) {
            r[i] = new TimeSlot(list.get(i)[0], list.get(i)[1]);
        }
        return r;
    }
    public byte[] timeSlotToByte(TimeSlot timeslot) {
        return new byte[3];
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
    public DoctorTimeSlots() {}
}

class TimeSlot {
    private int beginning;
    private int end;

    public int getBeginning() {
        return beginning;
    }
    public void setBeginning(int beginning) {
        this.beginning = beginning;
    }
    public int getEnd() {
        return end;
    }
    public void setEnd(int end) {
        this.end = end;
    }

    public TimeSlot(int beginning, int end) {
        this.beginning = beginning;
        this.end = end;
    }
    public TimeSlot(){}
}

class DoctorByteAdapter extends XmlAdapter<String, byte[]> {
    public byte[] unmarshal(String v) throws Exception {
        return DatatypeConverter.parseHexBinary(v);
    }

    public String marshal(byte[] v) throws Exception {
        return DatatypeConverter.printHexBinary(v);
    }
}