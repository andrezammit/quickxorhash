using System.Buffers;
using System.IO.Pipelines;

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
            ReadResult readResult;

            do
            {
                readResult = await Request.BodyReader.ReadAsync();
                Request.BodyReader.AdvanceTo(readResult.Buffer.Start, readResult.Buffer.End);
            }
            while (!readResult.IsCompleted);

            var quickXorHash = new QuickXorHash();
            var memoryStream = new MemoryStream(readResult.Buffer.ToArray());

            var hashBytes = await quickXorHash.ComputeHashAsync(memoryStream);
            var hashString = Convert.ToBase64String(hashBytes);

            return Ok(hashString);
        }
    }
}
