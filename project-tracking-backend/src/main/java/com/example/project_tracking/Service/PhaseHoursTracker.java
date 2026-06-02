package com.example.project_tracking.Service;

import com.example.project_tracking.Model.Project;

import java.math.BigDecimal;
import java.util.Optional;

/**
 * PhaseHoursTracker — ADDITIVE phase production-hours tracker.
 *
 * ── What this does ────────────────────────────────────────────────────────
 * Tracks submitted work hours into phase-specific production-hours buckets
 * (IFA / IFC / REIFA / REIFC) on the Project entity.
 *
 * ── What this does NOT touch ─────────────────────────────────────────────
 * The existing tracking fields:
 *   modellingTime / checkingTime / detailingTime / studyHoursTracking
 *   workingHours / extraHoursTracking
 * are managed entirely by WorkDetailsService.updateProjectWorkingHours().
 * This class never reads or writes those fields. Zero interference.
 *
 * ── Call contract ────────────────────────────────────────────────────────
 * Call PhaseHoursTracker.track(project, hours) AFTER
 * updateProjectWorkingHours() has already returned successfully.
 * The caller (WorkDetailsService) is responsible for projectRepository.save()
 * after this method returns, to persist the phase-field changes.
 *
 * ── Business logic ────────────────────────────────────────────────────────
 * 1. Resolve project.projectActivityStatus → ProjectPhase enum.
 *    If null / unknown status → return silently (no-op). This covers projects
 *    that pre-date the IFA/IFC/REIFA/REIFC workflow; they are unaffected.
 *
 * 2. If prodHours + submitted <= givenHours → add to prodHours.
 *
 * 3. If budget exceeded:
 *    a. Fill prodHours up to givenHours.
 *    b. Compute overflow = submitted - (givenHours - current prodHours).
 *    c. Check AGM approval: extraHours field must NOT be null.
 *    d. Check overflow fits within extraHours budget.
 *    e. If both checks pass → add overflow to extraProdHours.
 *    f. Otherwise → throw RuntimeException with clear message.
 *
 * ── Strategy pattern ─────────────────────────────────────────────────────
 * PhaseAccessor bundles all getters/setters for one phase as lambdas.
 * The tracking algorithm is written exactly once. Adding a new phase
 * (e.g. RE-REIFC) requires only a new case in accessorFor().
 */
public final class PhaseHoursTracker {

    private PhaseHoursTracker() {} // utility class — no instantiation

    // ── functional interfaces ─────────────────────────────────────────────

    @FunctionalInterface
    interface BD_Getter  { BigDecimal get(Project p); }

    @FunctionalInterface
    interface BD_Setter  { void set(Project p, BigDecimal v); }

    /**
     * All four field accessors for a single phase, in one object.
     */
    private static final class PhaseAccessor {
        final String     label;
        final BD_Getter  givenHours;
        final BD_Getter  extraHours;       // null value = no AGM approval
        final BD_Getter  prodHours;
        final BD_Setter  setProdHours;
        final BD_Getter  extraProdHours;
        final BD_Setter  setExtraProdHours;

        PhaseAccessor(String label,
                      BD_Getter givenHours,
                      BD_Getter extraHours,
                      BD_Getter prodHours,
                      BD_Setter setProdHours,
                      BD_Getter extraProdHours,
                      BD_Setter setExtraProdHours) {
            this.label            = label;
            this.givenHours       = givenHours;
            this.extraHours       = extraHours;
            this.prodHours        = prodHours;
            this.setProdHours     = setProdHours;
            this.extraProdHours   = extraProdHours;
            this.setExtraProdHours = setExtraProdHours;
        }
    }

    // ── phase registry ────────────────────────────────────────────────────

