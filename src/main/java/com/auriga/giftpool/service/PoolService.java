package com.auriga.giftpool.service;

import com.auriga.giftpool.model.Models.*;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class PoolService {
    private String title = "Manager Farewell Gift";
    private double targetAmount = 6000.0;
    private final List<String> members = new ArrayList<>(Arrays.asList("Amit", "Rohit", "Sneha", "Karan", "Pooja", "Vikas"));
    private final List<Contribution> contributions = new ArrayList<>(Arrays.asList(
            new Contribution("GP-101", "Amit", "amit@example.com", "9876543210", 2000.0, "Covering for Vikas", "10:15 AM"),
            new Contribution("GP-102", "Rohit", "rohit@example.com", "9876543211", 1000.0, "Paid full share", "10:30 AM"),
            new Contribution("GP-103", "Sneha", "sneha@example.com", "9876543212", 500.0, "Partial share", "11:00 AM"),
            new Contribution("GP-104", "Pooja", "pooja@example.com", "9876543213", 1000.0, "Paid full share", "11:15 AM")
    ));
    private final List<EmailLog> sentEmails = new ArrayList<>();

    public PoolResponse getPoolDetails() {
        double totalCollected = contributions.stream().mapToDouble(Contribution::getAmount).sum();
        double shortfall = Math.max(0, targetAmount - totalCollected);
        double fairShare = members.isEmpty() ? 0 : (targetAmount / members.size());

        Map<String, Double> paidMap = new HashMap<>();
        for (String m : members) paidMap.put(m, 0.0);
        for (Contribution c : contributions) {
            paidMap.put(c.getMember(), paidMap.getOrDefault(c.getMember(), 0.0) + c.getAmount());
        }

        List<MemberBreakdown> breakdowns = new ArrayList<>();
        List<Map.Entry<String, Double>> debtors = new ArrayList<>();
        List<Map.Entry<String, Double>> creditors = new ArrayList<>();

        for (String m : members) {
            double paid = paidMap.get(m);
            double balance = paid - fairShare;
            String status = balance > 0.5 ? "Surplus" : (balance < -0.5 ? "Deficit" : "Settled");
            breakdowns.add(new MemberBreakdown(m, paid, Math.round(fairShare), Math.round(balance), status));

            if (balance < -0.01) debtors.add(new AbstractMap.SimpleEntry<>(m, -balance));
            else if (balance > 0.01) creditors.add(new AbstractMap.SimpleEntry<>(m, balance));
        }

        debtors.sort((a, b) -> Double.compare(b.getValue(), a.getValue()));
        creditors.sort((a, b) -> Double.compare(b.getValue(), a.getValue()));

        List<Settlement> settlements = new ArrayList<>();
        int d = 0, c = 0;
        while (d < debtors.size() && c < creditors.size()) {
            double settle = Math.min(debtors.get(d).getValue(), creditors.get(c).getValue());
            settlements.add(new Settlement(debtors.get(d).getKey(), creditors.get(c).getKey(), Math.round(settle)));

            debtors.get(d).setValue(debtors.get(d).getValue() - settle);
            creditors.get(c).setValue(creditors.get(c).getValue() - settle);

            if (debtors.get(d).getValue() < 0.01) d++;
            if (creditors.get(c).getValue() < 0.01) c++;
        }

        List<Contribution> recent = new ArrayList<>(contributions);
        Collections.reverse(recent);

        return new PoolResponse(title, targetAmount, totalCollected, shortfall, Math.round(fairShare), breakdowns, settlements, recent, sentEmails);
    }

    public void addMember(String name) {
        if (name != null && !name.trim().isEmpty() && !members.contains(name.trim())) {
            members.add(name.trim());
        }
    }

    public Contribution addContribution(String member, String email, String phone, double amount, String note) {
        String time = new SimpleDateFormat("hh:mm a").format(new Date());
        String receiptId = "GP-" + (int)(Math.random() * 900000 + 100000);
        
        Contribution c = new Contribution(receiptId, member, email, phone, amount, (note == null || note.isEmpty()) ? "Contribution recorded" : note, time);
        contributions.add(c);

        String targetEmail = (email != null && !email.isEmpty()) ? email : member.toLowerCase() + "@company.com";
        String emailBody = String.format("Hello %s,\n\nWe have received your contribution of ₹%.2f towards '%s'.\nReceipt ID: %s.\nTimestamp: %s.\n\nThank you for contributing!\nGiftPool Notification System", 
                member, amount, title, receiptId, time);
        
        sentEmails.add(0, new EmailLog(targetEmail, "🎉 Payment Receipt & Confirmation - " + title, emailBody, time));
        return c;
    }

    public void updatePool(String title, Double targetAmount) {
        if (title != null && !title.isEmpty()) this.title = title;
        if (targetAmount != null && targetAmount >= 0) this.targetAmount = targetAmount;
    }
}