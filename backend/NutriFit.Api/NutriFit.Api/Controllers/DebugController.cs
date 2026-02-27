using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

[ApiController]
[Route("api/debug")]
public class DebugController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IConfiguration _config;

    public DebugController(AppDbContext db, IConfiguration config)
    {
        _db = db;
        _config = config;
    }

    [HttpGet("diagnose")]
    public IActionResult Diagnose()
    {
        var report = new List<string>();
        report.Add("--- DIAGNOSTICS REPORT ---");
        report.Add($"Server Time: {DateTime.Now}");

        // 0. Config
        var connStr = _config.GetConnectionString("DefaultConnection") ?? _config["DefaultConnection"];
        report.Add($"Connection String found in Config: {!string.IsNullOrEmpty(connStr)}");
        if (!string.IsNullOrEmpty(connStr))
        {
             report.Add($"Connection String starts with: {connStr.Substring(0, Math.Min(20, connStr.Length))}...");
        }

        try
        {
            // 1. Connection
            report.Add("Checking Database Connection...");
            try 
            {
                _db.Database.OpenConnection();
                report.Add("✅ Database Connected.");
                _db.Database.CloseConnection();
            }
            catch(Exception ex)
            {
                report.Add($"❌ Database Connection Failed: {ex.Message}");
                if (ex.InnerException != null) report.Add($"   Inner: {ex.InnerException.Message}");
                return Ok(report);
            }

            // 2. Migrations
            report.Add("Checking Migrations...");
            try 
            {
                var pending = _db.Database.GetPendingMigrations().ToList();
                var applied = _db.Database.GetAppliedMigrations().ToList();
                
                report.Add($"Applied Migrations: {applied.Count}");
                report.Add($"Pending Migrations: {pending.Count}");
                
                if (pending.Any())
                {
                    report.Add("⚠️ MISSING MIGRATIONS DETECTED:");
                    foreach(var m in pending) report.Add($" - {m}");
                }
                else
                {
                    report.Add("✅ Schema should be up to date.");
                }
            }
            catch(Exception ex)
            {
                report.Add($"❌ Migration Check Failed: {ex.Message}");
            }

            // 3. Tables
            report.Add("Checking Tables...");
            
            CheckTable(report, "Users", () => _db.Users.FirstOrDefault());
            CheckTable(report, "UserProfiles", () => _db.UserProfiles.FirstOrDefault());
            CheckTable(report, "UserHealthConditions", () => _db.UserHealthConditions.FirstOrDefault());
            CheckTable(report, "WorkoutPlans", () => _db.WorkoutPlans.FirstOrDefault());
            CheckTable(report, "DietPlans", () => _db.DietPlans.FirstOrDefault());

        }
        catch (Exception ex)
        {
            report.Add(ex.StackTrace ?? "No stack trace available");
        }

        return Ok(report);
    }

    private void CheckTable<T>(List<string> report, string name, Func<T> query)
    {
        try
        {
            query();
            report.Add($"✅ Table '{name}' is accessible.");
        }
        catch (Exception ex)
        {
            report.Add($"❌ Table '{name}' ERROR: {ex.Message}");
        }
    }
}

