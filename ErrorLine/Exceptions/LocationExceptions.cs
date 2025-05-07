namespace ErrorLine.Exceptions
{
    public class LocationNotFoundException:BaseApiException
    {
        public LocationNotFoundException() : base(404, "Location not found.")
        {
        }
    }
    public class LocationNotInYourDormitaryException : BaseApiException
    {
        public LocationNotInYourDormitaryException() : base(403, "Location is not in your dormitary.")
        {
        }
    }
    public class LocationAlreadyExistsException : BaseApiException
    {
        public LocationAlreadyExistsException() : base(403, "Location is already exists in your dormitary.")
        {
        }
    }
}
