package be.heh.teamsimond.vetapp;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import javax.xml.bind.annotation.XmlRootElement;
import java.util.Map;

@Entity
@Table(name="customers")
@XmlRootElement
public class Customer implements IVetappElement {
    @Id
    @GeneratedValue(generator="increment")
    @GenericGenerator(name="increment", strategy = "increment")
    private int id;

    private String name;

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
        if (parameters.get("name").length == 1) {
            String strName = parameters.get("name")[0];
            if (strName != null && strName.length() > 0) {
                Customer e = new Customer();
                e.setName(strName);
                return e;
            }
        }
        return null;
    }
    public void update(Map<String, String[]> parameters) {
        if (parameters.get("name").length == 1
                && parameters.get("name")[0].length() > 0) {
            this.name = parameters.get("name")[0];
        }
    }
}
