package meia.challenges.challenge1.facts;

/**
 * Processing status for a Fact or action in the rules domain.
 */
public enum Status {
    /** Not yet started */
    NOT_STARTED,
    /** Currently in progress */
    STARTED,
    /** Completed successfully */
    SUCCESSFUL,
    /** Completed with failure */
    FAILED
}
