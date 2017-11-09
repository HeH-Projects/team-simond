package be.heh.teamsimond.vetapp;

import be.heh.teamsimond.vetapp.JPA.Appointment;

import java.util.Date;
import java.util.List;

public interface IVetappElementRepository {
    List<IVetappElement> findById(Class c, int id);
    List<IVetappElement> findByIncompleteName(Class c, String str);
    List<IVetappElement> findAll(Class c);
    List<IVetappElement> findAppointmentInInterval(Date start, Date end);
    List<IVetappElement> findAppointmentByDate_Doctor(Date date, int doctorId);
    List<IVetappElement> findAppointmentByDate_Patient(Date date, int patientId);
    void update(IVetappElement e);
    void save(IVetappElement e);
    void delete(IVetappElement e);
}
