package com.example.project_tracking.DTO.Scheduler;

import com.example.project_tracking.Model.LeaveBalance;
import com.example.project_tracking.Repository.LeaveBalanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import java.time.LocalDate;
import java.util.List;

@Component
public class LeaveResetScheduler {

    @Autowired
    private LeaveBalanceRepository leaveBalanceRepo;

    @Scheduled(cron = "0 0 0 1 1 *") // Every Jan 1st at 00:00
    public void resetLeaves() {
        int nextYear = LocalDate.now().getYear();
        List<LeaveBalance> balances = leaveBalanceRepo.findAll();

        for (LeaveBalance lb : balances) {
            lb.setCasualLeaves(12);
            lb.setSickLeaves(8);
            lb.setYear(nextYear);
        }

        leaveBalanceRepo.saveAll(balances);
    }
}

