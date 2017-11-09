package be.heh.teamsimond.vetapp.JPA;

import be.heh.teamsimond.vetapp.IVetappElement;

import javax.xml.bind.annotation.XmlRootElement;
import java.util.List;
import java.util.Map;

@XmlRootElement
public class VetappElement implements IVetappElement {
    public List<String> update(Map<String, String[]> parameters) { return null; }
}
