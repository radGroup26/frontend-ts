import React, { useState, useEffect } from "react";
import { BellRing } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { formatDistanceToNow } from "date-fns";
import axios from "axios";

interface Notification {
  id: string;
  title: string;
  message: string;
  createdAt: string;
}

function Notification() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false); // For toggling between create and edit mode
  const [currentNotification, setCurrentNotification] =
    useState<Notification | null>(null); // To hold the notification being edited
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  //   const fetchNotifications = async () => {
  //     try {
  //       const mockData = [
  //         {
  //           id: "1",
  //           title: "🚪 Heads Up!",
  //           message:
  //             "We're taking a short break and will be closed on 2024.09.15. We can't wait to welcome you back soon. Thank you for your understanding!",
  //           createdAt: "2024-09-03T08:00:00Z",
  //         },
  //       ];
  //       setNotifications(mockData);
  //     } catch (error) {
  //       console.error("Error fetching notifications:", error);
  //     }
  //   };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get("/api/notification/");
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const now = new Date().toISOString();

      if (editMode && currentNotification) {
        // If in edit mode, update the notification
        const updatedNotification = {
          ...currentNotification,
          title,
          message,
        };
        const response = await axios.put(
          `/api/notification/save/${currentNotification.id}`,
          updatedNotification
        );

        setNotifications((prevNotifications) =>
          prevNotifications.map((n) =>
            n.id === currentNotification.id ? response.data : n
          )
        );
      } else {
        // Otherwise, create a new notification
        const response = await axios.post("/api/notification/add", {
          title,
          message,
          createdAt: now,
        });
        const newNotification: Notification = response.data;
        setNotifications((prevNotifications) => [
          ...prevNotifications,
          newNotification,
        ]);
      }

      setTitle("");
      setMessage("");
      setShowForm(false);
      setEditMode(false); // Reset mode to create
      setCurrentNotification(null); // Reset current notification
    } catch (error) {
      console.error("Error creating/updating notification:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/notification/delete/${id}`);
      setNotifications((prevNotifications) =>
        prevNotifications.filter((n) => n.id !== id)
      );
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const handleEdit = (notification: Notification) => {
    setTitle(notification.title);
    setMessage(notification.message);
    setCurrentNotification(notification);
    setShowForm(true);
    setEditMode(true);
  };

  return (
    <div className="flex justify-center min-h-screen">
      <div className="relative m-5 p-5 shadow-lg rounded-lg w-1/2">
        <h2 className="text-2xl text-center font-bold flex items-center">
          Notification <BellRing className="ml-5" />
        </h2>

        <Button
          onClick={() => {
            setShowForm(true);
            setEditMode(false); // Set to create mode
            setTitle("");
            setMessage("");
          }}
          className="absolute top-5 right-5"
        >
          + Create New Notification
        </Button>

        <div className="mt-10">
          <div className="flex flex-col gap-4">
            {notifications &&
              notifications.map((notification) => (
                <Card
                  key={notification.id}
                  className="w-full max-w-[900px] h-auto"
                >
                  <CardHeader>
                    <CardTitle>{notification.title}</CardTitle>
                    <CardDescription>
                      {formatDistanceToNow(new Date(notification.createdAt), {
                        addSuffix: true,
                      })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>{notification.message}</p>
                  </CardContent>
                  <CardFooter className="py-2 space-x-5">
                    <Button
                      variant="outline"
                      onClick={() => handleEdit(notification)}
                    >
                      Edit
                    </Button>
                    <Button onClick={() => handleDelete(notification.id)}>
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </div>
        {/* Create & Edit Form */}
        {showForm && (
          <Card className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-80">
            <div className="bg-white p-6 rounded-lg w-[800px] max-w-[90%]">
              <h2 className="text-lg font-semibold">
                {editMode ? "Edit Notification" : "Create Notification"}
              </h2>
              <form
                onSubmit={handleSubmit}
                className="grid w-full items-center gap-4"
              >
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    type="text"
                    placeholder="Title"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <textarea
                    placeholder="Enter the Message..."
                    id="message"
                    className="flex h-32 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm disabled:opacity-50"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="bg-violet-900 text-white">
                  {editMode ? "Update" : "Publish"}
                </Button>
              </form>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

export default Notification;
