package be.heh.teamsimond.vetapp.oauth2;

import be.heh.teamsimond.vetapp.HibernateUtil;
import be.heh.teamsimond.vetapp.JPA.User;
import org.hibernate.Query;
import org.hibernate.Session;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public class UserRepository implements IUserRepository {

    public void save(User c) {
        Session session = HibernateUtil.getSessionFactory().openSession();
        session.beginTransaction();
        session.save(c);
        session.getTransaction().commit();
        session.close();
    }

    public User getUserByName(String username) {
        Session session = HibernateUtil.getSessionFactory().openSession();
        session.beginTransaction();
        Query query = session.createQuery("FROM User c WHERE c.username = :username");
        query.setParameter( "username", username);
        List<User> list = query.list();
        session.getTransaction().commit();
        session.close();
        return list.get(0);
    }
}
