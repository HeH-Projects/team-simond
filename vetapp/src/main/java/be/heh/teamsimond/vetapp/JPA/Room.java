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
@Table(name="rooms")
@XmlRootElement
public class Room implements IVetappElement{
    @Id
    @GeneratedValue(generator="increment")
    @GenericGenerator(name="increment", strategy = "increment")
    private int id;
    private String name;
    private byte[] color;

    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }
    public String getName() {
        return name;
    }
    public Boolean setName(String name) {
        if (name.length() > 0) {
            this.name = name;
            return true;
        }
        return false;
    }
    @XmlJavaTypeAdapter(RoomByteAdapter.class)
    public byte[] getColor() {
        return color;
    }
    public void setColor(byte[] color) {
        this.color = color;
    }

    public static IVetappElement generate(Map<String, String[]> parameters) {
        Room e = new Room();
        List<String> l = e.update(parameters);
        if (l.contains("name") && l.contains("color")) {
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
            Pattern p = Pattern.compile("^[0-9A-F]{6}$");
            if (parameters.get("color") != null
                    && p.matcher(parameters.get("color")[0]).matches()) {
                this.setColor(DatatypeConverter.parseHexBinary(parameters.get("color")[0]));
                l.add("color");
            }
        } catch(Exception e) {}
        return l;
    }
}

class RoomByteAdapter extends XmlAdapter<String, byte[]> {
    public byte[] unmarshal(String v) throws Exception {
        return DatatypeConverter.parseHexBinary(v);
    }

    public String marshal(byte[] v) throws Exception {
        return DatatypeConverter.printHexBinary(v);
    }
}
