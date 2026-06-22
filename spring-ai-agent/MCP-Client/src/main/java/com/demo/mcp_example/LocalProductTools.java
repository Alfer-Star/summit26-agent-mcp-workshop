package com.demo.mcp_example;

import org.springframework.ai.tool.annotation.Tool;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LocalProductTools {

    public record LocalProduct(String id, String name, double price, String description) {}

    @Tool(description = "Gibt eine Liste verfügbarer Produkte zurück (Testdaten)")
    public List<LocalProduct> getProductList() {
        return List.of(
                new LocalProduct("P001", "Laptop Pro 15",    1299.99, "Leistungsstarker Laptop für Profis"),
                new LocalProduct("P002", "Wireless Mouse",     29.99, "Ergonomische kabellose Maus"),
                new LocalProduct("P003", "USB-C Hub",          49.99, "7-in-1 USB-C Hub mit HDMI und SD-Kartenleser"),
                new LocalProduct("P004", "Mechanical Keyboard",149.99, "Mechanische Tastatur mit RGB-Beleuchtung"),
                new LocalProduct("P005", "Monitor 27\"",      399.99, "4K-Monitor mit IPS-Panel")
        );
    }
}
