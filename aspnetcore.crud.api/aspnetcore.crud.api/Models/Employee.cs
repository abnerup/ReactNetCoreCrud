namespace aspnetcore.crud.api.Models
{
    public class Employee
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Age { get; set; } = string.Empty;
        public int IsActive { get; set; }
    }
}
