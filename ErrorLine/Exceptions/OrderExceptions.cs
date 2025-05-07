namespace ErrorLine.Exceptions
{
    public class OrderNotFoundException : BaseApiException
    {
        public OrderNotFoundException() : base(404, "The order not found.")
        {
        }
    }
    public class OrderEmptyException:BaseApiException
    {
        public OrderEmptyException() : base(400, "The order is empty.")
        {
        }
    }
    public class InvalidQuantityException : BaseApiException
    {
        public InvalidQuantityException() : base(400, "The quantity is invalid.")
        {
        }
    }
    public class OrderNotInSameDormitaryAsYouException : BaseApiException
    {
        public OrderNotInSameDormitaryAsYouException() : base(403, "The order is not in the same dormitary as you")
        {
        }
    }
    public class OrderStatusIsNotPendingException : BaseApiException
    {
        public OrderStatusIsNotPendingException() : base(400, "The order is not in pending state.")
        {
        }
    }
}
