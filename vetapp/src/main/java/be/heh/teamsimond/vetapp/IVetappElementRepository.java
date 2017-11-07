package be.heh.teamsimond.vetapp;

import java.util.List;

public interface IVetappElementRepository {
    List<IVetappElement> findById(Class c, int id);
    List<IVetappElement> findByIncompleteName(Class c, String str);
    List<IVetappElement> findAll(Class c);
    void update(IVetappElement e);
    void save(IVetappElement e);
    void delete(IVetappElement e);
}
