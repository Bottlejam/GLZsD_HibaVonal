namespace ErrorLine.Exceptions
{
    public class IssueReportNotFoundException:BaseApiException
    {
        public IssueReportNotFoundException() : base(404, "Issuereport not found.")
        {
        }
       
    }
    public class NotNewIssueReportException : BaseApiException
    {
        public NotNewIssueReportException() : base(400, "The issuereport is not new.")
        {
        }

    }
    public class NotOwnIssueReportException : BaseApiException
    {
        public NotOwnIssueReportException() : base(403, "You can only manage your Issuereports.")
        {
        }

    }
    public class IssueReportNotCompletedException : BaseApiException
    {
        public IssueReportNotCompletedException() : base(400, "The issuereport is not completed, or validated already.")
        {
        }

    }
    public class IssueReportCompletedOrValidatedOrClosedException : BaseApiException
    {
        public IssueReportCompletedOrValidatedOrClosedException() : base(400, "The issuereport is completed, or validated already.")
        {
        }

    }
    public class WorkerAssignedAlreadyForIssueException : BaseApiException
    {
        public WorkerAssignedAlreadyForIssueException() : base(400, "A worker has been assigned for this issue already.")
        {
        }

    }
    public class ChangeIssueStatusToSameException : BaseApiException
    {
        public ChangeIssueStatusToSameException() : base(400, "The issuestatus is already in this state.")
        {
        }

    }
    public class IssueReportIsNotAssignedForToException : BaseApiException
    {
        public IssueReportIsNotAssignedForToException() : base(403, "This issue has not been assigned to you.")
        {
        }

    }
    public class IssueStatusIsNotInProgressException : BaseApiException
    {
        public IssueStatusIsNotInProgressException() : base(400, "This issue is not in progress.")
        {
        }

    }
    public class IssueTypeNotFoundException : BaseApiException
    {
        public IssueTypeNotFoundException() : base(404, "IssueType not found")
        {
        }

    }



}
