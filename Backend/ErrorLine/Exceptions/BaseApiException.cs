namespace ErrorLine.Exceptions
{
    public class BaseApiException : Exception
    {
        public int StatusCode { get; set; }
        public string CustomMessage { get; set; }
        public BaseApiException(int statusCode, string message)
      : base(message)
        {
            StatusCode = statusCode;
            CustomMessage = message;
        }
    }
}
