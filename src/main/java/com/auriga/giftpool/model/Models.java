package com.auriga.giftpool.model;

import java.util.List;

public class Models {

    public static class Contribution {
        private String id;
        private String member;
        private String email;
        private String phone;
        private double amount;
        private String note;
        private String timestamp;

        public Contribution() {}
        public Contribution(String id, String member, String email, String phone, double amount, String note, String timestamp) {
            this.id = id;
            this.member = member;
            this.email = email;
            this.phone = phone;
            this.amount = amount;
            this.note = note;
            this.timestamp = timestamp;
        }
        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getMember() { return member; }
        public void setMember(String member) { this.member = member; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
        public double getAmount() { return amount; }
        public void setAmount(double amount) { this.amount = amount; }
        public String getNote() { return note; }
        public void setNote(String note) { this.note = note; }
        public String getTimestamp() { return timestamp; }
        public void setTimestamp(String timestamp) { this.timestamp = timestamp; }
    }

    public static class EmailLog {
        private String to;
        private String subject;
        private String body;
        private String timestamp;

        public EmailLog(String to, String subject, String body, String timestamp) {
            this.to = to;
            this.subject = subject;
            this.body = body;
            this.timestamp = timestamp;
        }
        public String getTo() { return to; }
        public String getSubject() { return subject; }
        public String getBody() { return body; }
        public String getTimestamp() { return timestamp; }
    }

    public static class Settlement {
        private String from;
        private String to;
        private double amount;

        public Settlement(String from, String to, double amount) {
            this.from = from;
            this.to = to;
            this.amount = amount;
        }
        public String getFrom() { return from; }
        public String getTo() { return to; }
        public double getAmount() { return amount; }
    }

    public static class MemberBreakdown {
        private String member;
        private double paid;
        private double fairShare;
        private double balance;
        private String status;

        public MemberBreakdown(String member, double paid, double fairShare, double balance, String status) {
            this.member = member;
            this.paid = paid;
            this.fairShare = fairShare;
            this.balance = balance;
            this.status = status;
        }
        public String getMember() { return member; }
        public double getPaid() { return paid; }
        public double getFairShare() { return fairShare; }
        public double getBalance() { return balance; }
        public String getStatus() { return status; }
    }

    public static class PoolResponse {
        private String title;
        private double targetAmount;
        private double totalCollected;
        private double shortfall;
        private double fairShare;
        private List<MemberBreakdown> breakdown;
        private List<Settlement> settlements;
        private List<Contribution> history;
        private List<EmailLog> sentEmails;

        public PoolResponse(String title, double targetAmount, double totalCollected, double shortfall, 
                            double fairShare, List<MemberBreakdown> breakdown, 
                            List<Settlement> settlements, List<Contribution> history, List<EmailLog> sentEmails) {
            this.title = title;
            this.targetAmount = targetAmount;
            this.totalCollected = totalCollected;
            this.shortfall = shortfall;
            this.fairShare = fairShare;
            this.breakdown = breakdown;
            this.settlements = settlements;
            this.history = history;
            this.sentEmails = sentEmails;
        }
        public String getTitle() { return title; }
        public double getTargetAmount() { return targetAmount; }
        public double getTotalCollected() { return totalCollected; }
        public double getShortfall() { return shortfall; }
        public double getFairShare() { return fairShare; }
        public List<MemberBreakdown> getBreakdown() { return breakdown; }
        public List<Settlement> getSettlements() { return settlements; }
        public List<Contribution> getHistory() { return history; }
        public List<EmailLog> getSentEmails() { return sentEmails; }
    }
}