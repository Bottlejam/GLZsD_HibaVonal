namespace ErrorLine.Exceptions
{
    public class InvalidCredentialsException : BaseApiException
    {
        public InvalidCredentialsException() : base(403, "Invalid Credentials.")
        {
        }
    }
    public class UserNotFoundException : BaseApiException
    {
        public UserNotFoundException() : base(404, "User Not found.")
        {
        }
    }
    public class UserIsNotMaintenanceWorker : BaseApiException
    {
        public UserIsNotMaintenanceWorker() : base(400, "This user is not a maintenance worker.")
        {
        }
    }
    public class UserIsNotInSameDormitaryAsIssueReportException : BaseApiException
    {
        public UserIsNotInSameDormitaryAsIssueReportException() : base(403, "This user is not in the same dormitary as the issuereport.")
        {
        }
    }
    public class UserIsNotInSameDormitaryAsYouException : BaseApiException
    {
        public UserIsNotInSameDormitaryAsYouException() : base(403, "This user is not in the same dormitary as you.")
        {
        }
    }

}
