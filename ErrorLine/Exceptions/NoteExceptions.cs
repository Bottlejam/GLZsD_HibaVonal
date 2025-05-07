namespace ErrorLine.Exceptions
{
    public class NoteNotFoundException:BaseApiException
    {
        public NoteNotFoundException() : base(404, "Note not found.")
        {
        }

    }
    public class NoteIsNotYoursException : BaseApiException
    {
        public NoteIsNotYoursException() : base(403, "Note is not yours.")
        {
        }

    }
    public class NoteIsNotYourDormitaryException : BaseApiException
    {
        public NoteIsNotYourDormitaryException() : base(403, "Note is not in your dormitary.")
        {
        }

    }
}
