package be.heh.teamsimond.vetapp;

import be.heh.teamsimond.vetapp.JPA.*;
import org.json.JSONObject;
import org.json.XML;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.*;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.xml.bind.JAXBContext;
import javax.xml.bind.Marshaller;
import java.io.StringWriter;
import java.text.SimpleDateFormat;
import java.util.*;

@RestController
@EnableResourceServer
@RequestMapping("/api")
@EnableAutoConfiguration
public class Controller {
    private IVetappElementRepository vetappElementRepository;
    private Map<String, Class> classMap = new HashMap<String, Class>();

    @Autowired
    public Controller(IVetappElementRepository vetappElementRepository) {
        this.vetappElementRepository = vetappElementRepository;
        this.classMap.put("customer", Customer.class);
        this.classMap.put("doctor", Doctor.class);
        this.classMap.put("patient", Patient.class);
        this.classMap.put("room", Room.class);
        this.classMap.put("appointment", Appointment.class);
    }

    @RequestMapping(value = "/create/{class}", method = RequestMethod.POST)
    public String createElement(@PathVariable("class") String strClass,
                             HttpServletRequest request) {
       if (this.classMap.get(strClass) != null
                && (!strClass.equals("appointment") || this.getElementById(strClass, request.getParameter("date"), request) == null)) { // verifie qu'il n'existe pas de rdv à cette date avec ce doc ou patient
            try {
                IVetappElement e = IVetappElement.class.cast(this.classMap.get(strClass).getMethod("generate", Map.class).invoke(null, request.getParameterMap()));
                if (e != null) {
                    vetappElementRepository.save(e);
                    return "1";
                }
            } catch (Exception e) {}
        }
        return "0";
    }

    @RequestMapping(value = "/update/{class}/{id}", method = RequestMethod.POST)
    public String updateElement(@PathVariable("class") String strClass,
                                @PathVariable("id") String strId,
                                HttpServletRequest request) {
        IVetappElement e = this.getElementById(strClass, strId, request);
        if (e != null) {
            e.update(request.getParameterMap());
            vetappElementRepository.update(e);
            return "1";
        }
        return "0";
    }

    @RequestMapping(value = "/delete/{class}/{id}", method = RequestMethod.POST)
    public String deleteElement(@PathVariable("class") String strClass,
                                @PathVariable("id") String strId,
                                HttpServletRequest request) {
        IVetappElement e = this.getElementById(strClass, strId, request);
        if (e != null) {
            vetappElementRepository.delete(e);
            return "1";
        }
        return "0";
    }

    private String objectToString(Object object, String strMarkup, Class c) {
        switch (strMarkup) {
            case "xml":
                try {
                    JAXBContext jaxbContext = JAXBContext.newInstance(VetappElements.class, c);
                    Marshaller jaxbMarshaller = jaxbContext.createMarshaller();
                    jaxbMarshaller.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, true);
                    StringWriter sw = new StringWriter();
                    jaxbMarshaller.marshal(object, sw);
                    return sw.toString();
                } catch (Exception e) {}
                break;
            case "json":
                try {
                    JSONObject xmlJSONObj = XML.toJSONObject(objectToString(object, "xml", c));
                    return xmlJSONObj.toString(4);
                } catch (Exception e) {}
                break;
        }
        return "";
    }

    @RequestMapping(value = "/{markup}/{class}/{id}", method = RequestMethod.GET)
    public String getElementById_String(@PathVariable("markup") String strMarkup,
                                        @PathVariable("class") String strClass,
                                        @PathVariable("id") String strId,
                                        HttpServletRequest request) {
        IVetappElement e = this.getElementById(strClass, strId, request);
        if (e != null) {
            return objectToString(e, strMarkup, this.classMap.get(strClass));
        } else {
            return objectToString(new VetappElement(), strMarkup, VetappElement.class);
        }
    }
    private IVetappElement getElementById(String strClass, String strId, HttpServletRequest request) {
        if (this.classMap.get(strClass) != null) {
            List<IVetappElement> l = new ArrayList<>();
            if (strClass.equals("appointment")) {
                try {
                    Date date = (new SimpleDateFormat("yyyy-MM-dd'T'hh:mm")).parse(strId);
                    if ((strId = request.getParameter("doctor_id")) != null) {
                        l = vetappElementRepository.findAppointmentByDate_Doctor(date, Integer.parseInt(strId));
                    } else if ((strId = request.getParameter("patient_id")) != null) {
                        l = vetappElementRepository.findAppointmentByDate_Patient(date, Integer.parseInt(strId));
                    }
                } catch (Exception e) {}
            } else {
                try {
                    l = vetappElementRepository.findById(this.classMap.get(strClass), Integer.parseInt(strId));
                } catch (Exception e) {}
            }
            if (l.size() == 1) {
                return l.get(0);
            }
        }
        return null;
    }

    @RequestMapping(value = {"/{markup}/{class}s", "/{markup}/{class}s/{incomplete_name}"}, method = RequestMethod.GET)
    public String getElements_String(@PathVariable("markup") String strMarkup,
                                     @PathVariable("class") String strClass,
                                     @PathVariable(value="incomplete_name", required=false) String strIncompleteName) {
        VetappElements l = this.getElements(strClass, strIncompleteName);
        if (l != null) {
            return objectToString(l, strMarkup, this.classMap.get(strClass));
        } else {
            return objectToString(new VetappElements(), strMarkup, VetappElement.class);
        }
    }
    private VetappElements getElements(String strClass, String strIncompleteName) {
        if (strClass.equals("appointment") && strIncompleteName != null) {
            try {
                Date start = (new SimpleDateFormat("yyyy-MM-dd")).parse(strIncompleteName);
                Calendar cal = Calendar.getInstance();
                cal.setTime(start);
                cal.add(Calendar.DATE, 1);
                Date end = cal.getTime();
                return new VetappElements(this.vetappElementRepository.findAppointmentInInterval(start, end));
            } catch (Exception e) {}
        } else if (this.classMap.get(strClass) != null) {
            return new VetappElements(strIncompleteName != null ? this.vetappElementRepository.findByIncompleteName(classMap.get(strClass), strIncompleteName) : this.vetappElementRepository.findAll(this.classMap.get(strClass)));
        }
        return null;
    }
}
