package be.heh.teamsimond.vetapp;

import org.hibernate.Query;
import org.hibernate.Session;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class CustomerRepositoryHibernate implements ICustomerRepository {

    @Override
    public void save(Customer c) {
        Session session = HibernateUtil.getSessionFactory().openSession();
        session.beginTransaction();
        session.save(c);
        session.getTransaction().commit();
        session.close();
    }

    public List<VetappElement> findById(int id) {
        Session session = HibernateUtil.getSessionFactory().openSession();
        session.beginTransaction();
        Query query = session.createQuery("from Customer c where c.id = :id");
        query.setParameter( "id", id);
        List<VetappElement> list = query.list();
        session.getTransaction().commit();
        session.close();
        return list;
    }

}