package be.heh.teamsimond.vetapp.JPA;

import be.heh.teamsimond.vetapp.IVetappElement;
import org.hibernate.annotations.GenericGenerator;
import javax.persistence.*;
import javax.xml.bind.annotation.XmlRootElement;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;


@Entity
@Table(name="breeds")
@XmlRootElement
public class Breed implements IVetappElement{
    @Id
    @GeneratedValue(generator="increment")
    @GenericGenerator(name="increment", strategy = "increment")
    private int id;
    @Column(name="type_id")
    private int typeId;
    private String name;

    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }
    public int getTypeId() {
        return typeId;
    }
    public void setTypeId(int typeId) {
        this.typeId = typeId;
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

    public static IVetappElement generate(Map<String, String[]> parameters) {
        Breed e = new Breed();
        List<String> l = e.update(parameters);
        if (l.contains("typeId")
                && l.contains("name")) {
            return e;
        }
        return null;
    }
    public List<String> update(Map<String, String[]> parameters) {
        List<String> l = new ArrayList<>();
        try {
            if (parameters.get("typeId") != null) {
                this.setTypeId(Integer.parseInt(parameters.get("typeId")[0]));
                l.add("typeId");
            }
            if (parameters.get("name") != null) {
                if (this.setName(parameters.get("name")[0])) {
                    l.add("name");
                }
            }
        } catch(Exception e) {}
        return l;
    }
}
