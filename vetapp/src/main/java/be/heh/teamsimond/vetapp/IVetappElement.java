package be.heh.teamsimond.vetapp;

import java.util.Map;

public interface IVetappElement {
    public static IVetappElement generate(Map<String, String[]> parameters){return null;}
    public void update(Map<String, String[]> parameters);
}
