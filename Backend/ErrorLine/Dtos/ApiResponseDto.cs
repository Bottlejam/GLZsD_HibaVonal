using static System.Runtime.InteropServices.JavaScript.JSType;

namespace ErrorLine.Dtos
{
    public class ApiResponseDto<T>
    {
        public int StatusCode { get; set; }
        public string Message { get; set; }
        public T Data { get; set; }

        public ApiResponseDto(int statusCode, string message, T data = default)
        {
            StatusCode = statusCode;
            Message = message;
            Data = data;
        }
    }
}
