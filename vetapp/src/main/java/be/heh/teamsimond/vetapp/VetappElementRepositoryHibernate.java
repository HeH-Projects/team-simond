package be.heh.teamsimond.vetapp;

import be.heh.teamsimond.vetapp.JPA.Appointment;
import org.hibernate.Query;
import org.hibernate.Session;
import org.springframework.stereotype.Repository;

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
        Query query = session.createQuery("FROM "+c.getName()+" c WHERE c.id = :id");
        query.setParameter( "id", id);
        List<IVetappElement> list = query.list();
        this.s_commitClose(session);
        return list;
    }

    public List<IVetappElement> findByIncompleteName(Class c, String str) {
        Session session = this.s_beginTransaction();
        Query query = session.createQuery("FROM "+c.getName()+" c WHERE c.name LIKE :str");
        query.setParameter( "str", str + "%");
        List<IVetappElement> list = query.list();
        this.s_commitClose(session);
        return list;
    }

    public List<IVetappElement> findAll(Class c) {
        Session session = this.s_beginTransaction();
        Query query = session.createQuery("FROM "+c.getName()+" c");
        List<IVetappElement> list = query.list();
        this.s_commitClose(session);
        return list;
    }

    public List<IVetappElement> findAppointmentInInterval(Date start, Date end) {
        Session session = this.s_beginTransaction();
        Query query = session.createQuery("FROM Appointment c WHERE c.id.date BETWEEN :start AND :end");
        query.setParameter( "start", start);
        query.setParameter("end", end);
        List<IVetappElement> list = query.list();
        this.s_commitClose(session);
        return list;
    }

    public List<IVetappElement> findAppointmentByDate_Doctor(Date date, int doctorId) {
        Session session = this.s_beginTransaction();
        Query query = session.createQuery("FROM Appointment c WHERE c.id.date = :date AND c.id.doctorId = :doctor_id");
        query.setParameter( "date", date);
        query.setParameter("doctor_id", doctorId);
        List<IVetappElement> list = query.list();
        this.s_commitClose(session);
        return list;
    }

    public List<IVetappElement> findAppointmentByDate_Patient(Date date, int patientId) {
        Session session = this.s_beginTransaction();
        Query query = session.createQuery("FROM Appointment c WHERE c.id.date = :date AND c.id.patientId = :patient_id");
        query.setParameter( "date", date);
        query.setParameter("patient_id", patientId);
        List<IVetappElement> list = query.list();
        this.s_commitClose(session);
        return list;
    }

    public void deleteElement(Class c, IVetappElement e) {
        Session session = HibernateUtil.getSessionFactory().openSession();
        session.delete(e);
    }
}
