import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "../../../components/ui/avatar";
  
  export function StudentMarks() {
    // Replace with real property activity data as needed
    const activities = [
      {
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        fallback: "AP",
        title: "New Tenant Moved In",
        subtitle: "2-bedroom Apartment, Downtown",
        detail: "Tenant: John Doe",
        value: "Move-in: 2024-06-01"
      },
      {
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        fallback: "RP",
        title: "Rent Payment Received",
        subtitle: "Villa, Ocean View",
        detail: "Tenant: Sarah Lee",
        value: "+$1,200"
      },
      {
        avatar: "https://randomuser.me/api/portraits/men/65.jpg",
        fallback: "MR",
        title: "Maintenance Request",
        subtitle: "Studio, City Center",
        detail: "Leaky faucet reported",
        value: "2 hours ago"
      },
      {
        avatar: "https://randomuser.me/api/portraits/men/12.jpg",
        fallback: "EX",
        title: "Contract Expiring Soon",
        subtitle: "House, Suburbs",
        detail: "Tenant: Ahmed Ben",
        value: "10 days left"
      },
      {
        avatar: "https://randomuser.me/api/portraits/women/22.jpg",
        fallback: "NP",
        title: "New Property Listed",
        subtitle: "Luxury Penthouse, Uptown",
        detail: "Listing ID: #1023",
        value: "Just now"
      },
    ];
    return (
      <div className="space-y-8">
        {activities.map((activity, idx) => (
          <div className="flex items-center" key={idx}>
            <Avatar className="h-9 w-9">
              <AvatarImage src={activity.avatar} alt="Avatar" />
              <AvatarFallback>{activity.fallback}</AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">{activity.title}</p>
              <p className="text-xs text-muted-foreground">{activity.subtitle}</p>
              <p className="text-xs text-muted-foreground">{activity.detail}</p>
            </div>
            <div className="ml-auto text-right">
              <p className="font-medium text-xs text-primary-modern">{activity.value}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }
  