@ticketsearch @hwpc
Feature: Scenarios related to search tickets

    Background:
        Given user is on tickets page

    @regression @sanity @validSearch @web
    Scenario Outline: Search for a ticket
        When the user searches for ticket "<ticket>"
        Then user should see "<ticket>" ticket displayed on search result
        And the search interface should be responsive
        Examples:
            | ticket |
            | Alan   |
            | Mark   |

    @regression @invalidSearch @web
    Scenario: Search with invalid ticket
        When the user searches for ticket "invalid_ticket_xyz123"
        Then user should see a ticket search result message as "No tickets found matching your search criteria."

    @mobile @responsive @validSearch @web
    Scenario Outline: Search for tickets on mobile viewport
        Given user is on tickets page with "mobile" viewport
        When the user searches for ticket "<ticket>"
        Then user should see "<ticket>" ticket displayed on search result
        And user should see search results in mobile-friendly format
        And the search should complete within 10 seconds
        Examples:
            | ticket |
            | Alan   |
            | Mark   |

    @tablet @responsive @validSearch @web
    Scenario: Search for tickets on tablet viewport
        Given user is on tickets page with "tablet" viewport
        When the user searches for ticket "Alan"
        Then user should see "Alan" ticket displayed on search result
        And the search interface should be responsive

    @desktop @responsive @validSearch @web
    Scenario: Search for tickets on desktop viewport
        Given user is on tickets page with "desktop" viewport
        When the user searches for ticket "Mark"
        Then user should see "Mark" ticket displayed on search result
        And user should see 1 or more search results

    @mobile @invalidSearch @web
    Scenario: Search with invalid ticket on mobile
        Given user is on tickets page with "mobile" viewport
        When the user searches for ticket "nonexistent_ticket_mobile"
        Then user should see a ticket search result message as "No tickets found matching your search criteria."
        And user should see search results in mobile-friendly format

    @regression @errorHandling @web
    Scenario: Retry search after initial failure
        Given user is on tickets page
        When the user searches for ticket "Alan"
        And the user retries searching for ticket "Alan"
        Then user should see "Alan" ticket displayed on search result

    @sanity @performance @web
    Scenario: Search performance verification
        Given user is on tickets page
#        And I pause for debugging
        When the user searches for ticket "Mark"
        Then the search should complete within 5 seconds
        And user should see "Mark" ticket displayed on search result

    @mobile @navigation @web
    Scenario: Mobile navigation and search
        Given user is on tickets page with "mobile" viewport
        When the user opens mobile navigation menu
        And the user searches for ticket "Alan"
        Then user should see "Alan" ticket displayed on search result
        And user should see search results in mobile-friendly format