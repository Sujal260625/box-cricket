# Role-Based Feature Division in TurfFlow Application

## Overview
This document outlines how features and components are divided among different user roles in the TurfFlow sports ground management system. The application supports three primary user roles: Admin, Staff, and Regular Users, each with distinct permissions and access to specific features.

## User Roles

### 1. Admin Role
Admin users have the highest level of access and control over the entire system. They can manage all aspects of the application.

#### Dashboard Access
- **AdminDashboard** - Comprehensive overview of the entire system

#### Key Features Available to Admins:
- **System Overview** - View analytics and metrics for the entire platform
- **Payment Analytics** - Monitor financial transactions across all turfs
- **Ongoing Matches** - Track live matches happening across all venues
- **Booking Management** - Oversee all bookings system-wide
- **Booking Conflict Detection** - Identify and resolve scheduling conflicts
- **Staff Tracking** - Monitor staff locations and availability
- **Inventory Management** - Manage equipment and supplies across all locations
- **Report Generation** - Export various analytical reports
- **Turf Management** - Configure and manage all turfs in the system
- **Store Management** - Oversee all store operations
- **Staff Management** - View and manage all staff members
- **Analytics** - Access to detailed business intelligence and metrics

#### Authentication Pattern
- Email addresses containing "admin" grant admin access
- Default admin login: admin@turfflow.com with password admin123

---

### 2. Staff Role
Staff members have operational-level access to manage day-to-day activities at their assigned locations.

#### Dashboard Access
- **StaffDashboard** - Operational view focused on assigned tasks

#### Key Features Available to Staff:
- **Assigned Task Overview** - View their daily assignments and tasks
- **Assigned Payments** - Collect and process payments for assigned bookings
- **Ongoing Match Monitoring** - Update scores and monitor live matches they're responsible for
- **Booking Management** - Manage bookings assigned to them
- **Store Inventory** - Manage inventory at their assigned location
- **Task Completion** - Mark tasks as completed (bookings, payments, etc.)

#### Operational Capabilities:
- Mark payments as collected
- Update live match scores (if they have permission)
- Confirm/cancel bookings assigned to them
- Update inventory levels
- View their assigned tasks for the day

#### Authentication Pattern
- Email addresses containing "staff" grant staff access
- Default staff login: staff@turfflow.com with password staff123

---

### 3. Regular User Role
Regular users are customers who book turfs, participate in tournaments, and use the services.

#### Dashboard Access
- **UserDashboard** - Personalized view of their bookings and activities

#### Key Features Available to Users:
- **Personal Overview** - Dashboard with their upcoming bookings and statistics
- **Booking Management** - Create, view, and manage their own bookings
- **Booking History** - Access to past booking records
- **Payment History** - View their payment transaction history
- **Tournament Participation** - Join and participate in tournaments
- **Live Scores** - View live match scores (but not update them)
- **Online Store** - Purchase items from the store
- **Challenge System** - Participate in challenges
- **Profile Management** - Update personal information
- **Reviews** - Submit and view reviews for turfs

#### Personal Capabilities:
- Book turfs
- Join tournaments and challenges
- Make purchases from stores
- Submit reviews for turfs
- View their booking and payment history
- Update their profile information

#### Authentication Pattern
- Default user login: user@turfflow.com with password user123

---

## Component Organization by Role

### Shared Components (Available to all roles)
- Navigation
- Login Page
- Home Page
- Turf Listings
- Turf Details
- Live Scores
- Tournaments
- Reviews

### Admin-Specific Components
- AdminDashboard
- StaffLocationTracker
- BookingConflictDetector
- InventoryManagement
- ExportReports

### Staff-Specific Components
- StaffDashboard
- (Access to simplified versions of booking/payment features)

### User-Specific Components
- UserDashboard
- OnlineStore
- ChallengeSystem

## Access Control Logic

The application determines user roles based on email patterns during authentication:
- If email contains "admin" → Assigns admin role
- If email contains "staff" → Assigns staff role
- Otherwise → Assigns user role

Role-based access is enforced throughout the application:
- Unauthorized users are redirected to the login page
- Each dashboard checks user role before rendering content
- Sensitive operations (like score updates) are restricted to admin/staff roles

## Permissions Summary

| Feature | Admin | Staff | User |
|---------|-------|-------|------|
| View Bookings | ✓ | Assigned | Own |
| Create Bookings | ✓ | Limited | ✓ |
| Update Scores | ✓ | ✓* | Limited View |
| Process Payments | ✓ | Assigned | N/A |
| Manage Inventory | ✓ | Location | N/A |
| View Reports | ✓ | Limited | N/A |
| Manage Turfs | ✓ | N/A | N/A |
| Manage Staff | ✓ | N/A | N/A |
| Access Analytics | ✓ | N/A | N/A |

*Staff can update scores only for matches they are assigned to monitor

## Folder Structure

The components have been organized into role-specific folders:

```
src/
├── components/
│   ├── admin/
│   │   ├── AdminDashboard.tsx
│   │   ├── StaffLocationTracker.tsx
│   │   ├── BookingConflictDetector.tsx
│   │   ├── InventoryManagement.tsx
│   │   └── ExportReports.tsx
│   ├── staff/
│   │   └── StaffDashboard.tsx
│   ├── user/
│   │   ├── UserDashboard.tsx
│   │   ├── OnlineStore.tsx
│   │   └── ChallengeSystem.tsx
│   └── (shared components remain at the root level)
```

This structure makes it easier to understand and maintain role-specific functionality while keeping the codebase organized.