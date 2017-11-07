package be.heh.teamsimond.vetapp;

import org.hibernate.Query;
import org.hibernate.Session;
import org.springframework.stereotype.Repository;

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
        Session session = HibernateUtil.getSessionFactory().openSession();
        session.beginTransaction();
        Query query = session.createQuery("FROM "+c.getName()+" c WHERE c.id = :id");
        query.setParameter( "id", id);
        List<IVetappElement> list = query.list();
        session.getTransaction().commit();
        session.close();
        return list;
    }

    public List<IVetappElement> findByIncompleteName(Class c, String str) {
        Session session = HibernateUtil.getSessionFactory().openSession();
        session.beginTransaction();
        Query query = session.createQuery("FROM "+c.getName()+" c WHERE c.name = :str");
        query.setParameter( "str", str);
        List<IVetappElement> list = query.list();
        session.getTransaction().commit();
        session.close();
        return list;
    }

    public List<IVetappElement> findAll(Class c) {
        Session session = HibernateUtil.getSessionFactory().openSession();
        session.beginTransaction();
        Query query = session.createQuery("FROM "+c.getName()+" c");
        List<IVetappElement> list = query.list();
        session.getTransaction().commit();
        session.close();
        return list;
    }

    public void deleteElement(Class c, IVetappElement e) {
        Session session = HibernateUtil.getSessionFactory().openSession();
        session.delete(e);
    }
}
