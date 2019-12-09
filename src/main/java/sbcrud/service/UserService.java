package sbcrud.service;

import sbcrud.model.User;

import java.util.List;

public interface UserService {
    void addUser(User user);
    void deleteUser(User user);
    void updateUser(User user);
    User getUserById(Long id);
    List<User> getAllUsers();
    User getUserByLogin(String login);
}
