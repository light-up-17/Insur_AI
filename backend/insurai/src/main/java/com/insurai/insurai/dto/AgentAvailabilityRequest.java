package com.insurai.insurai.dto;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public class AgentAvailabilityRequest {
    private String agentId;
    private LocalDate availabilityDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private String recurring;
    private String status;
    private String notes;
    private List<BreakRequest> breaks;

    public String getAgentId() {
        return agentId;
    }

    public void setAgentId(String agentId) {
        this.agentId = agentId;
    }

    public LocalDate getAvailabilityDate() {
        return availabilityDate;
    }

    public void setAvailabilityDate(LocalDate availabilityDate) {
        this.availabilityDate = availabilityDate;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }

    public String getRecurring() {
        return recurring;
    }

    public void setRecurring(String recurring) {
        this.recurring = recurring;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public List<BreakRequest> getBreaks() {
        return breaks;
    }

    public void setBreaks(List<BreakRequest> breaks) {
        this.breaks = breaks;
    }

    public static class BreakRequest {
        private LocalTime breakStart;
        private LocalTime breakEnd;

        public LocalTime getBreakStart() {
            return breakStart;
        }

        public void setBreakStart(LocalTime breakStart) {
            this.breakStart = breakStart;
        }

        public LocalTime getBreakEnd() {
            return breakEnd;
        }

        public void setBreakEnd(LocalTime breakEnd) {
            this.breakEnd = breakEnd;
        }
    }
}