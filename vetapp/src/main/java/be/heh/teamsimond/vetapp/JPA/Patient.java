package be.heh.teamsimond.vetapp.JPA;

import be.heh.teamsimond.vetapp.IVetappElement;
import org.hibernate.annotations.GenericGenerator;
import javax.persistence.*;
import javax.xml.bind.annotation.XmlRootElement;
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
    private boolean hasPic;

    public Patient(){}

    public Patient(int id, int customerId, String name, int type, int breed, boolean hasPic){
        this.id = id;
        this.customerId = customerId;
        this.name = name;
        this.type = type;
        this.breed = breed;
        this.hasPic = hasPic;
    }

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

    public void setName(String name) {
        this.name = name;
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
            String strName = parameters.get("name")[0];
            if (strName != null && strName.length() > 0) {
                Patient e = new Patient();
                e.setName(strName);
                e.setCustomerId(Integer.parseInt(parameters.get("customer_id")[0]));
                e.setType(Integer.parseInt(parameters.get("type")[0]));
                e.setBreed(Integer.parseInt(parameters.get("breed")[0]));
                return e;
            }
        } catch(Exception e) {}
        return null;
    }
    public void update(Map<String, String[]> parameters) {

    }
}
