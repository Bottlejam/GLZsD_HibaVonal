using Microsoft.AspNetCore.Mvc;

namespace ErrorLine.Exceptions
{
    public class DormitoryNotFoundException : BaseApiException
    {
        public DormitoryNotFoundException() : base(404, "Dormitory not found.")
        {
        }
    }
    public class DormitoryWithThisAddressAlereadyExistsException : BaseApiException
    {
        public DormitoryWithThisAddressAlereadyExistsException() : base(403, "Dormitary with this address already exists .")
        {
        }
    }
}
