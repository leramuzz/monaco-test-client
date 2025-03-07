package com.example;

public class Car {
    private String model;
    private int age;

    public Car(String model, int age) {
        this.model = model;
        this.age = age;
    }

    public String getModel() {
        return this.model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public int getAge() {
        return this.age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public boolean isOldtimer() {
        return this.age >= 30;
    }
}