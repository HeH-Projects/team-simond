package be.heh.teamsimond.vetapp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.*;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import javax.xml.bind.JAXB;
import java.io.StringWriter;
import java.util.ArrayList;
import java.util.List;

@RestController
@EnableAutoConfiguration
public class Controller {
    private ICustomerRepository customerRepository;

    @Autowired
    public Controller(ICustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @RequestMapping(value = "/{markup}/{class}/{id}", method = RequestMethod.GET)
    public String getElementById(@PathVariable("markup") String strMarkup, @PathVariable("class") String strClass, @PathVariable("id") String strId, Model model) {
        List<VetappElement> l = new ArrayList<>();
        int id;
        try {
            id = Integer.parseInt(strId);
        } catch(Exception e) {
            return "id invalide";
        }
        switch (strClass) {
            case "customer":
                l = customerRepository.findById(id);
                break;
            case "patient":
                break;
            case "doctor":
                break;
            case "room":
                break;
            case "appointment":
                break;
        }
        VetappElement e = l.size() == 1 ? l.get(0) : new VetappElement();
        switch (strMarkup) {
            case "xml":
                StringWriter sw = new StringWriter();
                JAXB.marshal(e, sw);
                return sw.toString();
            case "json":
                return "";
            default:
                return "markup invalide";
        }
    }
}
