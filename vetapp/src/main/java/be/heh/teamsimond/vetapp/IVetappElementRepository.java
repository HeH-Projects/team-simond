package be.heh.teamsimond.vetapp;

import be.heh.teamsimond.vetapp.JPA.Appointment;
import be.heh.teamsimond.vetapp.JPA.Customer;
import be.heh.teamsimond.vetapp.JPA.Doctor;
import be.heh.teamsimond.vetapp.JPA.Patient;

import java.util.Date;
import java.util.List;

public interface IVetappElementRepository {
    List<IVetappElement> findById(Class c, int id);
    List<IVetappElement> findByIncompleteName(Class c, String str);
    List<IVetappElement> findAll(Class c);
    List<IVetappElement> findPatientsByCustomer(Customer customer);
    List<IVetappElement> findPatientsByCustomer(int customerId);
    List<IVetappElement> findAppointmentsInInterval(Date start, Date end);
    List<IVetappElement> findAppointmentByDate_Patient(Date date, Patient patient);
    List<IVetappElement> findAppointmentByDate_Patient(Date date, int patientId);
    List<IVetappElement> findAppointmentsByPatient(Patient patient);
    List<IVetappElement> findAppointmentsByPatient(int patientId);
    void update(IVetappElement e);
    void save(IVetappElement e);
    void delete(IVetappElement e);
}
