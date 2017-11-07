package be.heh.teamsimond.vetapp;

import javax.xml.bind.annotation.XmlAnyElement;
import javax.xml.bind.annotation.XmlRootElement;
import java.util.List;

@XmlRootElement
public class VetappElements {
    @XmlAnyElement(lax=true)
    private List<IVetappElement> elements;
    public VetappElements() {}
    public VetappElements(List<IVetappElement> l) {
        this.elements = l;
    }
}
