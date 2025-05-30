"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Activity {
  id: number;
  user: {
    name: string;
    avatar?: string;
  };
  action: string;
  target: string;
  timestamp: string;
  type: "create" | "update" | "delete" | "login";
}

const activities: Activity[] = [
  {
    id: 1,
    user: {
      name: "John Doe",
      avatar: "https://ui-avatars.com/api/?name=John+Doe",
    },
    action: "created",
    target: "Introduction to React course",
    timestamp: "2 minutes ago",
    type: "create",
  },
  {
    id: 2,
    user: {
      name: "Jane Smith",
      avatar: "https://ui-avatars.com/api/?name=Jane+Smith",
    },
    action: "updated",
    target: "JavaScript Fundamentals quiz",
    timestamp: "45 minutes ago",
    type: "update",
  },
  {
    id: 3,
    user: {
      name: "Mike Johnson",
      avatar: "https://ui-avatars.com/api/?name=Mike+Johnson",
    },
    action: "deleted",
    target: "Outdated tutorial",
    timestamp: "2 hours ago",
    type: "delete",
  },
  {
    id: 4,
    user: {
      name: "Sarah Wilson",
      avatar: "https://ui-avatars.com/api/?name=Sarah+Wilson",
    },
    action: "logged in",
    target: "",
    timestamp: "5 hours ago",
    type: "login",
  },
  {
    id: 5,
    user: {
      name: "Robert Brown",
      avatar: "https://ui-avatars.com/api/?name=Robert+Brown",
    },
    action: "updated",
    target: "User profile",
    timestamp: "Yesterday",
    type: "update",
  },
];

export function RecentActivity() {
  return (
    <div className="space-y-8">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start gap-4">
          <Avatar className="h-9 w-9">
            <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
            <AvatarFallback>
              {activity.user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="grid gap-1">
            <div className="text-sm font-medium leading-none">
              <span className="font-semibold">{activity.user.name}</span>{" "}
              <Badge
                variant="outline"
                className={cn(
                  "ml-2",
                  activity.type === "create" && "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
                  activity.type === "update" && "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
                  activity.type === "delete" && "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
                  activity.type === "login" && "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                )}
              >
                {activity.action}
              </Badge>
              {activity.target && <span> {activity.target}</span>}
            </div>
            <p className="text-sm text-muted-foreground">{activity.timestamp}</p>
          </div>
        </div>
      ))}
    </div>
  );
}