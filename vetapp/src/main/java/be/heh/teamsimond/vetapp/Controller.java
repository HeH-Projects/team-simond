package be.heh.teamsimond.vetapp;

import be.heh.teamsimond.vetapp.JPA.Customer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.*;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.xml.bind.JAXBContext;
import javax.xml.bind.Marshaller;
import java.io.StringWriter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@EnableAutoConfiguration
public class Controller {
    private IVetappElementRepository vetappElementRepository;
    private Map<String, Class> classMap = new HashMap<String, Class>();

    @Autowired
    public Controller(IVetappElementRepository vetappElementRepository) {
        this.vetappElementRepository = vetappElementRepository;
        this.classMap.put("customer", Customer.class);
    }

    private String objectToString(Object object, String strMarkup) {
        switch (strMarkup) {
            case "xml":
                try {
                    JAXBContext jaxbContext = JAXBContext.newInstance(VetappElements.class, Customer.class);
                    Marshaller jaxbMarshaller = jaxbContext.createMarshaller();
                    jaxbMarshaller.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, true);
                    StringWriter sw = new StringWriter();
                    jaxbMarshaller.marshal(object, sw);
                    return sw.toString();
                } catch (Exception e) {
                    return e.toString();
                }
            case "json":
                return "";
            default:
                return "markup invalide";
        }
    }

    @RequestMapping(value = "/{markup}/{class}/{id}", method = RequestMethod.GET)
    public String getElementById(@PathVariable("markup") String strMarkup, @PathVariable("class") String strClass, @PathVariable("id") String strId) {
        if (this.classMap.get(strClass) != null) {
            try {
                int id = Integer.parseInt(strId);
                List<IVetappElement> l = vetappElementRepository.findById(this.classMap.get(strClass), id);
                if (l.size() == 1) {
                    return objectToString(l.get(0), strMarkup);
                }
            } catch (Exception e) {}
        }
        return "";
    }

    @RequestMapping(value = "/{markup}/{class}s", method = RequestMethod.GET)
    public String getElements(@PathVariable("markup") String strMarkup, @PathVariable("class") String strClass, @RequestParam(value="name", required=false) String strName) {
        if (this.classMap.get(strClass) != null) {
            return objectToString(new VetappElements(strName == null ? this.vetappElementRepository.findAll(this.classMap.get(strClass)) : this.vetappElementRepository.findByIncompleteName(classMap.get(strClass), strName)), strMarkup);
        }
        return "";
    }


    @RequestMapping(value = "/{markup}/{class}/add", method = RequestMethod.POST)
    public String addElement(@PathVariable("markup") String strMarkup, @PathVariable("class") String strClass, HttpServletRequest request) {
        if (this.classMap.get(strClass) != null) {
            try {
                IVetappElement e = IVetappElement.class.cast(this.classMap.get(strClass).getMethod("generate", Map.class).invoke(null, request.getParameterMap()));
                if (e != null) {
                    vetappElementRepository.save(e);
                    return "true";
                }
            } catch (Exception e) {}
        }
        return "false";
    }

    @RequestMapping(value = "/{markup}/{class}/edit-{id}", method = RequestMethod.POST)
    public String editElement(@PathVariable("markup") String strMarkup, @PathVariable("class") String strClass, @PathVariable("id") String strId, HttpServletRequest request) {
        if (this.classMap.get(strClass) != null) {
            try {
                int id = Integer.parseInt(strId);
                List<IVetappElement> l = vetappElementRepository.findById(classMap.get(strClass), id);
                if (l.size() == 1) {
                    IVetappElement e = l.get(0);
                    e.update(request.getParameterMap());
                    vetappElementRepository.update(e);
                    return "true";
                }
            } catch (Exception e) {}
        }
        return "false";
    }

    @RequestMapping(value = "/{markup}/{class}/delete-{id}", method = RequestMethod.POST)
    public String deleteElement(@PathVariable("markup") String strMarkup, @PathVariable("class") String strClass, @PathVariable("id") String strId) {
        if (this.classMap.get(strClass) != null) {
            try {
                int id = Integer.parseInt(strId);
                List<IVetappElement> l = vetappElementRepository.findById(classMap.get(strClass), id);
                if (l.size() == 1) {
                    IVetappElement e = l.get(0);
                    vetappElementRepository.delete(e);
                    return "true";
                }
            } catch (Exception e) {}
        }
        return "false";
    }

    @RequestMapping(value = {"/{markup}/planning/{date}","/{markup}/planning/{date}/{class}/{id}"}, method = RequestMethod.GET)
    public String getPlanning(@PathVariable("markup") String strMarkup, @PathVariable("date") String strDate, @PathVariable(value="class", required=false) String strClass, @PathVariable(value="id", required=false) String strId, Model model) {
        //appointmentRepository.getByDate();
        return "";
    }
}
