namespace ErrorLine.Dtos
{
    public class DormitoryDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
    }
    public class CreateDormitoryDto
    {
        public string Name { get; set; }
        public string Address { get; set; }
    }
    public class UpdateDormitoryDto
    {
        public string Name { get; set; }
        public string Address { get; set; }
    }
}
