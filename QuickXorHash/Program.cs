using Microsoft.AspNetCore.HttpLogging;

using AndreZammit.Tracing;

TracingProvider.Init(Directory.GetCurrentDirectory(), "QuickXorHash");

var builder = WebApplication.CreateBuilder(args);

var httpLoggingFields = HttpLoggingFields.All;
httpLoggingFields &= ~HttpLoggingFields.ResponseBody;

builder.Services.AddHttpLogging(logging =>
{
    logging.RequestBodyLogLimit = 4096;
    logging.ResponseBodyLogLimit = 4096;

    logging.LoggingFields = httpLoggingFields;

    logging.RequestHeaders.Add("X-Request-Header");
    logging.ResponseHeaders.Add("X-Response-Header");
});

builder.Services.AddControllers().AddNewtonsoftJson();

builder.Services.AddSingleton<IConfiguration>(builder.Configuration);

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
}

app.UseFileServer();
app.UseHttpLogging();

app.UseRouting();

app.MapControllers();

app.Run();
