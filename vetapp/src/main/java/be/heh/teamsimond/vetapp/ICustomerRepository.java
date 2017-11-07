package be.heh.teamsimond.vetapp;

import java.util.List;

public interface ICustomerRepository {
    List<VetappElement> findById(int id);
    void save(Customer b);
}
