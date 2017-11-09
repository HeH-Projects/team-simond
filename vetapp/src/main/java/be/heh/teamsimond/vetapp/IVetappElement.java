package be.heh.teamsimond.vetapp;

import java.util.List;
import java.util.Map;

public interface IVetappElement {
    public static IVetappElement generate(Map<String, String[]> parameters){return null;}
    public List<String> update(Map<String, String[]> parameters);
}
