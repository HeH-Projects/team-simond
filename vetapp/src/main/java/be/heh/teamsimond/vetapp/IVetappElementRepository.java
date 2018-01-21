package be.heh.teamsimond.vetapp;

import java.util.Date;
import java.util.List;

public interface IVetappElementRepository {
    List<IVetappElement> findById(Class c, int id);
    List<IVetappElement> findByIncompleteName(Class c, String str);
    List<IVetappElement> findAll(Class c);
    List<IVetappElement> findPatientsByCustomer(int customerId);
    List<IVetappElement> findAppointmentsInInterval(Date start, Date end);
    List<IVetappElement> findAppointmentByDate_Patient(Date date, int patientId);
    List<IVetappElement> findAppointmentsByPatient(int patientId);
    List<IVetappElement> findCustomerByPatient(int patientId);
    List<IVetappElement> findRoomByName(String name);
    List<IVetappElement> findBreedsByType(int typeId);
    void update(IVetappElement e);
    void save(IVetappElement e);
    void delete(IVetappElement e);
}
