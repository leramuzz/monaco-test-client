package com.example;

public class Main {
    public static void main(String[] args) {
        Car myCar = new Car("BMW", 12);
        boolean isOldtimer = myCar.isOldtimer();
        System.out.println("Is my car an oldtimer? " + isOldtimer);
    }
}