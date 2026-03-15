# Admin Guide

## Overview

The Admin Dashboard provides full control over the FORGES platform.

Access: Navigate to **Admin** in the top navigation bar (requires Admin role).

## User Management

### View Users
The **Users** tab shows all platform users with:
- Name and email
- Current role (Admin, Developer, User, Auditor)
- Account status (active/inactive)
- Join date

### Add a User
Click **Add User** to invite a new team member.

### Change User Role
Click the ⋯ menu next to a user to change their role.

## Billing Controls

The **Billing** tab provides:
- Current plan and renewal date
- Seat usage (current / maximum)
- Monthly cost breakdown (base + overage)
- Per-resource usage limits

## API Monitoring

The **API Monitor** tab shows:
- Request volume over the last 24 hours
- Total requests, error rate, and average response time

## Audit Logs

All admin actions are recorded in the **Audit Logs** tab:
- Action description
- Actor (who performed it)
- Target (what was affected)
- Timestamp

## Configuration

The **Config** tab allows enabling/disabling:
- OAuth providers (GitHub, Google)
- Rate limiting
- Two-factor authentication enforcement
- SSO/SAML integration
- IP allowlisting
