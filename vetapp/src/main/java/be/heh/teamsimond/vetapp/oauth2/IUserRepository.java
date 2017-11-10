package be.heh.teamsimond.vetapp.oauth2;

import be.heh.teamsimond.vetapp.JPA.User;

public interface IUserRepository {
    void save(User user);
    User getUserByName(String username);
}
