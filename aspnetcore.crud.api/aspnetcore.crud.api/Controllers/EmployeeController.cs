using aspnetcore.crud.api.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace aspnetcore.crud.api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private readonly ApplicationDbContext _applicationDbContext;

        public EmployeeController(ApplicationDbContext applicationDbContext)
        {
            _applicationDbContext = applicationDbContext;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Employee>>> GetEmployess() 
        {
            if (_applicationDbContext.Employees == null)
            {
                return NotFound();
            }
            return await _applicationDbContext.Employees.ToListAsync();
        }
        
        [HttpGet("{id}")]
        public async Task<ActionResult<Employee>> GetEmployess(int id)
        {

            var employee = await _applicationDbContext.Employees.FindAsync(id);

            if (employee == null) { return NotFound(); }

            return employee;
        }

        [HttpPost]
        public async Task<ActionResult<Employee>> PostEmployee(Employee employee)
        { 
            _applicationDbContext.Employees.Add(employee);
            await _applicationDbContext.SaveChangesAsync();
            return Ok(employee);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> PutEmployee(int id, Employee employee) 
        {

            if (id != employee.Id)
            {
                return BadRequest();
            }

            _applicationDbContext.Entry(employee).State = EntityState.Modified;

            try
            {
                await _applicationDbContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteEmployee(int id)
        {
            var employee = await _applicationDbContext.Employees.FindAsync(id);

            if (employee == null) { return NotFound(); }

            _applicationDbContext.Employees.Remove(employee);

            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }
    }
}
