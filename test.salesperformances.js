// TEST
// Add api route for adding / removing salesperformance entries
/*
    URLs:
        /api/salesperformance/increase/:performance_name?username=<username>
        /api/salesperformance/decrease:performance_name?username=<username>
        /api/salesperformance/weekly?username=<username>
        /api/salesperformance/monthly?username=<username>
        /api/salesperformance/yearly?username=<username>
            ->  all of these get requests need to contain a token in the request.
                This token needs to be from an admin or from the loggedin user
                The slaesperformance database object is then queried by the username url param.
                It needs to be checked if the username url param is from the same user as the token is, if the token is NOT an admin token

                The weekly monthly yearly routes can then be filtered with the performances array which contains an object with a date property
*/
