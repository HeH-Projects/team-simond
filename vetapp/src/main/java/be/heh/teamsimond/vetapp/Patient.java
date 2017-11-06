package be.heh.teamsimond.vetapp;

import org.hibernate.annotations.GenericGenerator;
import javax.persistence.*;

@Entity
@Table(name="patients")
public class Patient {
    @Id
    @GeneratedValue(generator="increment")
    @GenericGenerator(name="increment", strategy = "increment")
    private int id;

    @Column(name="customer_id")
    private int customerId;

    private Customer owner;

    private String name;
    private int type;
    private int breed;

    @Column(name="has_picture")
    private boolean hasPic;

    public Patient(int id, int customerId, String name, int type, int breed, boolean hasPic){
        this.id = id;
        this.setCustomerId(customerId);
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
        //owner = Customers.getCustomer(customerId);  Customers = listes de clients en statique?
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
}
