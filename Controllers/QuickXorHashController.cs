using System.Buffers;

using Microsoft.AspNetCore.Mvc;

namespace QuickXorHash.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class QuickXorHashController : ControllerBase
    {
        [HttpPost]
        [RequestSizeLimit(100_000_000)]
        public async Task<IActionResult> GetHash()
        {
            var dataToHash = await Request.BodyReader.ReadAsync();
            
            var quickXorHash = new QuickXorHash();
            var memoryStream = new MemoryStream(dataToHash.Buffer.ToArray());

            var hashBytes = await quickXorHash.ComputeHashAsync(memoryStream);
            var hashString = Convert.ToBase64String(hashBytes);

            return Ok(hashString);
        }
    }
}
