package be.heh.teamsimond.vetapp.JPA;

import be.heh.teamsimond.vetapp.IVetappElement;
import org.hibernate.annotations.GenericGenerator;
import javax.persistence.*;
import javax.xml.bind.annotation.XmlRootElement;
import java.util.ArrayList;
import java.util.List;
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
    private String address;
    @Column(name="postal_code")
    private int postalCode;
    private String town;
    private String phone;

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
    public String getAddress() {
        return address;
    }
    public Boolean setAddress(String address) {
        if (address.length() > 0) {
            this.address = address;
            return true;
        }
        return false;
    }
    public int getPostalCode() {
        return postalCode;
    }
    public void setPostalCode(int postalCode) {
        this.postalCode = postalCode;
    }
    public String getTown() {
        return town;
    }
    public Boolean setTown(String town) {
        if (town.length() > 0) {
            this.town = town;
            return true;
        }
        return false;
    }
    public String getPhone() {
        return phone;
    }
    public Boolean setPhone(String phone) {
        if (phone.length() > 0) {
            this.phone = phone;
            return true;
        }
        return false;
    }

    public static IVetappElement generate(Map<String, String[]> parameters) {
        Customer e = new Customer();
        List<String> l = e.update(parameters);
        if (l.contains("name") && l.contains("address") && l.contains("postalCode") && l.contains("town") && l.contains("phone")) {
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
            if (parameters.get("address") != null) {
                if (this.setAddress(parameters.get("address")[0])) {
                    l.add("address");
                }
            }
            if (parameters.get("postalCode") != null) {
                this.setPostalCode(Integer.parseInt(parameters.get("postalCode")[0]));
                l.add("postalCode");
            }
            if (parameters.get("town") != null) {
                if (this.setTown(parameters.get("town")[0])) {
                    l.add("town");
                }
            }
            if (parameters.get("phone") != null) {
                if (this.setPhone(parameters.get("phone")[0])) {
                    l.add("phone");
                }
            }
        } catch(Exception e) {}
        return l;
    }
}
