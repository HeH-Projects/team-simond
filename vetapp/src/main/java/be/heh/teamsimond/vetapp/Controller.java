package be.heh.teamsimond.vetapp;

import be.heh.teamsimond.vetapp.JPA.*;
import org.json.JSONArray;
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
        this.classMap.put("type", Type.class);
        this.classMap.put("breed", Breed.class);
    }

    @RequestMapping(value = "/create/{class}", method = RequestMethod.POST)
    public String createElement(@PathVariable("class") String strClass,
                             HttpServletRequest request) {
       if (this.classMap.get(strClass) != null
                && (!strClass.equals("appointment") || this.getElementById(strClass, request.getParameter("date"), request.getParameter("patient")) == null)) { // verifie qu'il n'existe pas de rdv à cette date avec ce patient
           try {
                IVetappElement e = IVetappElement.class.cast(this.classMap.get(strClass).getMethod("generate", Map.class).invoke(null, request.getParameterMap()));
                if (e != null) {
                    vetappElementRepository.save(e);

                    return objectToString(e, "json", this.classMap.get(strClass));
                }
            } catch (Exception e) {}
        }
        return "";
    }

    @RequestMapping(value = {"/update/{class}/{id}","/update/{class}/{id}/{research_term}"}, method = RequestMethod.POST)
    public String updateElement(@PathVariable("class") String strClass,
                                @PathVariable("id") String strId,
                                @PathVariable(value="research_term", required=false) String researchTerm,
                                HttpServletRequest request) {
        IVetappElement e = this.getElementById(strClass, strId, researchTerm);
        if (e != null) {
            e.update(request.getParameterMap());
            vetappElementRepository.update(e);
            return objectToString(e, "json", this.classMap.get(strClass));
        }
        return "";
    }

    @RequestMapping(value = {"/delete/{class}/{id}", "/delete/{class}/{id}/{research_term}"}, method = RequestMethod.DELETE)
    public String deleteElement(@PathVariable("class") String strClass,
                                @PathVariable("id") String strId,
                                @PathVariable(value="research_term", required=false) String researchTerm) {
        IVetappElement e = this.getElementById(strClass, strId, researchTerm);
        if (e != null) {
            vetappElementRepository.delete(e);
            return objectToString(e, "json", this.classMap.get(strClass));
        }
        return "";
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
                    JSONObject jsonObject;
                    String cname = c.getSimpleName().toLowerCase();

                    //Fix pour les horaires de travail des médecins
                    String myXML = objectToString((object), "xml", c);
                    myXML = myXML.replaceAll("(?<=\\d{6}+)<", "\"<"); // any < preceded by digits
                    myXML = myXML.replaceAll(">(?=\\d{6}+)", ">\""); // any > followed by digits

                    if (object instanceof VetappElements) {
                        JSONArray jsonArray;
                        try {
                            Object tmp = ((JSONObject) XML.toJSONObject(myXML).get("vetappElements")).get(cname);
                            if (tmp instanceof JSONArray) {
                                jsonArray = (JSONArray) tmp;
                            } else {
                                jsonArray = new JSONArray();
                                jsonArray.put(tmp);
                            }
                        } catch (Exception e) {
                            jsonArray = new JSONArray();
                        }
                        jsonObject = new JSONObject();
                        jsonObject.put(cname + "s", jsonArray);
                        return jsonObject.getJSONArray(cname + "s").toString();
                    } else {
                        jsonObject = XML.toJSONObject(myXML);
                    }
                    return jsonObject.getJSONObject(cname).toString();
                } catch (Exception e) {}
                break;
        }
        return "";
    }

    @RequestMapping(value = {"/{markup}/{class}/{id}", "/{markup}/{class}/{id}/{research_term}"}, method = RequestMethod.GET)
    public String getElementById_String(@PathVariable("markup") String strMarkup,
                                        @PathVariable("class") String strClass,
                                        @PathVariable("id") String strId,
                                        @PathVariable(value="research_term", required=false) String researchTerm) {
        IVetappElement e = this.getElementById(strClass, strId, researchTerm);
        if (e != null) {
            return objectToString(e, strMarkup, this.classMap.get(strClass));
        } else {
            return objectToString(new VetappElement(), strMarkup, VetappElement.class);
        }
    }
    private IVetappElement getElementById(String strClass, String strId, String researchTerm) {
        if (this.classMap.get(strClass) != null) {
            List<IVetappElement> l = new ArrayList<>();
            if (strClass.equals("appointment")) {
                try {
                    Date date = (new SimpleDateFormat("yyyy-MM-dd'T'HH:mm")).parse(strId);
                    l = vetappElementRepository.findAppointmentByDate_Patient(date, Integer.parseInt(researchTerm));
                } catch (Exception e) {}
            } else if(strClass.equals("customer") && researchTerm != null) {
                try {
                    l = vetappElementRepository.findCustomerByPatient(Integer.parseInt(researchTerm));
                } catch (Exception e) {}
            } else if(strClass.equals("room") && researchTerm != null){
                l = vetappElementRepository.findRoomByName(researchTerm);
            } else if(strClass.equals("breed") && researchTerm != null){
                l = vetappElementRepository.findBreedsByType(Integer.parseInt(researchTerm));
            }
            else {
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
                                     @PathVariable(value="incomplete_name", required=false) String strIncompleteName,
                                     HttpServletRequest request) {
        VetappElements l = this.getElements(strClass, strIncompleteName, request);
        if (l != null) {
            return objectToString(l, strMarkup, this.classMap.get(strClass));
        } else {
            return objectToString(new VetappElements(), strMarkup, VetappElement.class);
        }
    }
    private VetappElements getElements(String strClass, String strIncompleteName, HttpServletRequest request) {
        if (strClass.equals("appointment") && request.getParameter("date") != null) {
            strIncompleteName = request.getParameter("date");
        }
        if (strClass.equals("appointment") && strIncompleteName != null) {
            try {
                Date start = (new SimpleDateFormat("yyyy-MM-dd")).parse(strIncompleteName);
                Calendar cal = Calendar.getInstance();
                cal.setTime(start);
                cal.add(Calendar.DATE, 1);
                Date end = cal.getTime();
                return new VetappElements(this.vetappElementRepository.findAppointmentsInInterval(start, end));
            } catch (Exception e) {}
        } else if (strClass.equals("appointment") && request.getParameter("patient") != null) {
            try {
                return new VetappElements(this.vetappElementRepository.findAppointmentsByPatient(Integer.parseInt(request.getParameter("patient"))));
            } catch (Exception e) {}
        } else if (strClass.equals("patient") && request.getParameter("customer") != null) {
            try {
                return new VetappElements(this.vetappElementRepository.findPatientsByCustomer(Integer.parseInt(request.getParameter("customer"))));
            } catch (Exception e) {}
        } else if (this.classMap.get(strClass) != null) {
            return new VetappElements(strIncompleteName != null ? this.vetappElementRepository.findByIncompleteName(classMap.get(strClass), strIncompleteName) : this.vetappElementRepository.findAll(this.classMap.get(strClass)));
        }
        return null;
    }
}
