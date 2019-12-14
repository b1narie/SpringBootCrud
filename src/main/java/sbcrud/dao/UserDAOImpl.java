package sbcrud.dao;

import org.springframework.stereotype.Repository;
import sbcrud.model.User;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import java.util.List;

@Repository
public class UserDAOImpl implements UserDAO {

    @PersistenceContext
    private EntityManager entityManager ;

    @Override
    public void addUser(User user) {
        entityManager.persist(user);
    }

    @Override
    public void deleteUser(User user) {
        entityManager.remove(entityManager.contains(user) ? user : entityManager.merge(user));
    }

    @Override
    public void updateUser(User user) {
        entityManager.merge(user);
    }

    @Override
    public User getUserById(Long id) {
        Query query = entityManager.createQuery("FROM User usr WHERE usr.id = ?1");
        query.setParameter(1, id);
        return (User) query.getSingleResult();
    }

    @Override
    public List<User> getAllUsers() {
        return entityManager.createQuery("FROM User ORDER BY id", User.class).getResultList();
    }

    @Override
    public User getUserByLogin(String login) {
        Query query = entityManager.createQuery("FROM User usr WHERE usr.login = ?1");
        query.setParameter(1, login);
        return (User) query.getSingleResult();
    }
}
