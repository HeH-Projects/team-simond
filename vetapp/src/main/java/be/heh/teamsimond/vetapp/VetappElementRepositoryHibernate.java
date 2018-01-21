package be.heh.teamsimond.vetapp;

import be.heh.teamsimond.vetapp.JPA.Patient;
import org.hibernate.Session;
import org.springframework.stereotype.Repository;

import javax.persistence.TypedQuery;
import java.util.Date;
import java.util.List;

@Repository
public class VetappElementRepositoryHibernate implements IVetappElementRepository {

    private void saveupdatedelete(IVetappElement c, int action) {
        Session session = HibernateUtil.getSessionFactory().openSession();
        session.beginTransaction();
        switch (action) {
            case 1:
                session.save(c);
                break;
            case 2:
                session.update(c);
                break;
            case 3:
                session.delete(c);
                break;
        }
        session.getTransaction().commit();
        session.close();
    }

    private Session s_beginTransaction() {
        Session session = HibernateUtil.getSessionFactory().openSession();
        session.beginTransaction();
        return session;
    }
    private void s_commitClose(Session session) {
        session.getTransaction().commit();
        session.close();
    }

    public void save(IVetappElement c) {
        this.saveupdatedelete(c, 1);
    }

    public void update(IVetappElement c) {
        this.saveupdatedelete(c, 2);
    }

    public void delete(IVetappElement c) {
        this.saveupdatedelete(c, 3);
    }

    public List<IVetappElement> findById(Class c, int id) {
        Session session = this.s_beginTransaction();
        TypedQuery<IVetappElement> query = session.createQuery("FROM "+c.getName()+" c WHERE c.id = :id");
        query.setParameter( "id", id);
        List<IVetappElement> list = query.getResultList();
        this.s_commitClose(session);
        return list;
    }

    public List<IVetappElement> findByIncompleteName(Class c, String str) {
        Session session = this.s_beginTransaction();
        TypedQuery<IVetappElement> query = session.createQuery("FROM "+c.getName()+" c WHERE c.name LIKE :str");
        query.setParameter( "str", str + "%");
        List<IVetappElement> list = query.getResultList();
        this.s_commitClose(session);
        return list;
    }

    public List<IVetappElement> findAll(Class c) {
        Session session = this.s_beginTransaction();
        TypedQuery<IVetappElement> query = session.createQuery("FROM "+c.getName()+" c");
        List<IVetappElement> list = query.getResultList();
        this.s_commitClose(session);
        return list;
    }

    public List<IVetappElement> findPatientsByCustomer(int customerId) {
        Session session = this.s_beginTransaction();
        TypedQuery<IVetappElement> query = session.createQuery("FROM Patient c WHERE c.customerId = :customer_id");
        query.setParameter( "customer_id", customerId);
        List<IVetappElement> list = query.getResultList();
        this.s_commitClose(session);
        return list;
    }

    public List<IVetappElement> findAppointmentsInInterval(Date start, Date end) {
        Session session = this.s_beginTransaction();
        TypedQuery<IVetappElement> query = session.createQuery("FROM Appointment c WHERE c.id.date BETWEEN :start AND :end");
        query.setParameter( "start", start);
        query.setParameter("end", end);
        List<IVetappElement> list = query.getResultList();
        this.s_commitClose(session);
        return list;
    }

    public List<IVetappElement> findAppointmentByDate_Patient(Date date, Patient patient) {
        return this.findAppointmentByDate_Patient(date, patient.getId());
    }
    public List<IVetappElement> findAppointmentByDate_Patient(Date date, int patientId) {
        Session session = this.s_beginTransaction();
        TypedQuery<IVetappElement> query = session.createQuery("FROM Appointment c WHERE c.id.date = :date AND c.id.patientId = :patient_id");
        query.setParameter( "date", date);
        query.setParameter("patient_id", patientId);
        List<IVetappElement> list = query.getResultList();
        this.s_commitClose(session);
        return list;
    }

    public List<IVetappElement> findAppointmentsByPatient(int patientId) {
        Session session = this.s_beginTransaction();
        TypedQuery<IVetappElement> query = session.createQuery("FROM Appointment c WHERE c.id.patientId = :patient_id");
        query.setParameter("patient_id", patientId);
        List<IVetappElement> list = query.getResultList();
        this.s_commitClose(session);
        return list;
    }

    public List<IVetappElement> findCustomerByPatient(int patientId) {
        Session session = this.s_beginTransaction();
        TypedQuery<IVetappElement> query = session.createQuery("FROM Customer c WHERE c.id = (SELECT p.customerId FROM Patient p WHERE p.id = :patient_id)");
        query.setParameter("patient_id", patientId);
        List<IVetappElement> list = query.getResultList();
        this.s_commitClose(session);
        return list;
    }

    public List<IVetappElement> findRoomByName(String name) {
        Session session = this.s_beginTransaction();
        TypedQuery<IVetappElement> query = session.createQuery("FROM Room c WHERE c.name = :name");
        query.setParameter("name", name);
        List<IVetappElement> list = query.getResultList();
        this.s_commitClose(session);
        return list;
    }

    public List<IVetappElement> findBreedsByType(int typeId){
        Session session = this.s_beginTransaction();
        TypedQuery<IVetappElement> query = session.createQuery("FROM Breed c WHERE c.typeId = :type_id");
        query.setParameter("type_id", typeId);
        List<IVetappElement> list = query.getResultList();
        this.s_commitClose(session);
        return list;
    }
}
