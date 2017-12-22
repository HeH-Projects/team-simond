package be.heh.teamsimond.vetapp.JPA;

import be.heh.teamsimond.vetapp.IVetappElement;
import org.hibernate.annotations.GenericGenerator;
import javax.persistence.*;
import javax.xml.bind.annotation.XmlRootElement;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Entity
@Table(name="patients")
@XmlRootElement
public class Patient implements IVetappElement {
    @Id
    @GeneratedValue(generator="increment")
    @GenericGenerator(name="increment", strategy = "increment")
    private int id;
    @Column(name="customer_id")
    private int customerId;
    private String name;
    private int type;
    private int breed;
    @Column(name="has_picture")
    private boolean hasPic = false;

    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }
    public int getCustomerId() {
        return customerId;
    }
    public void setCustomerId(int customerId) {
        this.customerId = customerId;
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
    public int getType() {
        return type;
    }
    public void setType(int type) {
        this.type = type;
    }
    public int getBreed() {
        return breed;
    }
    public void setBreed(int breed) {
        this.breed = breed;
    }
    public boolean isHasPic() {
        return hasPic;
    }
    public void setHasPic(boolean hasPic) {
        this.hasPic = hasPic;
    }

    public static IVetappElement generate(Map<String, String[]> parameters){
        try {
            Patient e = new Patient();
            e.setCustomerId(Integer.parseInt(parameters.get("customer_id")[0]));
            List<String> l = e.update(parameters);
            if (l.contains("name")
                    && l.contains("type")
                    && l.contains("breed")) {
                return e;
            }
        } catch(Exception e) {}
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
            if (parameters.get("type") != null) {
                this.setType(Integer.parseInt(parameters.get("type")[0]));
                l.add("type");
            }
            if (parameters.get("breed") != null) {
                this.setBreed(Integer.parseInt(parameters.get("breed")[0]));
                l.add("breed");
            }
        } catch(Exception e) {}
        return l;
    }
}
