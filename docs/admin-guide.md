# PrimePlus+ Admin Guide

This guide provides detailed information for administrators managing the PrimePlus+ platform.

## Accessing the Admin Dashboard

### Default Admin Credentials

Upon initial setup, the system automatically creates a default admin account with the following credentials:

- **Username**: admin
- **Email**: admin@primeplus.com
- **Password**: Admin@PrimePlus2025

You can use these credentials to log in to the system. Once logged in as an admin, you'll have access to all admin functionality.

### Admin API Access

Currently, the admin dashboard frontend is still in development. However, all admin functionality is available through the backend API. You can interact with the admin API using tools like Postman, cURL, or by building a temporary frontend.

#### Authentication

Admin API endpoints require authentication with a valid admin token. To get this token:

1. Log in using the admin credentials:
   ```
   POST /api/users/login
   {
     "email": "admin@primeplus.com",
     "password": "Admin@PrimePlus2025"
   }
   ```

2. The response will include a token:
   ```
   {
     "success": true,
     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
     "user": {
       "id": "...",
       "username": "admin",
       "email": "admin@primeplus.com",
       "role": "admin",
       ...
     }
   }
   ```

3. Use this token in all admin API requests by adding it to the Authorization header:
   ```
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

## Managing Admin Users

### View All Admin Users

To view a list of all users with admin privileges:

```
GET /api/admin/admins
```

This will return all admin users in the system.

### Promote a Regular User to Admin

To promote an existing user to admin role:

1. First, identify the user ID of the user you want to promote
   ```
   GET /api/admin/users?search=username
   ```

2. Use the user ID from the response to promote the user:
   ```
   POST /api/admin/users/[userId]/promote
   ```

3. The user will now have admin privileges.

### Revoke Admin Privileges

To remove admin privileges from a user:

```
POST /api/admin/users/[userId]/revoke
```

Note: You cannot revoke admin privileges from the last admin user in the system. There must always be at least one admin user.

## API Endpoints Overview

Below are the main admin API endpoints available:

### Dashboard

- `GET /api/admin/stats` - Get platform statistics and metrics

### User Management

- `GET /api/admin/users` - List all users (with filtering options)
- `GET /api/admin/users/:id` - Get details of a specific user
- `PUT /api/admin/users/:id` - Update user details
- `GET /api/admin/admins` - List all admin users
- `POST /api/admin/users/:userId/promote` - Promote user to admin
- `POST /api/admin/users/:userId/revoke` - Revoke admin privileges

### Content Management

- `GET /api/admin/content` - List all content (with filtering options)

### Creator Verification

- `GET /api/admin/verifications/pending` - Get pending creator verification requests

### Payout Management

- `GET /api/admin/payouts/pending` - Get pending creator payout requests

## Security Notes

1. Change the default admin password immediately after initial login
2. Admin actions are logged for security and accountability
3. Be careful when promoting users to admin role - they will have full system access
4. Always keep your admin token secure and never share it

## Future Development

The admin dashboard frontend is currently in development. Once completed, it will provide a user-friendly interface for all admin functionality. In the meantime, you can use these API endpoints to perform admin actions.

## Content Management

### Content Access Settings

#### Individual Purchase Options
- Minimum price: $0.99
- Creators can set custom prices for each piece of content
- Prices must be set at the time of content upload
- Changes to pricing require admin approval

#### Subscription Pack Integration
- Content can be included in multiple subscription packs
- Creators can select which packs include their content
- Content can be both individually purchasable and included in subscriptions
- Changes to subscription inclusion require admin approval

#### Free Content
- Creators can mark content as free at any time
- Free content remains accessible to all users
- Converting paid content to free requires admin approval

### Content Moderation

#### Pre-Publication Review
- Review content for compliance with platform guidelines
- Check pricing and access settings
- Verify media quality and appropriateness
- Ensure proper content categorization

#### Post-Publication Monitoring
- Monitor reported content
- Review content performance metrics
- Check for pricing anomalies
- Monitor subscription pack distribution

## User Management

### Creator Verification
1. Review creator applications
2. Verify identity documents
3. Check content quality
4. Approve subscription pack pricing
5. Monitor creator performance

### User Access Control
- Manage user roles and permissions
- Handle user reports and disputes
- Monitor user activity
- Manage free access grants

## Subscription Management

### Subscription Packs
- Review and approve new subscription packs
- Monitor pack performance
- Validate pricing structures
- Ensure feature compliance

### Promotional Discounts
- Approve discount campaigns
- Monitor discount usage
- Validate discount codes
- Track promotion performance

## Platform Settings

### Global Settings
- Platform-wide pricing limits
- Content access rules
- User permission levels
- API rate limits

### Security Settings
- Authentication requirements
- Content encryption
- Payment security
- Data protection

## Analytics and Reporting

### Content Analytics
- View content performance metrics
- Monitor access patterns
- Track revenue generation
- Analyze user engagement

### User Analytics
- Monitor user growth
- Track user retention
- Analyze user behavior
- Review subscription patterns

### Financial Analytics
- Track platform revenue
- Monitor payment processing
- Review refund requests
- Analyze pricing effectiveness

## Technical Management

### Performance Monitoring
- Server health checks
- Database performance
- API response times
- Media delivery speed

### Storage Management
- Monitor storage usage
- Manage media compression
- Handle backup systems
- Optimize delivery CDN

## Troubleshooting

### Common Issues
1. Content Access Problems
   - Check user permissions
   - Verify subscription status
   - Review payment history
   - Check content availability

2. Payment Issues
   - Verify payment processor status
   - Check transaction logs
   - Review pricing settings
   - Monitor refund requests

3. Platform Performance
   - Monitor server loads
   - Check database performance
   - Review API logs
   - Monitor media delivery

### Emergency Procedures
1. Content Takedown
   - Immediate content removal
   - User notification
   - Record keeping
   - Legal compliance

2. Security Breaches
   - Account lockdown
   - System audit
   - User notification
   - Recovery procedures

## Best Practices

### Content Management
- Regular content audits
- Consistent pricing reviews
- Clear communication with creators
- Regular performance reviews

### User Support
- Quick response times
- Clear communication
- Proper documentation
- Regular follow-up

### Platform Maintenance
- Regular updates
- Security patches
- Performance optimization
- Feature testing

## Contact Information

### Support Channels
- Admin Support: admin@primeplus.com
- Technical Support: tech@primeplus.com
- Emergency Contact: emergency@primeplus.com

### Response Times
- Critical Issues: 1 hour
- Major Issues: 4 hours
- Regular Issues: 24 hours
- Feature Requests: 1 week