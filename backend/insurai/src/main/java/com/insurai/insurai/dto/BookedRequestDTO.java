package com.insurai.insurai.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class BookedRequestDTO {
    private Integer availabilityId;
    private String clientId;
    private String clientName;
    private String email;
    private String phone;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private String status;

    // Constructors
    public BookedRequestDTO() {}

    public BookedRequestDTO(Integer availabilityId, String clientId, String clientName, String email, String phone, LocalDate date, LocalTime startTime, LocalTime endTime, String status) {
        this.availabilityId = availabilityId;
        this.clientId = clientId;
        this.clientName = clientName;
        this.email = email;
        this.phone = phone;
        this.date = date;
        this.startTime = startTime;
        this.endTime = endTime;
        this.status = status;
    }

    // Getters and Setters
    public Integer getAvailabilityId() { return availabilityId; }
    public void setAvailabilityId(Integer availabilityId) { this.availabilityId = availabilityId; }

    public String getClientId() { return clientId; }
    public void setClientId(String clientId) { this.clientId = clientId; }

    public String getClientName() { return clientName; }
    public void setClientName(String clientName) { this.clientName = clientName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }

    public LocalTime getEndTime() { return endTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
