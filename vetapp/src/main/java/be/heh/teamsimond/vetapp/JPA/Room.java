package be.heh.teamsimond.vetapp.JPA;

import be.heh.teamsimond.vetapp.IVetappElement;
import org.hibernate.annotations.GenericGenerator;
import javax.persistence.*;
import javax.xml.bind.annotation.XmlRootElement;
import java.util.Map;

@Entity
@Table(name="rooms")
@XmlRootElement
public class Room implements IVetappElement{
    @Id
    @GeneratedValue(generator="increment")
    @GenericGenerator(name="increment", strategy = "increment")
    private int id;

    private String name;

    public Room(){}

    public Room(int id, String name){
        this.id = id;
        this.name = name;
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

    public static IVetappElement generate(Map<String, String[]> parameters) {
        try {
            String strName = parameters.get("name")[0];
            if (strName != null && strName.length() > 0) {
                Room e = new Room();
                e.setName(strName);
                return e;
            }
        } catch (Exception e) {}
        return null;
    }
    public void update(Map<String, String[]> parameters) {
        try {
            if (parameters.get("name")[0].length() > 0) {
                this.name = parameters.get("name")[0];
            }
        } catch (Exception e) {}
    }
}
