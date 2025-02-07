
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell } from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  created_at: string;
  read: boolean;
}

interface NotificationsSectionProps {
  notifications: Notification[];
}

export const NotificationsSection = ({ notifications }: NotificationsSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Varsler
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg border ${
                notification.read ? 'bg-gray-50' : 'bg-white'
              }`}
            >
              <h4 className="font-medium">{notification.title}</h4>
              <p className="text-sm text-gray-600 mt-1">
                {notification.message}
              </p>
              <span className="text-xs text-gray-500 mt-2 block">
                {new Date(notification.created_at).toLocaleString('no-NO')}
              </span>
            </div>
          ))}
          {notifications.length === 0 && (
            <p className="text-center text-gray-500 py-4">
              Ingen nye varsler
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