    /**
     * Returns the accessor bundle for the given phase string.
     * Returns null for unrecognised / blank values (caller treats as no-op).
     */
    private static PhaseAccessor accessorFor(String rawStatus) {
        if (rawStatus == null || rawStatus.isBlank()) return null;

        switch (rawStatus.trim().toUpperCase()) {

            case "IFA":
                return new PhaseAccessor(
                        "IFA",
                        Project::getIfaGivenHours,
                        Project::getIfaExtraHours,
                        Project::getIfaProdHours,
                        Project::setIfaProdHours,
                        Project::getIfaExtraProdHours,
                        Project::setIfaExtraProdHours
                );

            case "IFC":
                return new PhaseAccessor(
                        "IFC",
                        Project::getIfcGivenHours,
                        Project::getIfcExtraHours,
                        Project::getIfcProdHours,
                        Project::setIfcProdHours,
                        Project::getIfcExtraProdHours,
                        Project::setIfcExtraProdHours
                );

            case "REIFA":
                return new PhaseAccessor(
                        "REIFA",
                        Project::getIfaGivenHours,
                        Project::getIfaExtraHours,
                        Project::getIfaProdHours,
                        Project::setIfaProdHours,
                        Project::getIfaExtraProdHours,
                        Project::setIfaExtraProdHours
                );

            case "REIFC":
                return new PhaseAccessor(
                        "REIFC",
                        Project::getIfcGivenHours,
                        Project::getIfcExtraHours,
                        Project::getIfcProdHours,
                        Project::setIfcProdHours,
                        Project::getIfcExtraProdHours,
                        Project::setIfcExtraProdHours
                );

            default:
                return null; // unknown status — safe no-op
        }
    }

    // ── public API ────────────────────────────────────────────────────────

    /**
     * Main entry point. Called after updateProjectWorkingHours() returns.
     *
     * @param project   the Project entity (already mutated by existing tracking).
     *                  Caller must call projectRepository.save(project) afterwards.
     * @param submitted the work hours just submitted (positive, already validated
     *                  by the existing flow)
     */
    public static void track(Project project, double submitted) {
        PhaseAccessor a = accessorFor(project.getProjectActivityStatus());

        // Unknown / null phase → existing tracking already ran; nothing more to do.
        if (a == null) return;

        BigDecimal hrs        = BigDecimal.valueOf(submitted);
        BigDecimal given      = safe(a.givenHours.get(project));
        BigDecimal currentProd = safe(a.prodHours.get(project));

        // ── Case 1: within phase budget ───────────────────────────────────
        if (currentProd.add(hrs).compareTo(given) <= 0) {
            a.setProdHours.set(project, currentProd.add(hrs));
            return;
        }

        // ── Case 2: phase budget exceeded ─────────────────────────────────

        // Fill the normal prod bucket up to its limit
        a.setProdHours.set(project, given);

        // How many hours overflowed?
        BigDecimal normalConsumed = given.subtract(currentProd).max(BigDecimal.ZERO);
        BigDecimal overflow       = hrs.subtract(normalConsumed);

        // AGM approval check: extraHours field must not be null
        BigDecimal approvedExtra = a.extraHours.get(project);
        if (approvedExtra == null) {
            throw new RuntimeException(
                    "Phase " + a.label + " budget exceeded. " +
                    "AGM approval (extra hours allocation) is required before " +
                    "additional hours can be logged against this phase."
            );
        }

        // Extra budget capacity check
        BigDecimal currentExtra = safe(a.extraProdHours.get(project));
        BigDecimal newExtra     = currentExtra.add(overflow);
        if (newExtra.compareTo(approvedExtra) > 0) {
            throw new RuntimeException(
                    "Phase " + a.label + " extra-hours budget also exceeded. " +
                    "Approved extra budget: " + approvedExtra + " hrs, " +
                    "already used: " + currentExtra + " hrs, " +
                    "attempted overflow: " + overflow + " hrs. " +
                    "Please request additional AGM approval."
            );
        }

        // All checks passed — record overflow in extra prod bucket
        a.setExtraProdHours.set(project, newExtra);
    }

    // ── helper ────────────────────────────────────────────────────────────

    private static BigDecimal safe(BigDecimal v) {
        return Optional.ofNullable(v).orElse(BigDecimal.ZERO);
    }
}
