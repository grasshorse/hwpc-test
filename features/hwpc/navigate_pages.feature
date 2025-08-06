Feature: Scenarios related to page navigation

    Background:
        Given user is on baseurl

    @regression @sanity @webnavigation
    Scenario Outline: Search for a ticket
        When the user clicks "<page>"
        Then user should be on "<page>" 
        And the search interface should be responsive
        Examples:
            | page |
            | tickets   |
            | customers  |
            | routes   |
            | reports  |
            | dashboard |
