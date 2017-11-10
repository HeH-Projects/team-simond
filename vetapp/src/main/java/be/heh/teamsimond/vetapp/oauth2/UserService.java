package be.heh.teamsimond.vetapp.oauth2;

//import be.heh.teamsimond.vetapp.JPA.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service("userDetailsService")
public class UserService implements UserDetailsService {

    @Autowired
    private IUserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        /*User user = new User();
        user.setUsername("secretaire");
        user.setPassword("Test123*");
        user.setEnabled(true);
        userRepository.save(user);*/
        return userRepository.getUserByName(username);
    }
}

