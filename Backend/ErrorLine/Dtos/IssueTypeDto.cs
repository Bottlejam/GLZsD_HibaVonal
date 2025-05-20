namespace ErrorLine.Dtos
{
    public class IssueTypeDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }
    public class CreateIssueTypeDto
    {
       
        public string Name { get; set; }
    }
    public class UpdateIssueTypeDto
    {

        public string Name { get; set; }
    }

}
