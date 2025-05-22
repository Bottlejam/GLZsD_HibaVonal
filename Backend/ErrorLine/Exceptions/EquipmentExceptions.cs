namespace ErrorLine.Exceptions
{
    public class EquipmentNotFoundException:BaseApiException
    {
        public EquipmentNotFoundException() : base(404, "Equipment not found.")
        {
        }
    }
    public class EquipmentNotInYourDormitaryException : BaseApiException
    {
        public EquipmentNotInYourDormitaryException() : base(403, "Equipment is not in your dormitary.")
        {
        }
    }
}
