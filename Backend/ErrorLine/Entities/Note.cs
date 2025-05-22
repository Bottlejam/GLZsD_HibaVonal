namespace ErrorLine.Entities
{
    
        public class Note
        {
            public int Id { get; set; }
            public string Text { get; set; }  
            public int IssueReportId { get; set; } 
            public IssueReport IssueReport { get; set; }
            public DateTime CreatedAt { get; set; }
            public int CreatedById { get; set; }
            public User CreatedBy { get; set; }
         }
    
}
